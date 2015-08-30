Zepto(function($){
    $('body').on('touch', function(ev){
        ev.preventDefault();
    });

    var commentHtml = {
        commentVue:'',
        commentView:{},
        items:{
            item1:{
                commentTitle:"1.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
            item2:{
                commentTitle:"2.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
            item3:{
                commentTitle:"3.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
            item4:{
                commentTitle:"4.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
            item5:{
                commentTitle:"5.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
            item6:{
                commentTitle:"6.适合此款美甲的场所:",
                optionA:"婚礼",
                optionB:"闺蜜趴",
                optionC:"烛光晚餐"
            },
        }
    }

    //绑定模型
    function creatVue(){
        commentHtml.commentVue = new Vue({
            el:'#comentHtml',
            data:{

            },
            methods:{
                choose:function(){
                    $(this).addClass('collected');
                    var val = $(this).attr("val");
                    var itemIndex = $(this).parent('div').parent().parent().attr('index');

                    //点亮指示灯
                    $('.origin-div').children().eq(itemIndex).addClass('origin-light').siblings().removeClass('origin-light');

                    //跳转到下一页
                    if (swich<8) {
                        $(boxs[swich+1]).addClass('hide_small');
                        $(boxs[swich+2]).removeClass('hide');
                        $(boxs[swich+2]).removeClass('show_big');
                        $(boxs[swich+2]).addClass('show');
                        $('.comment-div').eq(itemIndex).addClass('slideDown');
                        swich++;
                        if(swich==6 ){
                            $('.origin-div').hide();
                        }
                    }

                    //显示统计的分数
                    var mark = $('.top-mark');
                    mark.text(sub+40);
                }
            }
        })
    }

    var result = [0, 0, 0, 0, 2, 2];
    var boxs = $('.comment .item');
    var swich = 0;
    var sub = 0;
    var testNow = $('.testNow');
    var option = $('.option');

    testNow.on('tap',function(){
        $('.index').addClass('hide_small');
        $(boxs[1]).removeClass('hide');
        $(boxs[1]).removeClass('show_big');
        $(boxs[1]).addClass('show');
        $('.origin-div').show(1500);
        $('.comment-div-first').addClass('slideDown')
    })

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