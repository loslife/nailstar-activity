Zepto(function($){

    //设置用户信息
    var unionId = getQueryString("unionId");
    var arrayContent=['领到了,好棒!','又学美甲又领红包','原来是真的','不错不错','美甲内容很好','给赞','支持喜欢','漂亮的美甲',
        '最专业的美甲视频','好赞,发红包咯!','好看','再来红包','美甲内容我很喜欢','心情好','美甲视频赞','亲们快来帮我领红包吧',
        '转发就有红包','漂亮的美甲','我为美甲大咖代言!','为美甲大咖代言','好多美甲视频吖','超多款式', +
        '领到红包了','看美甲视频领红包','转发了'];
    var arrayName = ['138********','159********','心旅途***','美甲控****','久而久******','136********','170********',
        '心`心***','Kis******','sum******','137********','朵儿ゞ*****','Ale****','-Ag***','fro******', '茈女子******',
        '158********','159********','sum***','tro****','say****','Ale****','137********','137********','你给的***'];

    var start = new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0);
    var end = new Date().getTime();

    //获取用户名称和头像
    var urlUser = "http://huodong.naildaka.com/svc/hongbao/getInfo/" + unionId;
    getRequest(urlUser,function(err,data){
        if(err){
            console.log(err);
            return;
        }
        if(data && data.result && data.result.nickname){
            $("#nickname").text(data.result.nickname);
        }
        if(data && data.result && data.result.headImg){
            $("#headImg").attr('src',data.result.headImg);
        }
    });

    $("#want").click(function(){
        //获取红包金额
        var url = "http://huodong.naildaka.com/svc/hongbao/getMoney?unionId=" + unionId + "&type=2";
        getRequest(url, function(err, data){
            if(err){
                console.log(err);
                return;
            }
        });
        window.location.href = "code.html";
    });


    var randomArray = [];
    createRandom(randomArray);

    createImg();
    createName();
    createComment();
    createTime();

    //生成3个随机数
    function createRandom(){
        if(randomArray.length >= 3){
            return;
        }
        var num = parseInt(4 * Math.random());
        if(randomArray.contains(num)){
            createRandom();
            return;
        }
        randomArray.push(num);
        createRandom();
    }

    //25张照片中随机生成3张评论区用户头像
    function createImg(){
        $('#user-face-up').attr('src',"./images/person/" + randomArray[0] + ".jpg");
        $('#user-face-middle').attr('src',"./images/person/" + randomArray[1] + ".jpg");
        $('#user-face-down').attr('src',"./images/person/" + randomArray[2] + ".jpg");
    }

    //从评论数组中随机选取三个评论
    function createComment(){
        $('#user-comment-up').text(arrayContent[randomArray[0]]);
        $('#user-comment-middle').text(arrayContent[randomArray[1]]);
        $('#user-comment-down').text(arrayContent[randomArray[2]]);
    }

    //从名字数组中随机选取三个名字
    function createName(){
        $('#user-name-up').text(arrayName[randomArray[0]]);
        $('#user-name-middle').text(arrayName[randomArray[1]]);
        $('#user-name-down').text(arrayName[randomArray[2]]);
    }

    //生成随机时间
    function createTime(){
        for(var i=0; i<3; i++){
            var time = new Date(parseInt(Math.random() * (end - start) + start));
            var timestr = time.getMonth() + "/" + time.getDate() + " "
                + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            var str = "#user-time-" + i;
            $(str).text(timestr);
        }
    }
});

//匹配URL里的值
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//Ajax请求
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
            callback(error);
        },
        dataType: "json"
    });
}

//添加contains方法
Array.prototype.contains= function(num){
    for(var i=0; i<this.length; i++){
        if(this[i] == num){
            return true;
        }
    }
    return false;
};
