Zepto(function($){
    $('body').on('touchmove', function(ev){
        ev.preventDefault();
    });

    initWx();

    var shareUrl = "http://huodong.naildaka.com/zhongqiu/introduce.html";

    wx.ready(function () {
        //配置好友分享
        wx.onMenuShareAppMessage({
            title: '你负责貌美如花，大咖负责把iPhone6s送进家！', // 分享标题
            desc: '我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！', // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: 'http://huodong.naildaka.com/zhongqiu/images/share.jpg', // 分享图标
            success: function () {
                getRequest('http://huodong.naildaka.com/svc/stat/share?activity=zhongqiu', function (error, date) {
                    if (data.code != 0) {
                        console.log('err');
                    } else {
                        console.log('ok');
                    }
                })
            },
            cancel: function () {
            }
        });
        //配置朋友圈分享
        wx.onMenuShareTimeline({
            title: '我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！',
            link: shareUrl,
            imgUrl: 'http://huodong.naildaka.com/zhongqiu/images/share.jpg',
            success: function () {
                getRequest('http://huodong.naildaka.com/svc/stat/share?activity=zhongqiu', function (error, date) {
                    if (data.code != 0) {
                        console.log('err');
                    } else {
                        console.log('ok');
                    }
                })
            },
            cancel: function () {
            }
        });
    });
});

//处理微信接口
function initWx() {
    var app_id = "wxa84c9db4a6fcc7d8";
    var nowUrl = window.location.href;
    var signUrl = "http://huodong.naildaka.com/wx/getSignature";// only one 'Access-Control-Allow-Origin' is allowed
    $.ajax({
        type: 'POST',
        url: signUrl,
        data: {
            url: nowUrl,
            appId: app_id
        },
        beforeSend: function (request) {
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
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
        error: function (err) {
            console.log(err);
        },
        dataType: "json"
    });
}