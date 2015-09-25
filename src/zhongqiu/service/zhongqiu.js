var api = require("wechat-toolkit");
var async = require("async");
var _ = require("underscore");
var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var dataUrl = require('dataurl');
var fs = require('fs');
var oss = require(FRAMEWORKPATH + "/utils/ossClient");

var app_id = "wxb931d3d24994df52";
var app_secret = "06981df67deff478460cbf396b21f016";

exports.route = route;
exports.info = info;
exports.infos = infos;
exports.uploadImage = uploadImage;
exports.addRecord = addRecord;
exports.vote = vote;

function route(req, res, next){

    var state = req.query["state"];
    var code = req.query["code"];
    var source_union_id = req.params["unionId"];

    // 非微信OAuth跳转
    if(!code){
        res.send("请通过微信打开此页面");
        return;
    }

    var open_id;
    var union_id;
    var oauth2_access_token;
    var nickname;
    var headimgurl;
    var count;

    async.series([_exchangeOauth2AccessToken, _getFanInfo, _queryIsExist, _recordUser], function(err){

        if(err){
            console.log(err);
            next(err);
            return;
        }

        var redirectUrl;

        // 访问别人页面
        if(source_union_id !== union_id){

            _checkVote(function(err, canVote){

                if(err){
                    console.log(err);
                    next(err);
                    return;
                }

                redirectUrl = "http://huodong.naildaka.com/zhongqiu/friend.html?union_id=" + source_union_id + "&can_vote=" + canVote + "&my_union_id=" + union_id;
                res.redirect(redirectUrl);
            });

            return;
        }

        // 自己访问自己的页面
        _resolveHasUpload(function(err, flag){

            if(err){
                console.log(err);
                next(err);
                return;
            }

            if(flag){
                redirectUrl = "http://huodong.naildaka.com/zhongqiu/ranking.html?union_id=" + union_id;
            }else{
                redirectUrl = "http://huodong.naildaka.com/zhongqiu/me.html?union_id=" + union_id;
            }

            res.redirect(redirectUrl);
        });

        function _checkVote(callback){

            var sql = "select count(1) 'count' from zhongqiu_vote_history where voting_union_id = :voting_id and voted_union_id = :voted_id";

            dbHelper.execSql(sql, {voting_id: union_id, voted_id: source_union_id}, function(err, result) {

                if (err) {
                    callback(err);
                    return;
                }

                var hasVote = result[0].count > 0;

                if(hasVote){
                    callback(null, 0);
                }else{
                    callback(null, 1);
                }
            });
        }

        function _resolveHasUpload(callback) {

            var sql = "select count(1) 'count' from zhongqiu_records where union_id = :unionId";

            dbHelper.execSql(sql, {unionId: union_id}, function (err, result) {

                if (err) {
                    callback(err);
                    return;
                }

                callback(null, result[0].count > 0);
            });
        }
    });

    function _exchangeOauth2AccessToken(callback){

        api.exchangeAccessToken(app_id, app_secret, code, function(err, result){

            if(err){
                callback(err);
                return;
            }

            open_id = result.openid;
            union_id = result.unionid;
            oauth2_access_token = result.access_token;

            callback(null);
        });
    }

    function _getFanInfo(callback) {

        api.getUserInfo(oauth2_access_token, open_id, function(err, body) {

            if(err){
                callback(err);
                return;
            }

            nickname = body.nickname;
            headimgurl = body.headimgurl;

            callback(null);
        });
    }

    // 查询是否存在此用户
    function _queryIsExist(callback){

        var sel_sql = "select count(1) 'count' from weixin_users where unionId = :unionId";

        dbHelper.execSql(sel_sql, {unionId: union_id}, function(err, result){

            if(err){
                callback(err);
                return;
            }

            count = result[0].count;
            callback();
        });
    }

    // 记录用户信息
    function _recordUser(callback){

        var sql;
        var params;

        if(count > 0){

            // 存在，更新用户信息
            sql = "update weixin_users set nickname = :nickname,headImg = :headImg where unionId = :unionId";
            params = {nickname: nickname,headImg: headimgurl, unionId: union_id};
            dbHelper.execSql(sql, params, function(err){
                callback(err);
            });

        }else{

            var id = uuid.v1();
            var now = new Date().getTime();

            // 不存在，存储用户信息
            sql = "insert into weixin_users(id, service_open_id, unionId, nickname, headImg, createDate) values(:id, :serviceOpenId, :unionId, :nickname, :headImg, :createDate)";
            params = {id: id, serviceOpenId: open_id, unionId: union_id, nickname: nickname, headImg: headimgurl, createDate: now};
            dbHelper.execSql(sql, params, function(err){
                callback(err);
            });
        }
    }
}

