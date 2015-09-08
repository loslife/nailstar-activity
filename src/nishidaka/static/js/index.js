Zepto(function($){

    function count (useragent) {
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            var useragent = 1;
            var url = 'http://huodong.naildaka.com/svc/7xi/count?useragent=1';
        }else{
            var useragent = 2;
            var url = 'http://huodong.naildaka.com/svc/7xi/count?useragent=2';
        }
        postRequest(url,useragent,function (error,data) {
            if (data.code !=0) {
                callback(null,data);
                return;
            }
            callback(null,data);
        })
    }
    count();
    //封装post请求
    function postRequest (url ,data,callback) {
        $.ajax({
            type: 'GET',
            url: url,
            data: data[0],
            beforeSend: function(request) {
                request.setRequestHeader("xhr", "true");
            },
            success:function(data){
                callback(null,data);
            },
            error: function(error){
                console.log(error);
            },
            dataType:"json"
        });
    }

    $('body').on('touch', function(ev){
        ev.preventDefault();
    });

    var result = [0, 0, 0, 0, 2, 2];
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

        //统计每道题选择之后的分数
        var num;
        if(itemIndex == 1){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[0]){
                sub += 10;
            }else{
                sub += num;
            }
        }

        if(itemIndex == 2){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[1]){
                sub += 10;
            }else{
                sub += num;
            }
        }

        if(itemIndex == 3){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[2]){
                sub += 10;
            }else{
                sub += num;
            }
        }

        if(itemIndex == 4){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[3]){
                sub += 10;
            }else{
                sub += num;
            }
        }

        if(itemIndex == 5){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[4]){
                sub += 10;
            }else{
                sub += num;
            }
        }

        if(itemIndex == 6){
            num = parseInt(10*Math.random());
            if($(this).attr('val')== result[5]){
                sub += 10;
            }else{
                sub += num;
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
        var percent = $('.top-percent');
        mark.text(sub+40);

        //显示超过人数的百分比
        if(mark.text()==100){
            percent.text(99);
        }else if(mark.text()>=90){
            num = parseInt(10*Math.random());
            percent.text(90+num);
        }else if(mark.text()>=80){
            num = parseInt(10*Math.random());
            percent.text(80+num);
        }else if(mark.text()>=70){
            num = parseInt(10*Math.random());
            percent.text(70+num);
        }else if(mark.text()>=60){
            num = parseInt(10*Math.random());
            percent.text(60+num);
        }else if(mark.text()>=50){
            num = parseInt(10*Math.random());
            percent.text(50+num);
        }else if(mark.text()>=40){
            num = parseInt(10*Math.random());
            percent.text(40+num);
        }

        score = percent.text();
        //配置好友分享
        share(score);
    });

    //分享时显示的遮罩层
    var share = $('#share');
    var transparency = $('#transparency');
    share.click(function(){
        transparency.show();
    });

    transparency.click(function(){
        transparency.hide();
    });

    initWx();
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
                ],
            });
            //微信分享
           wx.ready(share(score));
        },
        error: function(err){
            console.log(err);
        },
        dataType:"json"
    });
}

function share(score){
    wx.onMenuShareAppMessage({
        title: '我居然是骨灰级美甲咖,超过全国' + score + '%美甲师,不服来测!', // 分享标题
        desc: '你也来,找出最合适的一款美甲吧!', // 分享描述
        link: 'http://huodong.naildaka.com/nishidaka/index.html', // 分享链接
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
        title: '我居然是骨灰级美甲咖,超过全国' + score + '%美甲师,不服来测!',
        link: 'http://huodong.naildaka.com/nishidaka/index.html',
        imgUrl: 'http://pic.yilos.com/f8d1a51faa6bcdbe182a42826a3dc608',
        success: function () {
            transparency.hide();
        },
        cancel: function () {
            transparency.hide();
        }
    });
}