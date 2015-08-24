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
});