function info(req, res, next){

    var source_union_id = req.params["unionId"];

    var sql1 = "select a.vote_count as 'count', a.pic_url as 'url', b.nickname, b.headImg from zhongqiu_records a, weixin_users b where a.union_id = b.unionId and a.union_id = :union_id";
    var sql2 = "select count(1) as count from zhongqiu_records where vote_count > :vote";

    dbHelper.execSql(sql1, {union_id: source_union_id}, function(err, results) {

        if(err) {
            console.log(err);
            next(err);
            return;
        }

        if(results.length === 0){
            doResponse(req, res, {vote: 0, url: "", nickname: "", avatar: "", ranking: 0});
            return;
        }

        var obj = results[0];

        dbHelper.execSql(sql2, {vote: obj.count}, function(err, results) {

            if(err){
                console.log(err);
                next(err);
                return;
            }

            var beyond = results[0].count;
            doResponse(req, res, {vote: obj.count, url: obj.url, nickname: obj.nickname, avatar: obj.headImg, ranking: beyond + 1});

        });
    });
}

function infos(req, res, next){

    var page = req.query["page"] || 1;
    var perPage = 20;
    var startIndex = perPage * (page - 1);

    var sql = "select a.vote_count as 'count', a.pic_url as 'url', a.union_id, b.nickname, b.headImg from zhongqiu_records a, weixin_users b where a.union_id = b.unionId order by count desc limit :start, :size";

    dbHelper.execSql(sql, {start: startIndex, size: perPage}, function(err, results) {

        if(err) {
            next(err);
            return;
        }

        var objs = [];

        _.each(results, function(item){

            var temp = {};
            temp.vote = item.count;
            temp.url = item.url;
            temp.nickname = item.nickname;
            temp.avatar = item.headImg;
            temp.unionid = item.union_id;

            objs.push(temp);
        });


        doResponse(req, res, {datas: objs});
    });
}

function uploadImage(req, res, next){

    var path = __dirname + "/" + uuid.v1() + ".jpg";
    var imageInfo = dataUrl.parse(req.body.image);

    fs.writeFile(path, imageInfo.data, 'binary', function(err){

        if(err){
            console.log(err);
            next(err);
            return;
        }

        oss.putPictureObjectToOss(path, function(err, result){

            if(err){
                console.log(err);
                next(err);
                return;
            }

            fs.unlink(path, function(err){

                if(err){
                    console.log(err);
                    next(err);
                    return;
                }

                doResponse(req, res, {picUrl: result["oss_url"]});
            });
        });
    });
}

function addRecord(req, res, next){

    var pic_url = req.body.picurl;
    var union_id = req.body.unionid;
    var id = uuid.v1();
    var now = new Date().getTime();

    var sql = "insert into zhongqiu_records (id, union_id, pic_url, create_date) values (:id, :union_id, :pic_url, :create_date);";

    dbHelper.execSql(sql, {id: id, union_id: union_id, pic_url: pic_url, create_date: now}, function(err) {

        if(err) {
            next(err);
            return;
        }

        doResponse(req, res, {message: "ok"});
    });
}

function vote(req, res, next){

    var friend_union_id = req.body.friend_union_id;
    var my_union_id = req.body.my_union_id;
    var source = req.body.source || 2;// 0表示在投票页面投的，1表示在梦想墙投的，2表示未知

    var sql1 = "select count(1) 'count' from zhongqiu_vote_history where voting_union_id = :voting_id and voted_union_id = :voted_id";
    var sql2 = "insert into zhongqiu_vote_history (id, voting_union_id, voted_union_id, create_date, source) values(:id, :voting_id, :voted_id, :create_date, :source)";
    var sql3 = "update zhongqiu_records set vote_count = vote_count + 1 where union_id = :union_id";

    dbHelper.execSql(sql1, {voting_id: my_union_id, voted_id: friend_union_id}, function(err, result) {

        if (err) {
            console.log(err);
            next(err);
            return;
        }

        var hasVote = result[0].count > 0;

        if(hasVote){
            console.log("has voted");
            doResponse(req, res, {code: 1, message: "duplicated vote"});
            return;
        }

        var id = uuid.v1();
        var now = new Date().getTime();
        var params = {id: id, voting_id: my_union_id, voted_id: friend_union_id, create_date: now, source: source};

        dbHelper.execSql(sql2, params, function(err){

            if(err){
                console.log(err);
                next(err);
                return;
            }

            dbHelper.execSql(sql3, {union_id: friend_union_id}, function(err){

                if(err){
                    console.log(err);
                    next(err);
                    return;
                }

                doResponse(req, res, {message: "ok"});
            });
        });
    });
}