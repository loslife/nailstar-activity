$(function () {

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

    $("#uploadImg").on("change", function (e) {
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

                    $image.attr('src', imgDataURL);
                    //$("#preview-wrapper").show();
                    //var options = {
                    //    aspectRatio: 1 / 1,
                    //    autoCropArea: 1.0,
                    //    crop: function (e) {
                    //    },
                    //    built: function () {
                    //    }
                    //};

                    // Initiate cropper once the orientation-adjusted image is in the DOM
                    //$image.cropper(options);

                    $image.cropper('replace', imgDataURL);
                    $("#preview-wrapper").show();
                },
                options
            );
        });
    });


    $("#img-btn-cancel").click(function () {
        $("#preview-wrapper").hide();
    });

    $("#upload-image").click(function () {
        var data = $image.cropper('getCroppedCanvas').toDataURL();
        uploadImage({image: data}, function (err, data) {
            $("#preview-wrapper").hide();
            if (err || !data || data.code != 0) {
                return alert("上传失败，请重试");
            }
            //console.log(data.result.picUrl);
            $("#temp").text(data.result.picUrl);
        });
    });

    initWx();

    function previewInImage(file) {
        //通过file.size可以取得图片大小
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            $image.cropper('replace', this.result);
            $("#preview-wrapper").show();
        };
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
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                });
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: "",
                        link: "",
                        imgUrl: "",
                        success: function (res) {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: "",
                        desc: "",
                        link: "",
                        imgUrl: "",
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                });
            },
            error: function (err) {
                console.log(err);
            },
            dataType: "json"
        });
    }
});

var host = "http://192.168.1.115:5013/vapi2";

function uploadImage(data, callback){
    var url = host + "/nailstar/uploadImageWeixin";
    postRequest(url, data, callback);
}

//封装post请求
function postRequest(url ,data,callback){
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
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
        dataType:"json"
    });
}