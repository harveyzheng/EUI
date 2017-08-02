// 2017-07-24
;
// zui-start
"use strict";

var Zui=function(){
    return;
}
// 确认窗、询问窗
Zui.prototype.layer=data=>{
    // 先删除已存在窗口
    $('.zui-layer').remove();
    // 获取类别
    let type=data.type||'alert';
    let title=data.title||'通知';
    let style=data.style||'primary';
    let dom='<div class="zui-layer zui-layer-shade"></div>'+
            '<div class="zui-layer zui-layer-main">'+
                '<div class="zui-layer-main-title zui-bg-'+style+'">'+title+'<i class="zui-layer-main-close zui-icon-guanbi"></i></div>'+
                '<div class="zui-layer-main-info">'+data.info+'</div>';
                if(type=='alert'){
                    // 确认窗 按钮组
                    dom+='<div class="zui-layer-btn" zui="txt-right"><button zui="sm,'+style+'" class="zui-btn zui-layer-okay">确定<button></div>';
                }else if(type=='confirm'){
                    // 询问窗 按钮组
                    dom+='<div class="zui-layer-btn" zui="txt-right"><button zui="sm,'+style+'" class="zui-btn zui-layer-okay">确定</button><button zui="sm" class="zui-btn zui-layer-cancel">取消</button></div>';
                };
    dom+='</div>';
    // 插入dom
    let that=$(dom);
    $('body').append(that);

    // 按钮绑定-确定、取消事件
    let okay=that.find('.zui-layer-okay');
    let cancel=that.find('.zui-layer-cancel');
    if(data.okaycall){
        okay.on('click',()=>data.okaycall(data.okayParam));
    };
    if(data.cancelcall){
        cancel.on('click',()=>data.cancelcall(data.cancelParam));
    };

    // 进入动画
    setTimeout(()=>{
        that.eq(0).addClass('on');
        that.eq(1).addClass('on');
    },100);
    // 按钮绑定-移除对话框
    $('.zui-layer-main button,.zui-layer-main-close').on('click',()=>{
        let type=null;
        that.eq(0).removeClass('on');
        that.eq(1).removeClass('on');
        setTimeout(()=>{
            that.remove();
        },200);
    });
    return false;
};

// 自动消失的提示窗
Zui.prototype.prompts=info=>{
    // 先删除已存在窗口
    if($('.zui-layer-prompt').length) $('.zui-layer-prompt').remove();
    // 生成dom
    let dom='<div class="zui-layer-prompt">'+info+'</div>';
    $('body').append(dom);
    // 动画效果及延时关闭
    setTimeout(()=>$('.zui-layer-prompt').addClass('on'),100);
    setTimeout(()=>{
        $('.zui-layer-prompt').removeClass('on');
        setTimeout(()=>$('.zui-layer-prompt').remove(),200);
    },2500);
    return false;
};

// message消息提示
Zui.prototype.message=data=>{
    // 生成dom
    let tag=data.tag||'消息';
    let style=data.style||'primary';
    let title=data.title||'系统消息';
    let url=data.url||'#';
    let target=data.target||'self';
    let dom='<div class="zui-layer-message">'+
                '<a href="'+url+'" target="_'+target+'">'+
                    '<span class="zui-layer-message-type" zui="'+style+'"><em>'+tag+'</em></span>'+
                    '<span class="zui-layer-message-title">'+title+'</span>'+
                    '<span class="zui-layer-message-info">'+data.info+'</span>'+
                '</a>';
                if(data.hide==false){
                    dom+='<a class="zui-layer-message-close">&times;</a>';
                }
    dom+='</div>';
    let that=$(dom);
    $('body').append(that);
    
    // 动态高度
    let leng=$('.zui-layer-message').length;
    that.css('top',(leng-1)*100+10);

    // 动画效果及延时关闭
    setTimeout(()=>that.addClass('on'),100);
    if(data.hide!=false){
        // 自动关闭
        let st=false; //用于判断是否hover
        let tm=false; //用于判断是否超出删除时常
        that.hover(()=>{
            st=true; //进入hover
        },()=>{
            st=false; //退出hover
            if(tm){ //如果超时则删除
                setTimeout(()=>{
                    that.removeClass('on');
                },100);
                setTimeout(()=>{
                    that.remove();
                    // 重新排序
                    zui.message_sequence();
                },300);
            }
        });
        // 延时关闭
        setTimeout(()=>{
            tm=true; //超出删除时间了
            if(!st){ //如果不为hover则删除
                that.removeClass('on');
                setTimeout(()=>{
                    that.remove();
                    // 重新排序
                    zui.message_sequence();
                },200);
            }
        },5000);
    }else{
        that.find('.zui-layer-message-close').click(()=>{
            // 手动关闭
            setTimeout(()=>{
                that.removeClass('on');
                setTimeout(()=>{
                    that.remove();
                    // 重新排序
                    zui.message_sequence();
                },200);
            },100);
            
        })
    }
    return false;
};

// message窗口排序
Zui.prototype.message_sequence=()=>{
    $('.zui-layer-message').each((i,n)=>{
        $(n).css('top',(i)*100+10);
    });
    return false;
};

