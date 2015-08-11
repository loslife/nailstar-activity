var api = require("wechat-toolkit");
var async = require("async");
var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

var app_id = "wxb931d3d24994df52";
var app_secret = "Yang198609Los1933ezsd230926huang";

exports.route = route;
exports.getMoney = getMoney;
exports.getInfo = getInfo;

function route(req, res, next){

    var state = req.query["state"];
    var code = req.query["code"];
    var originId = req.query["originId"];

    // 非微信OAuth跳转
    if(!code){
        res.send("请通过微信打开此页面");
        return;
    }

    var open_id;
    var oauth2_access_token;
    var nickname;
    var headimgurl;

    async.series([_exchangeOauth2AccessToken, _getFanInfo], function(err){

        if(err){
            console.log(err);
            next(err);
            return;
        }

        var count;
        async.series([_queryIsExist, _recordUser], function(err){
            if(err){
                return next(err);
            }
            if(originId){
                var red_url = "http://wx.naildaka.com/fahongbao/want.html?openId=" + originId;
                res.redirect(red_url);
            }else {
                var red_url = "http://wx.naildaka.com/fahongbao/share.html?openId=" + open_id;
                res.redirect(red_url);
            }
        });

        //查询是否存在此用户
        function _queryIsExist(nextStep){
            var sel_sql = "select count(1) 'count' from users where openId = :openId";
            dbHelper.execSql(sel_sql, {openId: open_id}, function(err, result){
                if(err){
                    nextStep(err);
                    return;
                }
                count = result[0].count;
                nextStep();
            });
        }
        //记录用户信息
        function _recordUser(nextStep){
            if(count > 0){
                //存在，更新用户信息
                var sql = "update users set nickname = :nickname,headImg = :headImg where openId = :openId";
                var params = {nickname: nickname,headImg: headimgurl, openId: open_id};
                dbHelper.execSql(sql, params, function(err){
                    if(err){
                        nextStep(err);
                        return;
                    }
                    nextStep();
                });
            }else{
                //不存在，存储用户信息
                var sql = "insert into users(openId,originId,nickname,headImg,createDate) values(:openId,:originId,:nickname,:headImg,:createDate)";
                var params = {openId: open_id,originId: originId,nickname: nickname,headImg: headimgurl, createDate: new Date().getTime()};
                dbHelper.execSql(sql, params, function(err){
                    if(err){
                        nextStep(err);
                        return;
                    }
                    nextStep();
                });
            }
        }

    });

    function _exchangeOauth2AccessToken(callback){

        api.exchangeAccessToken(app_id, app_secret, code, function(err, result){

            if(err){
                callback(err);
                return;
            }

            open_id = result.openid;
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
}

//获取抢红包金额
function getMoney(req, res, next){

    var openId = req.query["openId"];
    if(!openId){
        next({errMessage: "缺少openId"});
        return;
    }

    //查询是否抢过红包
    var sel_sql = "select count(1) 'count' from hb_records where openId = :openId";
    dbHelper.execSql(sel_sql, {openId: openId}, function(err, result) {
        if (err) {
            next(err);
            return;
        }
        var count = result[0].count;
        //已抢过红包
        if (count > 0) {
            doResponse(req, res, {});
            return;
        }
        //未抢过红包
        //生成1至100的随机数
        var money = parseInt(Math.random() * 100) + 100;
        var id = uuid.v1();
        //记录此次抢红包
        var ins_sql = "insert into hb_records(id, openId, money, date) values(:id, :openId, :money)";
        dbHelper.execSql(ins_sql, {id: id,openId: openId,money: money,date: new Date().getTime()}, function (err) {
            if (err) {
                next(err);
                return;
            }
            doResponse(req, res, {money: money});

            //异步调用发红包接口
            sendRedPack(openId, money);
            //同时为originId发红包
            sendRedPackToOrigin(openId, money);
        });
    });
}

//查询用户信息
function getInfo(req, res, next){
    var openId = req.params["openId"];
    if(!openId){
        res.send("缺少openId");
        return;
    }
    var sql = "select nickname,headImg from users where openId = :openId";
    dbHelper.execSql(sql, {openId: openId}, function(err, result){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, result[0]);
    });
}

function sendRedPackToOrigin(openId, money){
    //根据openId查询originId
    var sql = "select originId from users where openId = :openId";
    dbHelper.execSql(sql, {openId: openId}, function(err, result){
        if(err){
            next(err);
            return;
        }
        //存在分享来源用户
        if(result[0].originId){
            sendRedPack(result[0].originId, money);
        }
    });
}

function sendRedPack(openId, money) {
    var params = {
        mch_id: "1255492301",
        wxappid: app_id,
        nick_name: "美甲大咖",
        send_name: "美甲大咖",
        re_openid: openId,
        total_amount: money,
        wishing: "恭喜发财，大吉大利!",
        act_name: "美甲大咖送红包活动",
        remark: "快来领啊",
        logo_imgurl: "http://ypicture.oss-cn-hangzhou.aliyuncs.com/120.png"
    };
    api.cash_redpack(params, app_secret, "/Users/apple/git_local/wechat-toolkit/cer/apiclient_cert.p12", function (err, code, result) {

        if (err) {
            console.log(err);
            return;
        }

        if (code === 0) {
            console.log("调用成功");
        } else {
            console.log("调用失败");
        }

        console.log(result);
    });
}
