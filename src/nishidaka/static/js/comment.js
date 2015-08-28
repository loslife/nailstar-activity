Zepto(function($){
    $('body').on('touch', function(ev){
        ev.preventDefault();
    });

    var result = [0, 0, 1];
    var boxs = $('.comment .item');
    var swich = 0;
    var result = 0;
    var answer = 10;
    var num = parseInt(10*Math.random());
    var option = $('.option');
    option.on('tap',function(){
        $(this).addClass('collected');
        var val = $(this).attr("val");


        if (swich<6) {
            $(boxs[swich]).addClass('hide_small');
            $(boxs[swich+1]).removeClass('hide');
            $(boxs[swich+1]).removeClass('show_big');
            $(boxs[swich+1]).addClass('show');
            swich++;
        }
        console.log($('.item1 .comment-option:nth-child(1)').hasClass('collected'));
        if(swich==6){
            if($('.item1 .comment-option').firstChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }

            if($('.item2 .comment-option').firstChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }

            if($('.item3 .comment-option').firstChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }

            if($('.item4 .comment-option').firstChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }

            if($('.item5 .comment-option').lastChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }

            if($('.item6 .comment-option').lastChild.hasClass('collected')){
                result += answer;
            }else{
                result += num;
            }
            console.log(result);
        }
    })


    //添加contains方法
    Array.prototype.contains= function(num){
        for(var i=0; i<this.length; i++){
            if(this[i] == num){
                return true;
            }
        }
        return false;
    };
})