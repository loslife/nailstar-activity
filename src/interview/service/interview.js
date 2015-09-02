var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.count = count;
exports.postlike = postlike;
exports.getLikeCount = getLikeCount;
exports.getAllLikeCount = getAllLikeCount;

//count
function count(req, res, next){

    res.send("ok");

    var id = uuid.v1();
    var source = req.body["useragent"] || 2;// 未知来源设置为2
    var sub_source = req.body["t"];// 老师id
    var now = new Date().getTime();
    var activity = "interview";

    var sql = "insert into page_view_history (id, activity, source, create_date, sub_source) " +
        "values (:id, :activity, :source, :create_date, :sub_source)";
    dbHelper.execSql(sql, {id: id, activity: activity, source: source, create_date: now, sub_source: sub_source}, function(err){
        console.log(err);
    });
}

//点赞
function postlike(req, res, next){
    var t = req.body["t"];
    if(!t){
        next({errMsg: '缺失参数t'});
        return;
    }
    var sql = "update like_records set num = num + 1 where id = :t";
    dbHelper.execSql(sql, {t: t}, function(err){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, {message: 'ok'});
    });
}

//获取点赞数量
function getLikeCount(req, res, next){
    var t = req.query["t"];
    if(!t){
        doResponse(req, res, {message: '缺失参数t'});
    }
    var sql = "select num from like_records where id = :t";
    dbHelper.execSql(sql, {t: t}, function(err, result){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, {count: result[0].num});
    });
}

//获取所有老师点赞数
function getAllLikeCount(req, res, next){
    var sql = "select id 't',num 'count' from like_records order by t";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, {counts: result});
    });
}