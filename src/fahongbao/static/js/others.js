Zepto(function($){

    //设置用户信息
    var open_id = getQueryString("openId");

    //获取用户名称和头像
    var urlUser = "http://wx.naildaka.com/hongbao/getInfo/" + open_id;
    getRequest(urlUser,function(err,data){
        if(err){
            console.log(err);
            return;
        }
        if(data && data.nickname){
            $("#nickname").text(data.nickname);
        }
        if(data && data.headImg){
            $("#headImg").attr('src',data.headImg);
        }
    });

    $("#want").click
    //获取红包金额
    var url = "http://wx.naildaka.com/hongbao/getMoney?openId=" + open_id;
    getRequest(url, function(err, data){
        if(err){
            console.log(err);
            return;
        }
        if(data && data.money){
            var money = data.money / 100;
            $("#money").text(money);
            if(money){
                $('.change-to-receiveMoney').show();
            }else{
                $('.change-to-hasReceived').show();
            }
        }
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