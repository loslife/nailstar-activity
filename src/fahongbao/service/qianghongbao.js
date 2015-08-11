var api = require("wechat-toolkit");
var async = require("async");
var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

var app_id = "wxb931d3d24994df52";
var app_secret = "06981df67deff478460cbf396b21f016";

exports.route = route;
exports.getMoney = getMoney;

function route(req, res, next){

    var state = req.query["state"];
    var code = req.query["code"];

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

        var red_url = "http://wx.naildaka.com/fahongbao/share.html?open_id=" + open_id
            + "&nickname=" + nickname + "&headImg=" + headimgurl;
        res.redirect(red_url);
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

    var open_id = req.query["open_id"];
    if(!open_id){
        next({errMessage: "缺少open_id"});
        return;
    }

    //查询是否抢过红包
    var sel_sql = "select count(1) 'count' from hb_records where openId = :openId";
    dbHelper.execSql(sql, {openId: open_id}, function(err, result) {
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
        var money = parseInt(Math.random() * 100);
        var id = uuid.v1();
        //记录此次抢红包
        var ins_sql = "insert into hb_records(id, openId, money, date) values(:id, :openId, :money)";
        dbHelper.execSql(sql, {id: id,openId: open_id,money: money,date: new Date().getTime()}, function (err) {
            if (err) {
                next(err);
                return;
            }
            doResponse(req, res, {money: money});
            //异步调用发红包接口
            var params = {
                mch_id: "1255492301",
                wxappid: "wxb931d3d24994df52",
                nick_name: "美甲大咖",
                send_name: "美甲大咖",
                re_openid: "oZWB6wVxwZBN17OpjsxoV_UX-b8Y",
                total_amount: 100,
                wishing: "测试发送红包",
                act_name: "美甲大咖送红包活动",
                remark: "快来领啊",
                logo_imgurl: "http://ypicture.oss-cn-hangzhou.aliyuncs.com/120.png"
            };

            api.cash_redpack(params, "Yang198609Los1933ezsd230926huang", "/Users/apple/git_local/wechat-toolkit/cer/apiclient_cert.p12", function(err, code, result){

                if(err){
                    console.log(err);
                    return;
                }

                if(code === 0){
                    console.log("调用成功");
                }else{
                    console.log("调用失败");
                }

                console.log(result);
            });
        });
    });
}