// radio、checkbox、switch处理
Zui.prototype.marquee=el=>{
    el.each((i,n)=>{
        let $n=$(n);
        let dom;
        let nm=$n.attr('name')||'';
        let ckd=$n.attr('checked')||'';
        let v=$n.val()||'';
        let tit=$n.attr('title')||'无标题';
        let c=$n.attr('class');
        let id=$n.attr('id')||'';
        if($n.hasClass('zui-radio')){
            // zui-radio
            dom=
            '<label class="zui-radio-label">'+
                '<input id="'+id+'" class="'+c+'" type="radio" name="'+nm+'"'+ckd+' value="'+v+'">'+
                '<i class="zui-icon-radio"></i>'+
                '<span>'+tit+'</span>'+
            '</label>';
        }else if($n.hasClass('zui-checkbox')){
            // zui-checkbox
            dom=
            '<label class="zui-checkbox-label">'+
                '<input id="'+id+'" class="'+c+'" type="checkbox" name="'+nm+'"'+ckd+' value="'+v+'">'+
                '<i class="zui-icon-checkbox"></i>'+
                '<span>'+tit+'</span>'+
            '</label>';
        }else{
            // zui-switch
            dom=
            '<label class="zui-switch-label">'+
                '<input id="'+id+'" class="'+c+'" zui-info="'+$n.attr('zui')+'" type="checkbox" name="'+nm+'"'+ckd+' value="'+v+'">'+
                '<div class="zui-switch-view">'+
                    '<i class="zui-icon-switch"></i>'+
                    '<span class="zui-switch-info"></span>'+
                '</div>'+
            '</label>';
        };
        $n.replaceWith(dom);
    });
    return false;
};

// 处理
Zui.prototype.select=el=>{
    el.each((i,n)=>{
        let $n=$(n);
        let dom;
        let dd='';
        let item=$n.children();
        let ed='';
        // dd列表
        item.each((i,op)=>{
            let $op=$(op);
            let v=$op.val();
            let t=$op.text();
            let c='';
            if($op.is(':selected')){
                c='zui-option';
                ed=$op.text();
            };
            dd+='<dd class="'+c+'" zui="'+v+'">'+t+'</dd>';
        });

        // zui-select-wrap
        let nm=$n.attr('name')||'';
        let c=$n.attr('class');
        let id=$n.attr('id')||'';
        let z=$n.attr('zui')||'md';
        dom=
        '<div class="zui-select-wrap">'+
            '<input class="'+c+' zui-ipt" id="'+id+'" zui="'+z+'" name="'+nm+'" type="text" value="'+ed+'" readonly>'+
            '<i class="zui-select-arrow"></i>'+
            '<dl class="zui-option-list">'+
                dd+
            '</dl>'+
        '</div> ';
        $n.replaceWith(dom);
    });
    return false;
};

// tab切换
Zui.prototype.tabcut=data=>{
    // 初始化
    let wrap=$(data.wrap);
    wrap.each(function(){
        let menu=$(this).find(data.menu);
        let me_item=menu.children();
        let main=$(this).find(data.main);
        let ma_item=main.children();
        me_item.eq(0).addClass('active');
        ma_item.eq(0).addClass('active');
        
        let tar='click';
        if(data.target=='hover')tar='mouseover';

        me_item.on(tar,function(){
            let index=$(this).index();
            me_item.removeClass('active');
            $(this).addClass('active');
            ma_item.removeClass('active');
            ma_item.eq(index).addClass('active');
        });
    })

    


}

// 实例化Zui
var zui=new Zui();
window.onload=function(){

// radio处理
zui.marquee($('.zui-radio'));
// checkbox处理
zui.marquee($('.zui-checkbox'));
// switch处理
zui.marquee($('.zui-switch'));
// select处理
zui.select($('.zui-select'));

// 开关按钮
$('.zui-switch').each(function(){
    let txt=$(this).attr('zui-info').split('|');
    let on=txt[0];
    let off=txt[1];
    let info=$(this).siblings('div').find('.zui-switch-info');
    let that=$(this);
    // 判断info填写内容
    function cge(){
        console.log(1)
        if(that.is(':checked')){
            info.text(on);
        }else{
            info.text(off);
        }
    };
    // 初始化
    cge();
    // 绑定change
    $(this).change(cge);
});

// select下拉事件绑定
$('.zui-select-wrap').on('click',function(ev){
    $('.zui-select-wrap').not(this).removeClass('zui-select-open');
    $(this).toggleClass('zui-select-open');
    return false;
});

// select option选定
$('.zui-option-list dd').on('click',function(){
    $(this).addClass('zui-option').siblings().removeClass('zui-option');
    $(this).parent().siblings('.zui-select').val($(this).text());
});

// body 点击 关闭一些窗口
$('body').on('click',()=>{
    $('.zui-select-wrap').removeClass('zui-select-open');
});

//绑定tab
zui.tabcut({
    wrap:'.zui-tab', //父标签，必填
    menu:'.zui-tab-menu', //导航类，必填
    main:'.zui-tab-main', //内容类，必填
    target:'click' //切换方式，click或hover，默认click
});

};// zui-end










