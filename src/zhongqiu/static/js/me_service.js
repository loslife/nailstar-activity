var host = "http://192.168.1.115:5013/vapi2";

//上传图片接口
function uploadImage(data, callback){
    var url = host + "/nailstar/uploadImageWeixin";
    postRequest(url, data, callback);
}

//上传图片信息接口
function uploadImageInfo(data, callback){

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