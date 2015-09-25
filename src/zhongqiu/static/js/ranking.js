jQuery(function($){

	// 服务接口
	var host = 'http://huodong.naildaka.com/svc/zhongqiu/';

	var time = Date.parse("Oct 4, 2015");

	setInterval(function () {
		var now = new Date().getTime();
		var lastTime = new Date(time - now).lastTime();
		$("#h").text(lastTime);
	},1000);

	var rankData = {

		view: {
			loadpage: true,		//页面载入动画
			sharetips: false,	//分享提示
			tab: true,			//true人气榜，false为梦想榜
			page: 1,
			scroll: true
		},
		union_id: ''
	};

	rankData.union_id = getQueryString('union_id');

	// tab页切换
	$('.tab-left').click(function() {

		if(rankData.view.tab){
			return;
		}

		rankData.view.tab = true;
		$('.tab-left img').attr('src', './images/rank-left-btn1.png');
		$('.tab-right img').attr('src', './images/rank-right-btn2.png');
		$('.renqi').show();
		$('.mx').hide();
		$('html,body').scrollTop(0);
	});

	$('.tab-right').click(function() {

		if(!rankData.view.tab){
			return;
		}

		rankData.view.tab = false;
		$('.tab-left img').attr('src', './images/rank-left-btn2.png');
		$('.tab-right img').attr('src', './images/rank-right-btn1.png');
		$('.renqi').hide();
		$('.mx').show();
		$('html,body').scrollTop(0);
		$('#waterfall li').wookmark({
			autoResize: true, // 当浏览器大小改变时是否自动调整
			container: $('#mxlist'),
			offset: 6
		});
	});

	// 分享提示
	$('.share').click(function() {
		$('.maskShare').show();
	});
	
	// 取消提示
	$('.maskShare').click(function() {
		$('.maskShare').hide();
	});

	// 获取个人信息
	function getuserinfor(union_id) {

		getRequest(host + 'info/' + union_id, function(error,data) {

            if(data.code != 0){
                console.log('err');
				return;
            }

			$('.me-left img').attr('src', data.result.url);//设置上传图片
			$('.userimg img').attr('src', data.result.avatar);//设置头像
			$('.username').text(data.result.nickname);//设置用户昵称
			$('#num').text(data.result.vote);//设置的票数
			$('#ranknum').text(data.result.ranking);//设置用户排名
			getthing (data.result.ranking);//设置是否显示奖品
        });
	}

	getuserinfor(rankData.union_id);

	// 获取列表
	function getlist(page) {

		getRequest(host + 'infos/?page=' + page, function(error,data) {

            if(data.code != 0){
                console.log('err');
				return;
            }

			if(page == 1){
				creatranklist (data.result.datas);
				creatmxlist (data.result.datas);
				setTimeout(function (argument) {
					$('.loadercontent').hide();
				},500);
			}else{
				creatmxlist (data.result.datas);
			}

			if(data.result.datas.length == 0){
				rankData.view.scroll = false;
			}
			rankData.view.page ++;
        });
	}
	getlist (rankData.view.page);

	//显示可获的奖品
	function getthing (ranking) {

		if(ranking == 1){
			$('.awardthings img').attr('src', './images/ranking-1.png');
		}else if(ranking > 1 && ranking < 4){
			$('.awardthings img').attr('src', './images/ranking-2.png');
		}else if(ranking > 3 && ranking < 16){
			$('.awardthings img').attr('src', './images/ranking-4.png');
		}else{
			$('.awardthings img').hide();
		}
	}

	//生成排行榜
	function creatranklist (datas) {

		var things = {
			a:'./images/ranking-1.png',
			b:'./images/ranking-2.png',
			c:'./images/ranking-3.png'
		};

		var classname = {
			a:'color1',
			b:'color2'
		};

		var s;

		for (var i = 0; i < datas.length; i++) {
			var rank = i+1;
			if(i == 0){
				s = things.a;
				console.log(s);
			}else if(i>0&&i<3){
				s = things.b;
				console.log(s);
			}else if(i>2&&i<15){
				s = things.c;
				console.log(s);
			}

			var classa;

			if(i%2 == 0){
				classa = classname.a;
			}else{
				classa = classname.b;
			}

			var html = '<li class="'+classa+' item db ba-c bo-h">'+
							'<div class="ranknumber">'+rank+'</div>'+
							'<div class="rankimg"><img src="'+datas[i].avatar+'" alt=""></div>'+
							'<div class="rankname">'+datas[i].nickname+'</div>'+
							'<div class="ranktxt">当前票数</div>'+
							'<div class="rankpiao">'+datas[i].vote+'</div>'+
							'<div class="rankaward"><img src="'+s+'" alt=""></div>'+
						'</li>';
			$('.ranklist').append(html);
		}
	}

	//生成更多
	function creatmxlist (datas) {
		for (var i = 0; i < datas.length; i++) {
			console.log('2'+datas[i]);
			var html = '<li>'+
							'<div class="top">'+
								'<img src="'+datas[i].url+'" alt="">'+
							'</div>'+
							'<div class="bottom db bo-h ba-c">'+
								'<div class="mx-userimg"><img src="'+datas[i].avatar+'" alt=""></div>'+
								'<div class="mx-name">'+datas[i].nickname+'</div>'+
								'<div>票数</div>'+
								'<div class="mx-number">'+datas[i].vote+'</div>'+
							'</div>'+	
						'</li>';
			$('#mxlist').append(html);
		};
	}

	//封装get请求
	function getRequest (url,callback) {
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
						callback(true);
			},
			dataType: "json"
		});
	}

	//处理微信接口
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		initWx();
	}
	function initWx () {
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
                        'chooseImage',
			            'previewImage',
			            'uploadImage',
			            'downloadImage',
			            'getNetworkType'
                    ]
                });
                wx.ready(function() {
                	// 创建分享
                    var friendData = {
                        "imgUrl": "http://huodong.naildaka.com/zhongqiu/images/share.jpg",
                        "link": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +"redirect_uri=http%3a%2f%2fhuodong.naildaka.com%2fsvc%2fzhongqiu%2froute%2f" + rankData.union_id+ "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
                        "desc": "我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！",
                        "title": "你负责貌美如花，大咖负责把iPhone6s送进家！",
                        "appId": app_id
                    };
                    var timelineData = {
                        "imgUrl": "http://huodong.naildaka.com/zhongqiu/images/share.jpg",
                         "link": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb931d3d24994df52&" +"redirect_uri=http%3a%2f%2fhuodong.naildaka.com%2fsvc%2fzhongqiu%2froute%2f" + rankData.union_id+ "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
                        "desc": "我离玫瑰金只有一步之差，你还在等啥？ 晒自拍，多重豪礼等你拿！",
                        "title": "你负责貌美如花，大咖负责把iPhone6s送进家！",
                        "appId": app_id
                    };
                    wx.onMenuShareTimeline({
                        title: timelineData.desc,
                        link: timelineData.link,
                        imgUrl: timelineData.imgUrl,
                        success: function (res) {
                        	getRequest('http://huodong.naildaka.com/svc/stat/share?activity=zhongqiu',function (error,data) {
                        		if(data.code != 0){
                        			console.log('err');
                        		}else{
                        			console.log('ok');
                        		}
                        	})
                        },
                        cancel: function () {
                        	
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: friendData.title,
                        desc: friendData.desc,
                        link: friendData.link,
                        imgUrl: friendData.imgUrl,
                        type: '',
                        dataUrl: '',
                        success: function () {
                        	getRequest('http://huodong.naildaka.com/svc/stat/share?activity=zhongqiu',function (error,data) {
                        		if(data.code != 0){
                        			console.log('err');
                        		}else{
                        			console.log('ok');
                        		}
                        	})
                        },
                        cancel: function () {
                        	
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

	//处理字符串
	function getQueryString(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}

	//滚动加载
	//滚动触发事件
    window.onscroll = function () {
    	if(rankData.view.scroll){
    		var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
			if(closeToBottom){
				getlist (rankData.view.page);
			}
    	}else{
    		console.log("不能滚动");
    	}
	}
});
Date.prototype.lastTime = function(){
    var time = this.getTime();
    var hours = Math.floor(time / (1000 * 60 * 60));
    var minutes = Math.floor(time / (1000 * 60) - (60 * hours));
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    var seconds = Math.floor(time / 1000 - (60 * minutes) - (60 * 60 * hours));
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    return hours + " : " + minutes + " : " + seconds;
};