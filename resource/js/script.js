
// 2017-07-26
$(function(){
    // 导航
    $('.z-nav-arrow').mouseover(()=>{
        $('.z-nav').addClass('open');
    });
    $('.z-nav').mouseleave(()=>{
        $('.z-nav').removeClass('open');
    });
})