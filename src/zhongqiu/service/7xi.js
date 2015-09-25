var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.count = count;

function count(req, res, next){

    res.send("ok");

    var id = uuid.v1();
    var source = req.query["useragent"] || 2;// 未知来源设置为2
    var now = new Date().getTime();
    var activity = "7xi";

    var sql = "insert into page_view_history (id, activity, source, create_date) values (:id, :activity, :source, :create_date)";
    dbHelper.execSql(sql, {id: id, activity: activity, source: source, create_date: now}, function(err){
        console.log(err);
    });
}