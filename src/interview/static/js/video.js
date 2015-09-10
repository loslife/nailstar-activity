Zepto(function($){
    var teachers = [
        {
            name: '胡波',
            img: './images/t00.png',
            title: ['2010台湾美甲封面大赛  一等奖', '芷妍美甲高级培训讲师', '2013年美甲大赛评委'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '董亚坡',
            img: './images/t01.png',
            title: ['2011年获得法式水晶甲（国际组）  亚军', '获得第5届国际美甲艺术邀请赛  优秀奖', '第七届国际美甲邀请赛  季军'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '王红',
            img: './images/t02.png',
            title: ['EZFLOW高级讲师', '2013年美甲大赛评委', '芷妍美甲高级培训师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '郭东',
            img: './images/t03.png',
            title: ['日本PARA培训技术证书', '韩国INS KOREA指定中国区域', '美甲培训师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '胡小',
            img: './images/t04.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '杨帆',
            img: './images/t05.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '李智',
            img: './images/t06.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '薛兴亚',
            img: './images/t07.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '汤志平',
            img: './images/t08.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '肖莎',
            img: './images/t09.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        },
        {
            name: '媛媛',
            img: './images/t10.png',
            title: ['芷妍美甲技术学院高级培训技师', '韩国INS KOREA中国区域', '指定美甲培训技师'],
            video: 'http://v.yilos.com/72cab374f17d65717a2fc0e8119acb39.mp4'
        }
    ];

    var t = getQueryString('t');
    if(!t){
        return console.log("缺失参数t");
    }
    var teacher = teachers[t];
    var flag = false;

    //设置点赞图标
    var local = window.localStorage.getItem("like_" + t);
    if(local){
        $("#likeFlag").attr("src", "./images/like.png");
        flag = true;
    }
    //设置点赞数量
    getLikeCount(t, function(err, data){
        if(err){
            return console.log(err);
        }
        if(data && data.code !== 0){
            return;
        }
        var count = data.result.count;
        $("#count").text(count);
    });
    //设置老师头像
    $('header').css('background-image', "url('" + teacher.img + "')");
    //设置老师姓名
    $(".name > span").text(teacher.name);
    //设置老师信息
    $(".title > p").each(function(index, item){
        $(item).text(teacher.title[index]);
    });
    //设置信息样式
    if(t % 2 === 0){
        $(".desc").addClass("desc-right");
        $(".like").addClass("like-right");
        $(".like").addClass("bp-e");
    }else{
        $(".desc").addClass("desc-left");
        $(".like").addClass("like-left");
        $(".like").addClass("bp-s");
    }
    //设置视频信息
    $("section video").attr("src", teacher.video);
    //初始化微信
    initWx();
    //统计接口
    count();
    //点赞按钮
    $(".like-btn").click(function(){
        if(flag){
            return;
        }
        postLike(t, function(err, data){
            if(err){
                return console.log(err);
            }
        });
        //本地处理
        window.localStorage.setItem("like_" + t, 1);
        $("#likeFlag").attr("src", "./images/like.png");
        var count = $("#count").text();
        if(!count){
            return;
        }
        count = parseInt(count);
        $("#count").text(++count);
        flag = true;
    });
    //欣赏他的作品
    $("#more").click(function(){
        window.location.href = "http://s.naildaka.com/site/more.html?type=teacher&name=" + teacher.name;
    });
    //看其他大咖
    $("#index").click(function(){
        window.location.href = "./index2.html";
    });
    //分享按钮
    $(".share").click(function(){
        $(".maskShare").show();
    });
    //分享蒙层
    $(".maskShare").click(function(){
        $(this).hide();
    });

    //处理微信接口
    function initWx() {
        var app_id = "wxa84c9db4a6fcc7d8";
        var nowUrl = window.location.href;
        var signUrl = "http://huodong.naildaka.com/wx/getSignature";
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
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                    ]
                });
                wx.ready(function(){
                    // 创建分享
                    wx.onMenuShareTimeline({
                        title: "幕后的美甲大咖们，你都认识吗？",
                        link: "http://huodong.naildaka.com/interview/index2.html",
                        imgUrl: "http://huodong.naildaka.com/interview/images/share.jpg",
                        success: function () {
                            $(".maskShare").hide();
                        },
                        cancel: function () {
                            $(".maskShare").hide();
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: "幕后的美甲大咖们，你都认识吗？",
                        desc: "我的经历也许是很多人的经历！",
                        link: "http://huodong.naildaka.com/interview/index2.html",
                        imgUrl: "http://huodong.naildaka.com/interview/images/share.jpg",
                        success: function () {
                            $(".maskShare").hide();
                        },
                        cancel: function () {
                            $(".maskShare").hide();
                        }
                    });
                });
            },
            error: function(err){
                console.log(err);
            },
            dataType:"json"
        });
    }

    function count(){
        var ua = window.navigator.userAgent.toLowerCase();
        var useragent;
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            useragent = 1;
        }else{
            useragent = 2;
        }
        postCount({useragent: useragent,t: t}, function (error,data) {
            if (err) {
                console.log(error);
                return;
            }
        });
    }
});

//获取url的query
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

