// 2017-07-24
;
// zui-start
"use strict";

var Zui=function(){
    return;
};
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
        if($n.parents('.zui-radio-label').length||$n.parents('.zui-checkbox-label').length||$n.parents('.zui-switch-label').length) return; //防止重复装载
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

// select处理
Zui.prototype.select=el=>{
    el.each((i,n)=>{
        let $n=$(n);
        if($n.parents('.zui-select-wrap').length) return; //防止重复装载
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
    let w=$(data.wrap);
    w.each(function(){
        // 初始
        let ime=$(this).find(data.menu).children();
        let ima=$(this).find(data.main).children();
        ime.eq(0).addClass('active');
        ima.eq(0).addClass('active');
        
        // 事件类型，默认click，可设置值 hover
        let tar='click';
        if(data.target=='hover')tar='mouseover';

        // 绑定事件
        ime.off().on(tar,function(){
            let index=$(this).index();
            ime.removeClass('active');
            $(this).addClass('active');
            ima.removeClass('active');
            ima.eq(index).addClass('active');
        });
    });
};

// pre编辑器
Zui.prototype.precode=el=>{
    el.each((i,n)=>{
        let $n=$(n);
        if($n.find('.zui-load').length) return; //防止重复装载
        // 初始化内容：替换<>，分割成数组
        let str=$n.html().replace(/</g, "&lt;").replace(/>/g, "&gt;").split("\n");
        let dom='<ol class="zui-pre-ol">';
        let sp=0; //记录空格数量
        str.forEach((s,i)=>{
            // 空格数量
            let spa=s.split(' ').length-1;
            // 记录开头空格数量
            if(i<1){
                sp=spa;
                $n.html('<h3 class="zui-load">'+s.trim()+'<i zui="pull-right">www.zjw7.com</i></h3>');
            }else{
                // 如果开头空格大于等于第一行，截取空格后的内容（删减空格）
                if(spa>=sp) s=s.substring(sp,s.length);
                // 判断是否为注释
                if(s.trim().substring(0,2)=='//' && i!=str.length-1){
                     dom+='<li class="zui-pre-annotations"><span>'+s+'</span></li>';
                }else if(i!=str.length-1){
                     dom+='<li><span>'+s+'</span></li>';
                };
            };
        });
        dom+='</ol>';
        $n.append(dom);
    });
};

// uploadimg图片上传
Zui.prototype.uploadimg=el=>{
    el.each((i,n)=>{
        // max值
        let $n=$(n);
        let z=$n.attr('zui').split(','); //把属性值分开
        let dt=z=>{
            let d={};
            for(let i in z){
                // 找到max值
                if(z[i].indexOf('max-')>=0){
                    //mm记录max值
                    d.m=z[i].substring(4,z[i].length);
                }else if(z[i].indexOf('size-')>=0){
                    d.s=z[i].substring(5,z[i].length);
                }else if(z[i].indexOf('compress-')>=0){
                    d.c=z[i].substring(9,z[i].length);
                };
            };
            return d;
        };
        // 绑定change
        let file=$n.find('.zui-upload-file').attr('alt','');
        file.off().change(ev=>{
            // file发生改变执行uploadfile方法,m是max 最大图片张数;
            zui.uploadfile(ev.target,dt(z));
        });
    });
};

// 图片转base64、压缩
Zui.prototype.uploadfile=(el,dt)=>{
    // dt是object, dt.m是max值代表上传图片张数上限, dt.s是size代表, dt,c是compress代表压缩系数
    let $n=$(el);
    // 校验一下文件格式
    let v=$n.val();
	if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(v)){
		$n.val('');
        zui.prompts('图片类型必须是jpg,png,gif,jpeg中的一种!');
        return false;
    };

    // 校验一下文件大小
    let s=dt.s||2; // 获取配置，默认为2M
    let sz=s*1024*1024;
    // 这里要用原生对象 el，不然files[0]报错！！！
    let f=el.files[0];
    if(f.size>sz){
        zui.prompts('图片大小必须小于'+s+'M');
        return false;
    };

    // 获取图片blob数据
    let g=f=>{
        let u;
        if(window.createObjectURL!=undefined){ // basic
            u=window.createObjectURL(f);
        }else if(window.URL!=undefined){ // mozilla(firefox)
            u=window.URL.createObjectURL(f);
        }else if(window.webkitURL!=undefined){ // webkit or chrome
            u=window.webkitURL.createObjectURL(f);
        }
        return u;
    };

    let blob=g(f);
    let dom;

    // canvas绘制、转base64、图片压缩
    let base64Img=(b,ig)=>{
        // 生成一个img
        let img = new Image();
        img.src = b;
        img.onload = function () {
            //宽高比例
            let w = img.width;
            let h = img.height;
            let scale = w / h;
            // 默认图片质量为100%
            let quality = dt.c/10||1;
            //生成canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // 创建属性节点
            let anw = document.createAttribute("width");
            anw.nodeValue = w;
            let anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(this, 0, 0, w, h);
            // 到这里就完成了图片的生成，插入页面并且取消loading
            // quality值越小，所绘制出的图像越模糊
            let bs64=canvas.toDataURL('image/jpeg',quality);
            if(tp($n.parents('.zui-upload-item'))=='a'){
                $p.find('.zui-upload-item-img').last().find('img').attr('src',bs64).removeAttr('zui-load');
            }else{
                ig.attr('src',bs64).removeAttr('zui-load');
            };
            return;
        };
    };
    // 在这里添加一个框到页面，并且loading状态
    // 获取父标签
    let $p=$n.parents('.zui-upload');
    // 判断是添加图片还是修改
    let tp=p=>{
        if(p.hasClass('zui-upload-item-img')){
            // 标记-修改
            return 'm';
        }else{
            // 标记-添加
            return 'a';
        };
    };
    if(tp($n.parents('.zui-upload-item'))=='a'){
        // 添加
        dom='<div class="zui-upload-item zui-upload-item-img">'+
                '<div class="zui-upload-item-main">'+
                    '<i class="zui-icon-search"></i>'+
                    '<label>修改图片</label>'+
                    '<input class="zui-upload-file" type="file">'+
                    '<img class="zui-upload-img" zui-load="loading" src="">'+
                '</div>'+
            '</div>';
        let leng=dt.m-1||99;
        // 判断数量max了没，到max了删除添加
        if($p.find('.zui-upload-item-img').length==leng){
            $n.parents('.zui-upload-item').remove();
            $p.append(dom);
        }else{
            $n.val('');
            $n.parents('.zui-upload-item').before(dom);
        };
        // base64处理
        base64Img(blob);
    }else{
        // 修改
        let ig=$n.siblings('img');
        ig.attr({'zui-load':'loading','src':''});
        // base64处理
        base64Img(blob,ig);
    };
    // 重新绑定一下这组upload
    zui.uploadimg($n.parents('.zui-upload'));
}

// init初始化
Zui.prototype.init=()=>{
        // radio处理
        zui.marquee($('.zui-radio'));
        // checkbox处理
        zui.marquee($('.zui-checkbox'));
        // switch处理
        zui.marquee($('.zui-switch'));
        // select处理
        zui.select($('.zui-select'));
        // 图片上传
        zui.uploadimg($('.zui-upload'));
        // 开关按钮
        $('.zui-switch').each(function(){
            let txt=$(this).attr('zui-info').split('|');
            let on=txt[0];
            let off=txt[1];
            let info=$(this).siblings('div').find('.zui-switch-info');
            let that=$(this);
            // 判断info填写内容
            function cge(){
                if(that.is(':checked')){
                    info.text(on);
                }else{
                    info.text(off);
                }
            };
            // 初始化
            cge();
            // 绑定change
            $(this).off().change(cge);
        });

        // select下拉事件绑定
        $('.zui-select-wrap').off().on('click',function(){
            $('.zui-select-wrap').not(this).removeClass('zui-select-open');
            $(this).toggleClass('zui-select-open');
            return false;
        });

        // select option选定
        $('.zui-option-list dd').off().on('click',function(){
            $(this).addClass('zui-option').siblings().removeClass('zui-option');
            $(this).parent().siblings('.zui-select').val($(this).text());
        });

        // body 点击 关闭一些窗口
        $('body').off().on('click',()=>{
            $('.zui-select-wrap').removeClass('zui-select-open');
        });

        //绑定tab
        zui.tabcut({
            wrap:'.zui-tab', //父标签，必填
            menu:'.zui-tab-menu', //导航类，必填
            main:'.zui-tab-main', //内容类，必填
            target:'click' //切换方式，click或hover，默认click
        });

        // pre编辑器处理
        zui.precode($('.zui-pre'));

};

// 实例化Zui
let zui=new Zui();