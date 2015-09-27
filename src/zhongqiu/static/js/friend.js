Zepto(function ($) {

    var union_id = getQueryString("union_id");
    var can_vote = getQueryString("can_vote");
    var my_union_id = getQueryString("my_union_id");

    getInfo(union_id, function(err, data){
        if(err || !data || !data.result){
            return console.log(err);
        }
        $('.main-vote-number').text(data.result.vote);
        $('.main-img').attr('src',data.result.url);
    });

    if (can_vote === 1 || can_vote === "1") {

        var $vote = $('#vote');

        $vote.removeClass("has-voted").addClass("vote");
        $vote.text("投一票");

        $vote.on('click', function () {

            $vote.removeClass("vote").addClass("has-voted");
            $vote.text("已投票");
            $vote.unbind('click');

            var postData = {
                friend_union_id: union_id,
                my_union_id: my_union_id,
                source: 0
            };

            postVote(postData, function(err, data){

                if(data.code != 0){
                    return;
                }

                var vote = parseInt($('.main-vote-number').text());
                $('.main-vote-number').text(vote + 1);
            });
        })
    }

    var shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +
        "redirect_uri=http%3a%2f%2fhuodongcdn.naildaka.com%2fsvc%2fzhongqiu%2froute%2f" + union_id
        + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

    $('body').on('touchmove ', function (ev) {
        ev.preventDefault();
    });

    initWx();

    wx.ready(function () {
        //配置好友分享
        wx.onMenuShareAppMessage({
            title: '你负责貌美如花，大咖负责把iPhone6s送进家！', // 分享标题
            desc: '我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！', // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: 'http://s.naildaka.com/zhongqiu/images/share.jpg', // 分享图标
            success: function () {
                postRequest('http://huodongcdn.naildaka.com/svc/stat/share', {activity: "zhongqiu"}, function (error, date) {});
            },
            cancel: function () {
            }
        });
        //配置朋友圈分享
        wx.onMenuShareTimeline({
            title: '我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！',
            link: shareUrl,
            imgUrl: 'http://s.naildaka.com/zhongqiu/images/share.jpg',
            success: function () {
                postRequest('http://huodongcdn.naildaka.com/svc/stat/share', {activity: "zhongqiu"}, function (error, date) {});
            },
            cancel: function () {
            }
        });
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

var port = "http://huodongcdn.naildaka.com/svc/zhongqiu";

//封装getInfo
function getInfo(union_id, callback){
    var url = port + "/info/" + union_id;
    getRequest(url, callback);
}

//封装vote
function postVote(postData, callback){
    var url = port + "/vote";
    postRequest(url, postData, callback);
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

//封装post请求
function postRequest(url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        beforeSend: function (request) {
            request.setRequestHeader("xhr", "true");
        },
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: function (data) {
            callback(null, data);
        },
        error: function (error) {
            console.log(error);
        },
        dataType: "json"
    });
}

//处理微信接口
function initWx() {
    var app_id = "wxa84c9db4a6fcc7d8";
    var nowUrl = window.location.href;
    var signUrl = "http://huodongcdn.naildaka.com/wx/getSignature";// only one 'Access-Control-Allow-Origin' is allowed
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