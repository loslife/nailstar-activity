Zepto(function($){

    imagesLoaded('.item',function(){
        $('.loadercontent').hide();
    });

    (function count() {

        var useragent = 2;

        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            useragent = 1;
        }else{
            useragent = 2;
        }

        var url = 'http://huodong.naildaka.com/svc/stat/count?activity=nishidaka&useragent=' + useragent;

        $.ajax({
            type: 'GET',
            url: url
        });

    })();

    $('body').on('touchstart', function(ev){
        ev.preventDefault();
    });

    var result = [1, 0, 2, 1, 0, 2];
    var boxs = $('.comment .item');
    var swich = 0;
    var sub = 0;
    var testNow = $('.testNow');
    var option = $('.option');
    var score = 0;

    testNow.on('tap',function(){
        $('.index').addClass('hide_small');
        $(boxs[1]).addClass('show');
        $('.origin_div').show(1500);
        $('.comment-div-first').addClass('slideDown');
    });

    option.on('tap',function(){
        $(this).addClass('collected');
        var val = $(this).attr("val");
        var itemIndex = $(this).parent('div').parent().parent().attr('index');
        var percent = $('.top-percent');


        //统计每道题选择之后的分数
        var num;
        if(itemIndex == 1){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[0]){
                sub += 15;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        if(itemIndex == 2){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[1]){
                sub += 15;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        if(itemIndex == 3){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[2]){
                sub += 20;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        if(itemIndex == 4){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[3]){
                sub += 15;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        if(itemIndex == 5){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[4]){
                sub += 15;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        if(itemIndex == 6){
            num = parseInt(15*Math.random());
            if($(this).attr('val')== result[5]){
                sub += 20;
                score += 1;
            }else{
                sub += num;
                score += 0;
            }
        }

        //点亮指示灯
        $('.origin_div').children().eq(itemIndex).addClass('origin_light').siblings().removeClass('origin_light');

        //跳转到下一页
        if (swich<8) {
            $(boxs[swich+1]).addClass('hide_small');
            $(boxs[swich+2]).addClass('show');
            $('.comment-div').eq(itemIndex).addClass('slideDown');
            swich++;
            if(swich==6 ){
                $('.origin_div').hide();
            }
        }

        //显示统计的分数
        var mark = $('.top-mark');

        if(score === 0){
            mark.text(0);
        }else{
            mark.text(sub);
        }

        //显示答对的个数
        var str;
        if(score === 6){
            $('.top-count').text('哇晒！美甲大咖原来是你!');
            str = "全对!我是美甲大咖,不服来战!";
        }else{
            percent.text(score);
            str = "我认出了" + score + "个,不服来战。";
        }

        //配置好友分享
        shareWX(str)();
    });

    //分享时显示的遮罩层
    var share = $('#share');
    var again = $('#again');
    var transparency = $('#transparency');
    share.tap(function(){
        transparency.show();
    });
    again.tap(function(){
        window.location.href = "./index.html";
    });

    transparency.tap(function(){
        transparency.hide();
    });

    initWx();

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
                //微信分享
                var str = "'我认出了0个,不服来战。'";
                wx.ready(shareWX(str));
            },
            error: function(err){
                console.log(err);
            },
            dataType:"json"
        });
    }

    function shareWX(str){
        return function(){
            wx.onMenuShareAppMessage({
                title: '最新的美甲产品和款式,你认识吗?', // 分享标题
                desc: str, // 分享描述
                link: 'http://huodong.naildaka.com/nishidaka/index.html', // 分享链接
                imgUrl: 'http://huodong.naildaka.com/nishidaka/images/index/share_icon.png', // 分享图标
                success: function () {
                    transparency.hide();
                },
                cancel: function () {
                    transparency.hide();
                }
            });
            //配置朋友圈分享
            wx.onMenuShareTimeline({
                title: '最新的美甲产品和款式,你认识吗?' + str,
                link: 'http://huodong.naildaka.com/nishidaka/index.html',
                imgUrl: 'http://huodong.naildaka.com/nishidaka/images/index/share_icon.png',
                success: function () {
                    transparency.hide();
                },
                cancel: function () {
                    transparency.hide();
                }
            });
        };
    }
});

