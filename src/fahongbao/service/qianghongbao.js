var api = require("wechat-toolkit");
var async = require("async");
var uuid = require('node-uuid');
var moment = require('moment');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

var app_id = "wxb931d3d24994df52";
var app_secret = "06981df67deff478460cbf396b21f016";
var redpack_secret = "Yang198609Los1933ezsd230926huang";
var p12_path = "/usr/local/YAE-nailstar-activity/cer/apiclient_cert.p12";
var total = 100000;//每日总额1000元

exports.route = route;
exports.getMoney = getMoney;
exports.getInfo = getInfo;

function route(req, res, next){

    var state = req.query["state"];
    var code = req.query["code"];
    var originId = req.params["originId"];

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

            var redirectUrl;

            if(originId === open_id){
                redirectUrl = "http://huodong.naildaka.com/fahongbao/self.html?openId=" + open_id;// 自己访问自己的页面
            }else{
                redirectUrl = "http://huodong.naildaka.com/fahongbao/others.html?openId=" + originId;// 访问他人分享出来的页面
            }

            res.redirect(redirectUrl);
        });

        //查询是否存在此用户
        function _queryIsExist(nextStep){

            var sel_sql = "select count(1) 'count' from weixin_users where openId = :openId";

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

            var sql;
            var params;

            if(count > 0){
                //存在，更新用户信息
                sql = "update weixin_users set nickname = :nickname,headImg = :headImg where openId = :openId";
                params = {nickname: nickname,headImg: headimgurl, openId: open_id};
                dbHelper.execSql(sql, params, function(err){
                    if(err){
                        nextStep(err);
                        return;
                    }
                    nextStep();
                });

            }else{

                //不存在，存储用户信息
                sql = "insert into weixin_users(openId, nickname, headImg, createDate) values(:openId, :nickname, :headImg, :createDate)";
                params = {openId: open_id, nickname: nickname, headImg: headimgurl, createDate: new Date().getTime()};
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

    /* status
     *  0 正常
     *  1 已抢过红包
     *  2 到达限额
     * */

    var openId = req.query["openId"];
    var type = req.query["type"];

    if(!openId || !type){
        next({errMessage: "参数错误"});
        return;
    }

    var money = 100;// 1元

    // 查询是否抢过红包
    var sel_sql = "select count(1) 'count' from hongbao_records where openId = :openId and type = :type";
    dbHelper.execSql(sel_sql, {openId: openId, type: type}, function(err, result) {

        if (err) {
            next(err);
            return;
        }

        var count = result[0].count;

        //已抢过红包
        if (count > 0) {
            doResponse(req, res, {status: 1});
            return;
        }

        //未抢过红包
        //判断是否超过限额
        isOverTotal(function(err, flag){
            if(err){
                next(err);
                return;
            }
            if(flag){

                doResponse(req, res, {status: 2});

            }else{

                doResponse(req, res, {status: 0,money: money});
                //异步调用发红包接口
                sendRedPack();

            }
        });
    });

    //发红包
    function sendRedPack() {

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

        api.cash_redpack(params, redpack_secret, p12_path, function (err, code, result) {

            if(err){
                console.log("调用失败");
                console.log(err);
                return;
            }

            if(code !== 0){
                console.log("调用失败");
                console.log(result);
                return;
            }

            var id = uuid.v1();

            //红包发放记录
            var ins_sql = "insert into hongbao_records(id, openId, money, type, createDate) values(:id, :openId, :money, :type, :createDate)";
            dbHelper.execSql(ins_sql, {id: id, openId: openId, money: money, type: type, createDate: new Date().getTime()}, function (err){

                if(err){
                    console.log("写入红包记录失败");
                    console.log(err);
                }
            });
        });
    }
}

//查询用户信息
function getInfo(req, res, next){
    var openId = req.params["openId"];
    if(!openId){
        res.send("缺少openId");
        return;
    }
    var sql = "select nickname,headImg from weixin_users where openId = :openId";

    dbHelper.execSql(sql, {openId: openId}, function(err, result){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, result[0]);
    });
}

//判断是否超过当天总额
function isOverTotal(callback){
    var begin = moment().startOf('day').valueOf();
    var end = moment().endOf('day').valueOf();
    var sql = "select sum(money) 'sum' from hongbao_records where createDate > :begin and createDate < :end";
    dbHelper.execSql(sql, {begin: begin, end: end}, function (err, result){

        if(err){
            callback(err);
            return;
        }

        var sum = result[0].sum;
        if(sum >= total){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
}

