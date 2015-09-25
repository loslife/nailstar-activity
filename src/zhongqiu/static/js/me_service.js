var host = "http://huodong.naildaka.com/svc/zhongqiu";

//上传图片接口
function uploadImage(data, callback){
    var url = host + "/uploadImage";
    postRequest(url, data, callback);
}

//上传图片信息接口
function addRecord(data, callback){
    var url = host + "/addRecord";
    postRequest(url, data, callback);
}

//分享回调
function shareRecord() {
    getRequest('http://huodong.naildaka.com/svc/stat/share?activity=zhongqiu', function (error, date) {
        if (data.code != 0) {
            console.log('err');
        } else {
            console.log('ok');
        }
    });
}

//封装post请求
function postRequest(url ,data,callback){
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        beforeSend: function(request) {
            request.setRequestHeader("xhr", "true");
        },
        xhrFields:{withCredentials:true},
        crossDomain:true,
        success:function(data){
            callback(null,data);
        },
        error: function(error){
            console.log(error);
        },
        dataType:"json"
    });
}

//封装get请求
function getRequest(url,callback){
    $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function(request) {
            request.setRequestHeader("xhr", "true");
        },
        xhrFields:{withCredentials:true},
        crossDomain:true,
        success:function(data){
            callback(null,data);
        },
        error: function(error){
            console.log(error);
        },
        dataType: "json"
    });
}