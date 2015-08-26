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
			if (data.code !=0) {
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
	function count (useragent) {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			var useragent = 1;
			var url = 'http://huodong.naildaka.com/svc/interview/count?useragent=1';
		}else{
			var useragent = 2;
			var url = 'http://huodong.naildaka.com/svc/interview/count?useragent=2';
		}
		getRequest(url,useragent,function (error,data) {
			if (data.code !=0) {
				callback(null,data);
				return;
			}
			callback(null,data);
		})
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