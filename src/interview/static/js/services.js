var host = "http://huodong.naildaka.com/svc";
//var host = "http://192.168.1.111:5010/svc";

//获取点赞情况
function getLikeCount(t, callback){
	var url = host + "/interview/getLikeCount?t=" + t;
	getRequest(url, callback);
}

//点赞
function postLike(t, callback){
	var url = host + "/interview/postlike";
	postRequest(url, {t: t}, callback);
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

//封装get请求
function getRequest(url,callback){
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
			console.log(error);
		},
		dataType: "json"
	});
}



















