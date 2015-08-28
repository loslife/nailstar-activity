Zepto(function($){
    $('body').on('touch', function(ev){
        ev.preventDefault();
    });

    //多设置两个属性，给出正确答案，然后再去寻找是否对应

    var result = [0, 0, 0, 0, 2, 2];
    var boxs = $('.comment .item');
    var swich = 0;
    var sub = 0;
    var option = $('.option');
    option.on('tap',function(){
        $(this).addClass('collected');
        var val = $(this).attr("val");
        var itemIndex = $(this).parent('div').parent().parent().attr('index');

        if(itemIndex == 1){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[0]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if(itemIndex == 2){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[1]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if(itemIndex == 3){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[2]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if(itemIndex == 4){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[3]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if(itemIndex == 5){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[4]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if(itemIndex == 6){
            var num = parseInt(10*Math.random());
            if($(this).attr('val')== result[5]){
                sub += 10;
            }else{
                sub += num;
            }
            console.log(sub);
        }

        if($('.origin').attr('point') == itemIndex){
            //$('li:nth-child(2)').index();
            console.log(itemIndex);
            $("span:nth-child(itemIndex)").addClass('origin-light');
            $("span:nth-child(itemIndex)").siblings().removeClass('origin-light');
        }

        if (swich<6) {
            $(boxs[swich]).addClass('hide_small');
            $(boxs[swich+1]).removeClass('hide');
            $(boxs[swich+1]).removeClass('show_big');
            $(boxs[swich+1]).addClass('show');
            swich++;
        }

        console.log(sub);

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