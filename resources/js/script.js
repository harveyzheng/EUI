
// 2017-07-26
$(function(){
    // 导航
    $('.z-nav-arrow').mouseover(()=>{
        $('.z-nav').addClass('open');
    });
    $('.z-nav').mouseleave(function(){
        $(this).removeClass('open');
        $('.z-nav-sub').removeClass('open');
        $('.z-nav-sub li[data-nav]').hide();
    });
    $('.z-nav-main a').mouseover(function(){
        $('.z-nav-main a').removeClass('on');
        $(this).addClass('on');
        var item=$(this).data('nav');
        if(item){
            $('.z-nav-sub').addClass('open');
            $('.z-nav-sub li[data-nav]').hide();
            $('.z-nav-sub li[data-nav='+item+']').show();
        }else{
            $('.z-nav-sub').removeClass('open');
            $('.z-nav-sub li[data-nav]').hide();
        };
    });

    // head显示与隐藏
    function headerHide(){
        if($('.z-main-wrap').scrollTop()>10){
            $('.z-header').addClass('z-header-hide');
        }else{
            $('.z-header').removeClass('z-header-hide');
        };
    };
    headerHide();
    $('.z-main-wrap').scroll(headerHide);

    // 弹窗层
    $('[data-layer]').click(function(){
        // 生成弹窗层
        var layer='<div class="z-layer-wrap" zui-ani="fast">'+
                    '<div class="z-layer-main" zui-ani="normal">'+
                        '<div class="z-layer-tit">这是一个标题</div>'+
                        '<a class="z-layer-close" href="javascript:;">&times;</a>'+
                        '<div class="z-layer-context">'+
                        '</div>'+
                    '</div>'+
                '</div>';
        that=$(layer);

        // 插入页面
        $('body').append(that);
        setTimeout(()=>{
            that.addClass('open');
        }, 100);

        // 绑定关闭按钮
        var $close=that.find('.z-layer-close');
        $close.click(()=>{
            that.removeClass('open');
            setTimeout(()=>{
                that.remove();
            }, 200);
        });

        // 加载页面-start
        var $context=that.find('.z-layer-context');
        // page数据，用来索引加载页面
        var page=$(this).data('layer');
        
        // 模拟插入页面
        var pp='<table class="zui-table" zui-txt="center">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td>姓名：<input type="text" class="zui-input" zui-size="small" placeholder="请输入姓名"></td>'+
                            '<td>年龄：<input type="text" class="zui-input" zui-size="small"></td>'+
                            '<td>'+
                                '性别：'+
                                '<div class="zui-radio">'+
                                    '<label class="zui-radio-label">'+
                                        '<input class="zui-radio-input" type="radio" name="sex" checked value="女">'+
                                        '<i class="zui-icon-radio"></i>'+
                                        '<span>女</span>'+
                                    '</label>'+
                                    '<label class="zui-radio-label">'+
                                        '<input class="zui-radio-input" type="radio" name="sex" value="男">'+
                                        '<i class="zui-icon-radio"></i>'+
                                        '<span>男</span>'+
                                    '</label>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table>';
        // 插入页面
        $context.append(pp);
    });

    // 加载页面
    $('.z-nav a').click(function(e){
        e.preventDefault();
        var page=$(this).attr('href');
        if(page!='#'){
            $('.z-main-wrap').load(page);
        }else{
            $('.z-main-wrap').load('backlog.html');
        };
    });
    $('.z-main-wrap').load('backlog.html');

});

