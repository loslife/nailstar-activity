Zepto(function($){

    //设置用户信息
    var open_id = getQueryString("openId");

    //获取用户名称和头像
    var urlUser = "http://huodong.naildaka.com/svc/hongbao/getInfo/" + open_id;
    getRequest(urlUser,function(err,data){
        if(err){
            console.log(err);
            return;
        }
        if(data && data.result && data.result.nickname){
            $("#nickname").text(data.result.nickname);
        }
        if(data && data.result && data.result.headImg){
            $("#headImg").attr('src',data.result.headImg);
        }
    });

    $("#want").click(function(){
        //获取红包金额
        var url = "http://huodong.naildaka.com/svc/hongbao/getMoney?openId=" + open_id + "&type=2";
        getRequest(url, function(err, data){
            if(err){
                console.log(err);
                return;
            }
        });
        window.location.href = "code.html";
    });
});

//匹配URL里的值
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//Ajax请求
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
            callback(error);
        },
        dataType: "json"
    });
}