Zepto(function($){
    var share = $('#share');
    var transparency = $('#transparency');
    share.click(function(){
        transparency.show();
    })

    transparency.click(function(){
        transparency.hide();
    })
})