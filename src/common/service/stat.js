var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.count = count;
exports.shareCount = shareCount;

function count(req, res, next){

    res.send("ok");

    var id = uuid.v1();
    var activity = req.query["activity"] || "unknown";
    var source = req.query["useragent"] || 2;// 微信来源为1，未知来源设置为2
    var now = new Date().getTime();

    var sql = "insert into page_view_history (id, activity, source, create_date) values (:id, :activity, :source, :create_date)";
    dbHelper.execSql(sql, {id: id, activity: activity, source: source, create_date: now}, function(err){
        console.log(err);
    });
}

function shareCount(req, res, next){

    res.send("ok");

    var id = uuid.v1();
    var activity = req.query["activity"] || "unknown";
    var now = new Date().getTime();

    var sql = "insert into page_share_history (id, activity, create_date) values (:id, :activity, :create_date)";
    dbHelper.execSql(sql, {id: id, activity: activity, create_date: now}, function(err){
        console.log(err);
    });
}