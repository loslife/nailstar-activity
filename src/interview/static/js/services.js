//var host = "http://api2.naildaka.com/vapi";
var host = "http://192.168.1.110:5013/vapi2";

//封装post请求
function postRequest(url ,data,callback){
	$.ajax({
		type: 'POST',
		url: url,
		data: data[0],
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



















