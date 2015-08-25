var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.postlike = postlike;
exports.getLikeCount = getLikeCount;

//点赞
function postlike(req, res, next){
    var t = req.params["t"];
    if(!t){
        doResponse(req, res, {message: '缺失参数t'});
    }
    var sql = "update like_records set num = num + 1 where teacherId = :t";
    dbHelper.execSql(sql, {}, function(err){
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
    var sql = "select num from like_records where teacherId = :t";
    dbHelper.execSql(sql, {t: t}, function(err, result){
        if(err){
            next(err);
            return;
        }
        doResponse(req, res, {count: result[0].num});
    });
}