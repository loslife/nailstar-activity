Zepto(function($){
	function ceratStorage () {
		if(!window.localStorage.getItem('modal')){
			$('.modal').show();
			window.localStorage.setItem('modal',true);
		}
	}
	ceratStorage ();
	$('.modal').click(function() {
		$('.modal').hide();
	});

	function getLikedNum () {
		 getRequest('http://huodong.naildaka.com/svc/interview/getAllLikeCount', function(error,data) {
			if (data.code !==0) {
				callback(null,data);
				return;
			}
			console.log(data.result);
			var boxs = $('.likedNum');
			$.each(data.result.counts, function(i) {
				$('#t'+data.result.counts[i].t).text(data.result.counts[i].count);	
			});
		});
	}
	getLikedNum ();
	function count () {
		var ua = window.navigator.userAgent.toLowerCase();
		var useragent;
		var url = 'http://huodong.naildaka.com/svc/interview/count';
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			useragent = 1;
		}else{
			useragent = 2;
		}
		postRequest(url, {useragent: useragent}, function (error,data) {
			if (err) {
				console.log(error);
				return;
			}
		});
	}
	count();
	//封装get请求
	function getRequest(url,callback) {
		$.ajax({
			type: 'GET',
			url: url,
			beforeSend: function(request) {
	                    
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