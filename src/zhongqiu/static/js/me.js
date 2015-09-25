$(function(){

    var union_id = getQueryString("union_id");
    $(".loadercontent").hide();
    initCropprt()
    initWx();

    $("#upload").on("click", function(){
        if(!union_id){
            return alert("缺失union_id");
        }
        $("#uploadFile").click();
    });

    $("#uploadFile").on("change", function(e){
        $(".loadercontent").show();
        var target = e.dataTransfer || e.target,
            file = target && target.files && target.files[0],
            options = {
                canvas: true
            };

        if (!file) {
            return;
        }

        // Use the "JavaScript Load Image" functionality to parse the file data
        loadImage.parseMetaData(file, function(data) {

            // Get the correct orientation setting from the EXIF Data
            if (data.exif) {
                options.orientation = data.exif.get('Orientation');
            }

            // Load the image from disk and inject it into the DOM with the correct orientation
            loadImage(
                file,
                function(canvas) {
                    var imgDataURL = canvas.toDataURL();
                    var $image = $(".img-container > img");
                    $image.attr('src', imgDataURL);

                    $image.cropper('replace', imgDataURL);
                    $(".loadercontent").hide();
                    $("#preview-wrapper").show();
                },
                options
            );
        });
    });

    $("#shareBtn").on('click', function(){
        $(".transparency").show();
    });

    function initCropprt(){
        var $image = $(".img-container > img");
        var options = {
            aspectRatio: 1 / 1,
            autoCropArea: 1.0,
            crop: function (e) {
            },
            built: function () {
            }
        };
        $image.cropper(options);

        $("#img-btn-cancel").click(function () {
            $("#preview-wrapper").hide();
        });

        $("#upload-image").click(function () {
            $(".loadercontent").show();
            var data = $image.cropper('getCroppedCanvas').toDataURL();
            uploadImage({image: data}, function (err, data) {
                $("#preview-wrapper").hide();
                if (err || !data || data.code != 0) {
                    return alert("上传失败，请重试");
                }
                var picUrl = data.result.picUrl;
                addRecord({picurl: picUrl,unionid: union_id}, function(err, data){
                    if(err || data.code != 0){
                        return alert("上传失败，请重试");
                    }
                    $(".loadercontent").hide();
                    showShare(picUrl);
                });
            });
        });
    }

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

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
                wx.ready(function(){
                    var desc = "你负责貌美如花，大咖负责把iPhone6s送进家！";
                    var title = "我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！";
                    var shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +
                        "redirect_uri=http%3a%2f%2fhuodong.naildaka.com%2fsvc%2fzhongqiu%2froute%2f" + union_id
                        + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                    var transparency = $(".transparency");
                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: shareUrl,
                        imgUrl: 'http://huodong.naildaka.com/zhongqiu/images/share.jpg', // 分享图标
                        success: function () {
                            transparency.hide();
                        },
                        cancel: function () {
                            transparency.hide();
                        }
                    });
                    //配置朋友圈分享
                    wx.onMenuShareTimeline({
                        title: title,
                        link: shareUrl,
                        imgUrl: 'http://huodong.naildaka.com/nishidaka/zhongqiu/images/share.jpg',
                        success: function () {
                            transparency.hide();
                        },
                        cancel: function () {
                            transparency.hide();
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

    function showShare(picUrl){
        $("#share.main-img").attr("src", picUrl);
        $("#share").show();
        var desc = "你负责貌美如花，大咖负责把iPhone6s送进家！";
        var title = "我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！";
        var shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +
            "redirect_uri=http%3a%2f%2fhuodong.naildaka.com%2fsvc%2fzhongqiu%2froute%2f" + union_id
            + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        var transparency = $(".transparency");
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareUrl,
            imgUrl: 'http://huodong.naildaka.com/zhongqiu/images/share.jpg', // 分享图标
            success: function () {
                transparency.hide();
            },
            cancel: function () {
                transparency.hide();
            }
        });
        //配置朋友圈分享
        wx.onMenuShareTimeline({
            title: title,
            link: shareUrl,
            imgUrl: 'http://huodong.naildaka.com/nishidaka/zhongqiu/images/share.jpg',
            success: function () {
                transparency.hide();
            },
            cancel: function () {
                transparency.hide();
            }
        });
    }
});