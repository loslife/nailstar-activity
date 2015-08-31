Zepto(function($){
    $('body').on('touch', function(ev){
        ev.preventDefault();
    });

    var result = [0, 0, 0, 0, 2, 2];
    var swich = 0;
    var sub = 0;
    var testNow = $('.testNow');
    var option = $('.option');

    var commentHtml = {
        commentVue:'',
        commentView:{
            items:[
                {
                    commentTitle:"1.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
                {
                    commentTitle:"2.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
                {
                    commentTitle:"3.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
                {
                    commentTitle:"4.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
                {
                    commentTitle:"5.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
                {
                    commentTitle:"6.适合此款美甲的场所:",
                    optionA:"婚礼",
                    optionB:"闺蜜趴",
                    optionC:"烛光晚餐"
                },
            ],
            page:-2,
            slideDown:false,
            collected:'-1',
            hide_small:false,
            hide:true,
            show_big:true,
            show:false,
        },
    }

    //声明组件
    function creatComponent(){
        Vue.component('comment-template',{
            template:'#comment-template',
            methods:{
                test:function() {
                    commentHtml.commentVue.$data.view.page = -1;
                    $('.origin-div').show(1500);
                },
                choose:function(type){
                    switch(type){
                        case 0:
                            commentHtml.commentVue.$data.view.collected = 0;
                            break;
                        case 1:
                            commentHtml.commentVue.$data.view.collected = 1;
                            break;
                        case 2:
                            commentHtml.commentVue.$data.view.collected = 2;
                            break;
                    };
                    $('.origin-div').children().eq(commentHtml.commentVue.$data.view.page+2).addClass('origin-light').siblings().removeClass('origin-light');
                    commentHtml.commentVue.$data.view.page++;
                },
            }
        })
    }
    creatComponent();
    //绑定模型
    function creatVue(){
        commentHtml.commentVue = new Vue({
            el:'#commentHtml',
            data:{
                view:commentHtml.commentView
            },
        })
    }
    creatVue();
    console.log(commentHtml.commentVue);
    var boxs = $('.comment .item');
    //分享时显示的遮罩层
    var share = $('#share');
    var transparency = $('#transparency');
    share.click(function(){
        transparency.show();
    })

    transparency.click(function(){
        transparency.hide();
    })

    //微信分享
    wx.ready(function(){
        //配置好友分享
        wx.onMenuShareAppMessage({
            title:'我居然是骨灰级美甲咖,超过全国90%美甲师,不服来测!', // 分享标题
            desc: '你也来,找出最合适的一款美甲吧!', // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: 'http://pic.yilos.com/f8d1a51faa6bcdbe182a42826a3dc608', // 分享图标
            success: function () {
                transparency.hide();
            },
            cancel: function () {
                transparency.hide();
            }
        });
        //配置朋友圈分享
        wx.onMenuShareTimeline({
            title:'我居然是骨灰级美甲咖,超过全国90%美甲师,不服来测!',
            link: shareUrl,
            imgUrl: 'http://pic.yilos.com/f8d1a51faa6bcdbe182a42826a3dc608',
            success: function () {
                transparency.hide();
            },
            cancel: function () {
                transparency.hide();
            }
        });
    });

    initWx();

})

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