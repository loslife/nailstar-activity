Zepto(function($){

    //设置用户信息
    var open_id = getQueryString("open_id");
    var nickname = getQueryString("nickname");
    $("#nickname").text(nickname);
    var headImg = getQueryString("headImg");
    $("#headImg").attr("src", headImg);
    var oBtn = $("#share");
    var transparency = $('#transparency');

    //获取红包金额
    var url = "http://wx.naildaka.com/hongbao/getMoney?openId=" + open_id;
    getRequest(url, function(err, data){
        if(err){
            console.log(err);
            return;
        }
        if(data && data.money){
            var money = data.money;
            $("#money").text(money);
            if(money){
                $('.change-to-receiveMoney').show();
            }else{
                $('.change-to-hasReceived').show();
            }
            return;
        }
    });

    oBtn.click(function(){
        transparency.show();
    });

    transparency.click(function(){
        transparency.hide();
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