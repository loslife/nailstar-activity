Zepto(function($){

    //设置用户信息
    var open_id = getQueryString("openId");
    var shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +
        "redirect_uri=http%3a%2f%2fhuodong.naildaka.com%2fhongbao%2froute%2f" + open_id
        + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

    //获取红包金额
    var url = "http://huodong.naildaka.com/hongbao/getMoney?openId=" + open_id;
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

    //获取用户名称和头像
    var urlUser = "http://huodong.naildata.com/hongbao/getInfo/" + open_id;
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
        wx.ready(function(){
            //配置好友分享
            wx.onMenuShareAppMessage({
                title: data.nickname + '发给你一个红包', // 分享标题
                desc: '赶快点击领取吧,100%现金', // 分享描述
                link: shareUrl, // 分享链接
                imgUrl: '../images/logo.png', // 分享图标
                success: function () {
                    transparency.hide();
                },
                cancel: function () {
                    transparency.hide();
                }
            });
            //配置朋友圈分享
            wx.onMenuShareTimeline({
                title: data.nickname + '正在发现金红包,快来领取吧!',
                link: shareUrl,
                imgUrl: '../images/logo.png',
                success: function () {
                    transparency.hide();
                },
                cancel: function () {
                    transparency.hide();
                }
            });
        });
    });

    initWx();

    var oBtn = $("#share");
    var transparency = $('#transparency');
    //点击分享时弹出蒙层
    oBtn.click(function(){
        transparency.show();
    });
    //点击页面使蒙层消失
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

//处理微信接口
function initWx() {
    var app_id = "wxa84c9db4a6fcc7d8";
    var nowUrl = window.location.href;
    var signUrl = "http://wx.naildaka.com/wx/getSignature";
    $.ajax({
        type: 'POST',
        url: signUrl,
        data: {
            url: nowUrl,
            appId: app_id
        },
        beforeSend: function(request) {
        },
        xhrFields:{
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
            var signature = data.result.sign;
            wx.config({
                debug: false,
                appId: app_id,
                timestamp: 1421670369,
                nonceStr: 'q2XFkAiqofKmi1Y2',
                signature: signature,
                jsApiList: [
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage"
                ]
            });
        },
        error: function(err){
            console.log(err);
        },
        dataType:"json"
    });
}

