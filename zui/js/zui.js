/*
2017-08-11
name：zui框架-核心js
by：harvey
qq：269144551
官网：http://www.zjw7.com/
*/

// zui 采用es6语法
"use strict";
console.info('%c官方QQ交流群：523772110 查看开发文档请前往 http://www.zjw7.com', 'color:#5be');

// Zui核心构造函数
const Zui=function(){
    // 获取zui.js部署的地址
    const js = document.scripts;
    for(let i=0;i<js.length;i++){
        let s=js[i].src;
        if(s.indexOf('zui.js')>=0||s.indexOf('zui-min.js')>=0){
            this.path=s.substring(0,s.lastIndexOf("/")+1);
        };
    };
    // init初始化
    this.init=c=>{
        if(c){
            // 局部初始化
            c.split(',').forEach(n=>{
                switch(n){
                    case '.zui-radio':
                    case '.zui-checkbox':
                    case '.zui-switch': zui.marquee($(n));
                        break;
                    case '.zui-select': zui.select($(n));
                        break;
                    case '.zui-upload': zui.uploadimg($(n));
                        break;
                    case '.zui-date': zui.optiondate($(n));
                        break;
                    case '.zui-pre': zui.precode($(n));
                        break;
                    case '.zui-nav': zui.nav($(n));
                        break;
                    case '.zui-tab': 
                        zui.tabcut({
                            wrap:'.zui-tab',
                            menu:'.zui-tab-menu',
                            main:'.zui-tab-main'
                        });
                        break;
                    case '.zui-form':
                        zui.marquee($('.zui-radio'));
                        zui.marquee($('.zui-checkbox'));
                        zui.marquee($('.zui-switch'));
                        zui.select($('.zui-select'));
                        break;
                    default:
                        return console.error('%c初始化失败，没找到'+c, 'color:#f33');
                };
            });
            console.info('%c搞定，'+c+'完成初始化', 'color:#5b8');
        }else{
            zui.marquee($('.zui-radio'));
            zui.marquee($('.zui-checkbox'));
            zui.marquee($('.zui-switch'));
            zui.select($('.zui-select'));
            zui.uploadimg($('.zui-upload'));
            zui.optiondate($('.zui-date'));
            $('img').one('error',function(){
                let ph=zui.path;
                $(this).attr("src", zui.path+"../images/transparency.png").addClass('zui-img-error');
            });
            zui.tabcut({
                wrap:'.zui-tab',
                menu:'.zui-tab-menu',
                main:'.zui-tab-main'
            });
            zui.precode($('.zui-pre'));
            zui.nav($('.zui-nav'));
            console.info('%c搞定，全局完成初始化', 'color:#5b8');
        };
    };
    return;
};

// 确认窗、询问窗
Zui.prototype.layer=data=>{
    // 先删除已存在窗口
    $('.zui-layer').remove();
    // 获取类别
    const type=data.type||'alert';
    const title=data.title||'通知';
    const style=data.style||'primary';
    let dom='<div class="zui-layer zui-layer-shade"></div>'+
            '<div class="zui-layer zui-layer-main">'+
                '<div class="zui-layer-main-title" zui="'+style+'">'+title+'<i class="zui-layer-main-close zui-icon-guanbi"></i></div>'+
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
    const that=$(dom);
    $('body').append(that);
    // 按钮绑定-确定、取消事件
    const okay=that.find('.zui-layer-okay');
    const cancel=that.find('.zui-layer-cancel');
    if(data.okaycall){
        okay.on('click',()=>data.okaycall(data.okayparam));
    };
    if(data.cancelcall){
        cancel.on('click',()=>data.cancelcall(data.cancelparam));
    };

    // 进入动画
    setTimeout(()=>{
        that.eq(0).addClass('on');
        that.eq(1).addClass('on');
    },100);
    // 按钮绑定-移除对话框
    $('.zui-layer-main button,.zui-layer-main-close').on('click',()=>{
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
    const dom='<div class="zui-layer-prompt">'+info+'</div>';
    const that=$(dom);
    $('body').append(that);
    // 动画效果及延时关闭
    setTimeout(()=>that.addClass('on'),100);
    setTimeout(()=>{
        that.removeClass('on');
        setTimeout(()=>that.remove(),200);
    },2500);
    return false;
};

// message消息提示
Zui.prototype.message=data=>{
    // 生成dom
    const tag=data.tag||'消息';
    const style=data.style||'primary';
    const title=data.title||'通知消息';
    const url=data.url||'#';
    const target=data.target||'self';
    let dom='<div class="zui-layer-message">'+
                '<a href="'+url+'" target="_'+target+'">'+
                    '<span class="zui-layer-message-type" zui="'+style+'"><em>'+tag+'</em></span>'+
                    '<span class="zui-layer-message-title">'+title+'</span>'+
                    '<span class="zui-layer-message-info">'+data.info+'</span>'+
                '</a>';
                if(data.hide==false) dom+='<a class="zui-layer-message-close">&times;</a>';
    dom+='</div>';
    const that=$(dom);
    $('body').append(that);
    
    // 动态高度
    const leng=$('.zui-layer-message').length;
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
            };
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
        const $n=$(n);
        if($n.parents('.zui-radio-label').length||$n.parents('.zui-checkbox-label').length||$n.parents('.zui-switch-label').length) return; //防止重复替换
        let dom;
        const tit=$n.attr('title')||'无标题';
        const o_ab=n.attributes;
        let o_ar='';
        for(let j=0;j<o_ab.length;j++){
            if(o_ab[j].name!="type") o_ar+=' '+o_ab[j].name+'="'+o_ab[j].value+'"';
        };
        if($n.hasClass('zui-radio')){
            // zui-radio
            dom=
            '<label class="zui-radio-label">'+
                '<input '+o_ar+' type="radio">'+
                '<i class="zui-icon-radio"></i>'+
                '<span>'+tit+'</span>'+
            '</label>';
        }else if($n.hasClass('zui-checkbox')){
            // zui-checkbox
            dom=
            '<label class="zui-checkbox-label">'+
                '<input '+o_ar+' type="checkbox">'+
                '<i class="zui-icon-checkbox"></i>'+
                '<span>'+tit+'</span>'+
            '</label>';
        }else{
            // zui-switch
            dom=
            '<label class="zui-switch-label">'+
                '<input '+o_ar+' type="checkbox">'+
                '<div class="zui-switch-view">'+
                    '<i class="zui-icon-switch"></i>'+
                    '<span class="zui-switch-info"></span>'+
                '</div>'+
            '</label>';
        };
        $n.replaceWith(dom);
    });
    // 开关按钮
    if(el.attr('class')=='zui-switch'){
        $('.zui-switch').each(function(){
            const z=v=>{
                let n;
                if(v.indexOf(',')>=0){
                    n=v.split(',');
                    n.forEach(c=>{
                        if(c.indexOf('|')>=0) n=c;
                    });
                }else{
                    n=[v];
                };
                return n;
            };
            let txt=z($(this).attr('zui'));
            txt.forEach(n=>{
                if(n.indexOf('|')>=0) txt=n.split('|');
            });
            const on=txt[0];
            const off=txt[1];
            const info=$(this).parent().find('.zui-switch-info');
            const that=$(this);
            // 判断info填写内容
            const cge=()=>{
                if(that.is(':checked')){
                    info.text(on);
                }else{
                    info.text(off);
                };
            };
            // 初始化
            cge();
            // 绑定change
            $(this).off().change(cge);
        });
    };
    return false;
};

// select处理
Zui.prototype.select=el=>{
    el.each((i,n)=>{
        const $n=$(n);
        if($n.parents('.zui-select-wrap').length) return; //防止重复替换
        //获取select自定义属性
        const i_ab=n.attributes;
        let i_ar='';
        for(let j=0;j<i_ab.length;j++){
            if(i_ab[j].name!='disabled') i_ar+=' '+i_ab[j].name+'="'+i_ab[j].value+'"';
        };
        let dom;
        const item=$n.children();
        let dd='';
        let ed='';
        let vl='';
        // dd列表
        item.each((i,op)=>{
            // 获取op自定义属性
            const o_ab=op.attributes;
            let o_ar='';
            for(let j=0;j<o_ab.length;j++){
                if(o_ab[j].name!='class' && o_ab[j].name!='value') o_ar+=' '+o_ab[j].name+'="'+o_ab[j].value+'"';
            };
            const $op=$(op);
            const v=$.trim($op.val());
            let t=$.trim($op.text());
            let c=$op.attr('class')||'';
            if($op.is(':selected')){
                c+=' zui-option';
                ed=t;
                vl=v;
            };
            const src=o_ar.split('"')||o_ar.split("'");
            if(o_ar.indexOf('zui-img')>=0) t='<span class="zui-select-img"><img src="'+src[1]+'"></span>'+'<span class="zui-select-txt">'+t+'</span>';
            dd+='<dd class="'+c+'" '+o_ar+' zui-val="'+v+'">'+t+'</dd>';
        });
        // zui-select-wrap
        const db=$n.attr('disabled')||'';
        dom=
        '<div class="zui-select-wrap">'+
            '<input '+i_ar+' type="text" value="'+ed+'" zui-val="'+vl+'" zui-txt="'+ed+'" readonly '+db+'>'+
            '<i class="zui-select-arrow"></i>'+
            '<dl class="zui-option-list">'+
                dd+
            '</dl>'+
        '</div> ';

        // 替换select
        let that=$(dom);
        $n.replaceWith(that);

        // 事件绑定
        that.on('click',function(){
            if($(this).find('.zui-select').attr('disabled')) return;
            $('.zui-select-wrap').not(this).removeClass('zui-select-open');
            $(this).toggleClass('zui-select-open');
        });
        that.find('dd').on('click',function(){
            if($(this).attr('disabled')) return false;
            $(this).addClass('zui-option').siblings().removeClass('zui-option');
            that.find('.zui-select').val($(this).text()).attr({'zui-val':$(this).attr('zui-val'),'zui-txt':$(this).text()}).trigger('change');
        });
    });
    // 关闭绑定
    $('body').on('click',(e)=>{
        let el=$(e.target);
        // 关闭select
        if(el.parents('.zui-select-wrap').length==0){
            $('.zui-select-wrap').removeClass('zui-select-open');
        };
    });
    return false;
};

// tab切换
Zui.prototype.tabcut=data=>{
    // 初始化
    const w=$(data.wrap);
    w.each(function(){
        // 初始
        const ime=$(this).find(data.menu).children();
        const ima=$(this).find(data.main).children();
        ime.eq(0).addClass('active');
        ima.eq(0).addClass('active');
        
        // 事件类型，默认click，可设置值 hover
        let tar='click';
        if(data.target=='hover')tar='mouseover';

        // 绑定事件
        ime.off().on(tar,function(){
            const index=$(this).index();
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
        const $n=$(n);
        if($n.find('.zui-pre-title').length) return; //防止重复装载
        // 初始化内容：替换<>，分割成数组
        const str=$n.html().replace(/</g, "&lt;").replace(/>/g, "&gt;").split("\n");
        let dom='<ol class="zui-pre-ol">';
        let sp=0; //记录空格数量
        str.forEach((s,i)=>{
            // 空格数量
            let spa=s.split(' ').length-1;
            // 记录开头空格数量
            if(i<1){
                sp=spa;
                $n.html('<h3 class="zui-pre-title">'+s.trim()+'<i zui="pull-right">www.zjw7.com</i></h3>');
            }else{
                // 如果开头空格大于等于第一行，截取空格后的内容（删减空格）
                if(spa>=sp) s=s.substring(sp,s.length);
                // 判断是否为注释
                if(s.trim().substring(0,2)=='//' || s.indexOf('!--')!=-1 && i!=str.length-1){
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
        const $n=$(n);
        const z=$n.attr('zui').split(','); //把属性值分开
        const dt=z=>{
            let d={};
            z.forEach(n=>{
                if(n.indexOf('max:')>=0){
                    d.m=n.substring(4,n.length);
                }else if(n.indexOf('size:')>=0){
                    d.s=n.substring(5,n.length);
                }else if(n.indexOf('compress:')>=0){
                    d.c=n.substring(9,n.length);
                };
            });
            // 返回zui-upload的zui参数
            return d;
        };
        const add=
        '<div class="zui-upload-item">'+
            '<div class="zui-upload-item-main zui-upload-add">'+
                '<label>'+
                    '<i class="zui-icon-upload"></i>'+
                    '<span>上传图片</span><input class="zui-upload-file" type="file">'+
                '</label>'+
            '</div>'+
        '</div>';
        // 子元素初始化
        const c=$n.find('.zui-upload-item');
        c.each((ii,nn)=>{
            const $nn=$(nn);
            if(!$nn.find('.zui-upload-item-main')){
                // 把简化版的html完成
            };
        });
        // 查看图片
        $n.find('.zui-img-see').off().click(function(){
            const list=el.find('img');
            const index=list.index($(this).parents('.zui-upload-item').find('img'));
            // 开启图片查看
            zui.imglayer({list,index});
            return false; // 阻止冒泡
        });
        // 删除图片
        $n.find('.zui-upload-delete').one('click',function(){
            $(this).parent().remove();
            if($n.find('.zui-upload-add').length<1){
                $n.append(add);
                zui.uploadimg($n);
                return false;
            };
        });
        // 绑定change
        const file=$n.find('.zui-upload-file');
        file.off().change(ev=>{
            // file发生改变执行uploadfile方法,传递当前file和父标签配置参数;
            zui.uploadfile(ev.target,dt(z));
        });
    });
};

// 图片转base64、压缩
Zui.prototype.uploadfile=(el,dt)=>{
    // dt.m是max上传图片张数上限, dt.s是size, dt,c是compress压缩系数
    const $n=$(el);
    // 校验一下文件格式
    const v=$n.val();
	if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(v)){
		$n.val('');
        zui.prompts('图片类型必须是jpg,png,gif,jpeg中的一种!');
        return false;
    };

    // 校验一下文件大小
    const s=dt.s||2; // 获取配置，默认为2M
    const sz=s*1024*1024;
    // 这里要用原生对象 el，不然files[0]报错！！！
    const f=el.files[0];
    if(f.size>sz){
        zui.prompts('图片大小必须小于'+s+'M');
        return false;
    };

    // 获取图片blob数据
    const g=f=>{
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

    const blob=g(f);
    let dom;

    // canvas绘制、转base64、图片压缩
    const base64Img=(b,ig)=>{
        // 生成一个img
        const img=new Image();
        img.src=b;
        img.onload=function(){
            //宽高比例
            const w=img.width;
            const h=img.height;
            const scale=w/h;
            // 默认图片质量为100%
            const quality=dt.c/10||1;
            //生成canvas
            const canvas=document.createElement('canvas');
            const ctx=canvas.getContext('2d');
            // 创建属性节点
            const anw=document.createAttribute("width");
            anw.nodeValue=w;
            const anh=document.createAttribute("height");
            anh.nodeValue=h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(this, 0, 0, w, h);
            // 到这里就完成了图片的生成，插入页面并且取消loading
            // quality值越小，所绘制出的图像越模糊
            const bs64=canvas.toDataURL('image/jpeg',quality);
            if(tp($n.parents('.zui-upload-item-main'))=='a'){
                $p.find('.zui-upload-img').last().find('img').attr('src',bs64).removeAttr('zui-load');
            }else{
                ig.attr('src',bs64).removeAttr('zui-load');
            };
            return;
        };
    };
    // 在这里添加一个框到页面，并且loading状态
    // 获取父标签
    const $p=$n.parents('.zui-upload');
    // 判断是添加图片还是修改
    const tp=p=>{
        if(p.hasClass('zui-upload-img')){
            // 标记-修改
            return 'm';
        }else{
            // 标记-添加
            return 'a';
        };
    };
    if(tp($n.parents('.zui-upload-item-main'))=='a'){
        // 添加
        dom='<div class="zui-upload-item">'+
                '<i class="zui-icon-guanbi zui-upload-delete" zui="danger"></i>'+
                '<div class="zui-upload-item-main zui-upload-img">'+
                    '<label>'+
                        '<i class="zui-icon-search zui-img-see"></i>'+
                        '<span>修改图片</span>'+
                        '<input class="zui-upload-file" type="file">'+
                    '</label>'+
                    '<img zui-load="loading" src="">'+
                '</div>'+
            '</div>';
            const leng=dt.m-1||99;
        // 判断数量max了没，到max了删除添加
        if($p.find('.zui-upload-img').length==leng){
            $n.parents('.zui-upload-add').parent().remove();
            $p.append(dom);
        }else{
            $n.val('');
            $n.parents('.zui-upload-item').before(dom);
        };
        // base64处理
        base64Img(blob);
    }else{
        // 修改
        const ig=$n.parent().siblings('img');
        ig.attr({'zui-load':'loading','src':''});
        // base64处理
        base64Img(blob,ig);
    };
    // 重新绑定一下这组upload
    zui.uploadimg($p);
};

// 图片列表弹出层、调用轮播
Zui.prototype.imglayer=dt=>{
    let li='';
    // 循环出图片
    dt.list.each((i,n)=>{
        let c='';
        if(dt.index==i) c='active';
        li+='<li class="'+c+'"><img src="'+$(n).attr('src')+'"></li>';
    });
    const dom='<div class="zui-layer zui-layer-shade"></div>'+
            '<div class="zui-imglayer">'+
                '<a class="zui-imglayer-close zui-icon-guanbi zui-btn" zui="danger"></a>'+
                '<a class="zui-imglayer-prev prev zui-icon-left"></a>'+
                '<a class="zui-imglayer-next next zui-icon-left"></a>'+
                '<ul class="zui-imglayer-main">'+
                    li+
                '</ul>'+
            '</div>';
            const that=$(dom);
    // 插入页面
    $('body').append(that);
    // 绑定轮播
    zui.imgfocus({
        main:'.zui-imglayer', //父标签
        item:'.zui-imglayer-main li', //轮播体
        index:dt.index,  //默认焦点，可选，不填为0
        autoplay:true //是否自动播放，可选，不填为false
    });
    // 关闭
    that.find('.zui-imglayer-close').click(()=>{
        that.eq(0).removeClass('on');
        that.eq(1).removeClass('on');
        setTimeout(()=>{
            that.remove();
        },200);
    });
    // 入场动画
    setTimeout(()=>{
        that.eq(0).addClass('on');
        that.eq(1).addClass('on');
    },100);
};

// 图片查看、轮播
Zui.prototype.imgfocus=da=>{
    // 切换上限、下限和li集合;
    const $wp=$('body').find(da.main);
    if($wp.length>1) return console.error('imgfocus方法中绑定的main类不是唯一！');
    const $ag=$wp.find(da.item);
    const min=0;
    const max=$ag.length-1;
    let index=da.index;
    // 只有一张图就隐藏切换按钮
    if(!max) $wp.find('.prev,.next').hide();
    let play;
    // 自动播放
    const auto=()=>{
        if(da.autoplay){
            play=setInterval(()=>{
                next();
            },da.palytime||3000);
        };
    };
    auto();

    // 切换
    const next=()=>{
        clearInterval(play);
        auto();
        if(index==max){
            // 是否循环
            if(da.loop!==false){
                index=min-1;
            }else{
                return;
            };
        };
        index++;
        $ag.removeClass('active');
        return $ag.eq(index).addClass('active');;
    };
    const prev=()=>{
        clearInterval(play);
        auto();
        if(index==min){
            // 是否循环
            if(da.loop!==false){
                index=max+1;
            }else{
                return;
            };
        };
        index--;
        $ag.removeClass('active');
        return $ag.eq(index).addClass('active');;
    };
    // 切换事件
    $wp.find('.prev,.next').click(function(){
        if($(this).hasClass('prev')){
            // 上一张
            prev();
        }else if($(this).hasClass('next')){
            // 下一张
            next();
        };
    });
    // 关闭停止自动轮播
    $wp.find('.zui-imglayer-close').click(()=>{
        clearInterval(play);
    });
};

// 日历模块
Zui.prototype.calendar=c=>{
    let $n = c;
    // zui-date绑定
    $n.on("click",function(){
        $('.zui-calendar').remove();
        let ts,up,lw,z;
        z=$n.attr('zui');
        if(!z) z=''; // 防止没设置zui属性时报错
        z.split(',').forEach(n=>{
            if(n.indexOf(':')){
                let c=n.split(':');
                switch(c[0]){
                    case 'times': ts=c[1];
                        break;
                    case 'upper': up=c[1];
                        break;
                    case 'lower': lw=c[1];
                };
            };
        });
        // 参数初始化
        c.upper=up||NaN;
        c.lower=lw||NaN;
        c.times=ts||'false';
        // 上限参数
        if(c.upper){
            if(c.upper=='today'){
                // 上限今天
                c.upper=new Date();
            }else if(c.upper.indexOf('.')>=0||c.upper.indexOf('#')>=0){
                let b=$(c.upper).val();
                if(b){
                    c.upper=new Date(b);
                };
            }else{
                c.upper=new Date(c.upper);
            };
        };
        // 下限参数
        if(c.lower){
            c.lower.toString();
            if(c.lower=='today'){
                // 如果下限是今天，今天也要可选
                const d=new Date();
                // 计算昨天
                const y=d=>{

                };
                c.lower=new Date(y(d));
            }else if(c.lower.indexOf('.')>=0||c.lower.indexOf('#')>=0){
                let b=$(c.lower).val();
                if(b){
                    c.lower=new Date(b);
                };
            }else{
                c.lower=new Date(c.lower);
            };
        };
        cd($n);
        // 点击外部隐藏
        $(document).mouseup(e=>{
            if($(e.target).attr("class") != $n.attr("class") && $(e.target).parents('.zui-calendar').length==0&&$(e.target).parents('.zui-caltab-year,.zui-caltab-month').length==0){
                that.remove();
            };
        });
        // 关闭
        $(document).on('click','.zui-calendar .close',()=>{
            that.remove();
        });
        // 现在时间
        $(document).on('click','.zui-calendar .now',()=>{
            vto(c.times);
            that.remove();
        });
    });

    // 输出现在时间
    let vto=zt=>{
        let tod=new Date();
        let m=tod.getMonth()+1;
        if(m<10) m='0'+m;
        let d=tod.getDate();
        if(d<10) d='0'+d;
        let h,n,s,v;
        v=tod.getFullYear()+'-'+m+'-'+d;
        if(zt){
            h=tod.getHours();
            if(h<10) h='0'+h;
            n=tod.getMinutes();
            if(n<10) n='0'+n;
            s=tod.getSeconds();
            if(s<10) s='0'+s;
            v+=' '+h+':'+n+':'+s;
        };
        ttt=v;
        $n.val(v);
    };

    // 初始化
    let today,e,f,q,that;
    const cd=n=>{
        let nv=$n.val();
        if(nv!=''){
            if(c.times=='true'){
                const av=nv.split(' ');
                nv=av[0];
                hhh=' '+av[1];
            };
            today = new Date(nv);
        }else{
            today = new Date();
        };
        e = today.getFullYear();
        f = today.getMonth();
        q = today.getDate();
        let k = "";
        k += "<div class='zui-calendar'>";
        k += "  <div class='zui-calendar-main'>";
        k += "    <div class='zui-calendar-main-title'>";
        k += "      <a class='zui-prev-month zui-icon-zuo'></a><span class='zui-calendar-main-title-tit'><span class='zui-year-txt'><a class='currentYear'>" + e + "</a>\u5e74</span><span class='zui-month-txt'><a class='currentMonth'>" + (f + 1) + "</a>\u6708</span></span><a class='zui-next-month zui-icon-you'></a>";
        k += "    </div>";
        k += "    <div class='zui-calendar-main-con'>";
        k += "      <div class='zui-calendar-reserve'>";
        k += "      </div>";
        k += "      <div class='zui-calendar-enabled'>";
        k += setD(e, f);
        k += "      </div>";
        k += "    </div>";
        k += "  </div>";
        k += "</div>";
        that=$(k);
        
        $n.parent('.zui-date-wrap').append(that);

        // 计算出现位置，是否超出可视范围
        const t=()=>{
            return n.innerHeight()+5;
        };

        // 出现位置
        that.css({
            'top': t(),
            'left':0
        });
        // 加载时分秒选择功能
        hns(c.times);

        // 绑定选择日期
        bindDay();
        // 绑定操作
        mp();
    };

    // 最终输出的时间
    let ttt='';
    let hhh=' 00:00:00';

    // 时分秒
    const hns=d=>{
        if(d!='true') return;
        let sp=$n.val().split(' ');
        if(sp.length>1){
            sp=sp[1].split(':');
        }else{
            sp=['00','00','00'];
        };

        let t='';
        t+='<div class="zui-calendar-times" zui="txt-left">';
        t+=    '<div class="zui-calendar-times-item zui-calendar-times-show">';
        t+=        '<span class="zui-calendar-times-title">时间</span>';
        t+=        '<span class="zui-calendar-times-con" zui="txt-right"><i id="zui-calendar-times-show-hh">'+sp[0]+'</i>:<i id="zui-calendar-times-show-nn">'+sp[1]+'</i>:<i id="zui-calendar-times-show-ss">'+sp[2]+'</i></span>';            
        t+=    '</div>';
        t+=    '<div class="zui-calendar-times-item">';
        t+=        '<span class="zui-calendar-times-title">小时</span>';
        t+=        '<span class="zui-calendar-times-con"><b class="zui-calendar-times-minus">&minus;</b><b class="zui-calendar-times-plus">&plus;</b><input id="zui-range-hh" type="range" min="00" max="24" step="1" value="'+sp[0]+'"></span>';
        t+=    '</div>';
        t+=    '<div class="zui-calendar-times-item">';
        t+=        '<span class="zui-calendar-times-title">分钟</span>';
        t+=        '<span class="zui-calendar-times-con"><b class="zui-calendar-times-minus">&minus;</b><b class="zui-calendar-times-plus">&plus;</b><input id="zui-range-nn" type="range" min="00" max="60" step="1" value="'+sp[1]+'"></span>';
        t+=    '</div>';
        t+=    '<div class="zui-calendar-times-item">';
        t+=        '<span class="zui-calendar-times-title">秒钟</span>';
        t+=        '<span class="zui-calendar-times-con"><b class="zui-calendar-times-minus">&minus;</b><b class="zui-calendar-times-plus">&plus;</b><input id="zui-range-ss" type="range" min="00" max="60" step="1" value="'+sp[2]+'"></span>';
        t+=    '</div>';
        t+=    '<div class="zui-calendar-times-item zui-calendar-times-now">';
        t+=        '<button class="zui-btn now" zui="sm,primary,pull-left">当前时间</button>';
        t+=        '<button class="zui-btn close" zui="sm,pull-right">关闭</button>';
        t+=    '</div>';
        t+='</div>';

        const $dom=$(t);
        that.find('.zui-calendar-main-con').append($dom);

        that.find('.zui-calendar-times-con b').click(function(){
            const ipt=$(this).siblings('input');
            let v=Number(ipt.val());
            if($(this).hasClass('zui-calendar-times-minus')&&v>ipt.attr('min')){
                v-=1;
            }else if($(this).hasClass('zui-calendar-times-plus')&&v<ipt.attr('max')){
                v+=1;
            };
            ipt.val(v);
            if(v.toString().length==1) v='0'+v;
            let m=gId(ipt.attr('id'));
            cg(v,m);
            f();
        });

        let gId=id=>{
            let m;
            switch(id){
                case 'zui-range-hh': m='#zui-calendar-times-show-hh';
                    break;
                case 'zui-range-nn': m='#zui-calendar-times-show-nn';
                    break;
                default: m='#zui-calendar-times-show-ss';
            };
            return m;
        };

        // 获取时分秒显示值
        const h=$dom.find('#zui-range-hh');
        const n=$dom.find('#zui-range-nn');
        const s=$dom.find('#zui-range-ss');

        // 鼠标拖动滑块
        $dom.find('input[type="range"]').mousedown(function(){
            $(this).on('mousemove change',function(e){
                let v=$(this).val();
                if(v.length==1) v='0'+v;
                let m=gId($(this).attr('id'));
                cg(v,m);
                // 输出
                if(e.type=='change') f();
            });
        });
        // 改变数值
        let cg=(v,m)=>{
            m=$dom.find(m);
            m=$dom.find(m);
            // 动态显示值
            m.addClass('on').text(v);
        };
        // 鼠标放开滑块
        $dom.find('input[type="range"]').on('mouseup',function(){
            $(this).off('mousemove');
            // 输出
            f();
        });
        // 输出hhh数据
        const f=()=>{
            // 添加时分秒数据
            hhh=' ';
            $dom.find('.zui-calendar-times-show i').each((i,n)=>{
                hhh+=$(n).text();
                if($dom.find('.zui-calendar-times-show i').length!=i+1) hhh+=':';
            });
            $dom.find('.on').removeClass('on');
            // 如果还没选ttt，输出当天
            if(!ttt){
                vto();
            };
            $n.val(ttt+hhh);
        };
    };
    // 绑定日期选择
    const bindDay=()=>{
        that.find(".zui-caltab-day a").mousedown(function(){
            let a = new Date(that.find(".currentYear").text() + "/" + that.find(".currentMonth").text() + "/1");
            let d = $(this).text();
            if($(this).hasClass("prevD")) {
                // 如果选择上个月的天数
                a.setMonth(a.getMonth() - 1);
                a.setDate(d);
                that.find(".zui-prev-month").triggerHandler("mousedown");
            }else if($(this).hasClass("nextD")) {
                // 如果选择下个月的天数
                a.setMonth(a.getMonth() + 1);
                a.setDate(d);
                that.find(".zui-next-month").triggerHandler("mousedown");
            };
            // 输出日期
            ttt = a.getFullYear() + "-" + (Number(a.getMonth() + 1) < 10 ? "0" + Number(a.getMonth() + 1) : Number(a.getMonth() + 1)) + "-" + (Number(d) < 10 ? "0" + d: d);

            $(".zui-calendar table a").removeClass("select");
            // 给已选日期加标记
            $(".zui-caltab-day a:contains('" + d + "')").each(function() {
                d == $(this).text() && !$(this).hasClass("prevD") && !$(this).hasClass("nextD") && $(this).addClass("select");
            });

            if(c.times!='true'){
                $n.val(ttt);
                that.remove();
            }else{
                $n.val(ttt+hhh);
            };
            return false;
        });
    };
    // 绑定月份选择
    const bindMonth=()=>{
        that.find(".zui-caltab-month a").mousedown(function() {
            const a = setD(Number(that.find(".currentYear").text()), Number($(this).attr("val")));
            that.find(".currentMonth").text(Number($(this).attr("val")) + 1);
            update('close',a);
            bindDay();
        });
    };
    // 选择年份选择
    const bindYear=()=>{
        that.find(".zui-caltab-year a").mousedown(function() {
            const a = setD(Number($(this).text()), Number(that.find(".currentMonth").text()) - 1);
            that.find(".currentYear").text(Number($(this).text()));
            update('close',a);
            bindDay();
        });
    };
    // 生成日期天数
    const setD=(a, b)=>{
        const newDate = new Date(a, b, 1);
        newDate.setDate(0);
        let d = 1;
        let h = newDate.getDate();
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + 1);
        let m = newDate.getDay();
        h = h - m + 1;
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(0);
        let o = newDate.getDate(),
        g = "<table class='zui-caltab-day'><tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr>",
        i = w(),
        l = "",
        p = "",
        t = "";
        let xx=5;
        if(m>4&&o>30) xx=6;
        for(let x = 0; x < xx; x++){
            g += "<tr>";
            for(let y = 0; y < 7; y++){
                let j = x * 7 + y + 1 - m;
                p = l = "";
                if(c.lower != NaN && c.lower > new Date(newDate.getFullYear(), newDate.getMonth(), j) || c.upper != NaN && new Date(newDate.getFullYear(), newDate.getMonth(), j) > c.upper) if(0 < j && j <= o) {
                    if(newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                    g += "<td><span class='" + l + "'>" + j + "</span></td>";
                }else if(j <= 0) {
                    if(newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                    g += "<td><span class='" + l + "' " + t + ">" + h + "</span></td>";
                    h++;
                }else{
                    if(j > o) {
                        if(newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                        g += "<td><span class='" + l + "' " + t + ">" + d + "</span></td>";
                        d++;
                    };
                }else if(0 < j && j <= o) {
                    if(newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                    if(newDate.getFullYear() == i.getFullYear() && newDate.getMonth() == i.getMonth() && j == i.getDate()) p = "select";
                    g += "<td><a class='" + p + " " + l + "'>" + j + "</a></td>";
                }else if(j <= 0) {
                    if(newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                    if(newDate.getFullYear() == i.getFullYear() && newDate.getMonth() - 1 == i.getMonth() && h == i.getDate()) p = "select";
                    g += "<td><a class='prevD " + p + " " + l + "' " + t + ">" + h + "</a></td>";
                    h++;
                }else if(j > o) {
                    if(newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                    if(newDate.getFullYear() == i.getFullYear() && newDate.getMonth() + 1 == i.getMonth() && d == i.getDate()) p = "select";
                    g += "<td><a class='nextD " + p + " " + l + "' " + t + ">" + d + "</a></td>";
                    d++;
                };
                g = g.replace("class=' '", "");
            };
            g += "</tr>";
        };
        g += "</table>";
        return g;
    };
    // 生成月份
    const setM=a=>{
        let b = w(),
        d = "<table class='zui-caltab-month'>";
        d += "<tr>";
        d += "<td><a val='0' " + (a == b.getFullYear() && 0 == b.getMonth() ? "class='select'": "") + " " + (a == e && 0 == f ? "class='current'": "") + ">\u4e00\u6708</a></td>";
        d += "<td><a val='1' " + (a == b.getFullYear() && 1 == b.getMonth() ? "class='select'": "") + " " + (a == e && 1 == f ? "class='current'": "") + ">\u4e8c\u6708</a></td>";
        d += "<td><a val='2' " + (a == b.getFullYear() && 2 == b.getMonth() ? "class='select'": "") + " " + (a == e && 2 == f ? "class='current'": "") + ">\u4e09\u6708</a></td>";
        d += "<td><a val='3' " + (a == b.getFullYear() && 3 == b.getMonth() ? "class='select'": "") + " " + (a == e && 3 == f ? "class='current'": "") + ">\u56db\u6708</a></td>";
        d += "</tr>";
        d += "<tr>";
        d += "<td><a val='4' " + (a == b.getFullYear() && 4 == b.getMonth() ? "class='select'": "") + " " + (a == e && 4 == f ? "class='current'": "") + ">\u4e94\u6708</a></td>";
        d += "<td><a val='5' " + (a == b.getFullYear() && 5 == b.getMonth() ? "class='select'": "") + " " + (a == e && 5 == f ? "class='current'": "") + ">\u516d\u6708</a></td>";
        d += "<td><a val='6' " + (a == b.getFullYear() && 6 == b.getMonth() ? "class='select'": "") + " " + (a == e && 6 == f ? "class='current'": "") + ">\u4e03\u6708</a></td>";
        d += "<td><a val='7' " + (a == b.getFullYear() && 7 == b.getMonth() ? "class='select'": "") + " " + (a == e && 7 == f ? "class='current'": "") + ">\u516b\u6708</a></td>";
        d += "</tr>";
        d += "<tr>";
        d += "<td><a val='8' " + (a == b.getFullYear() && 8 == b.getMonth() ? "class='select'": "") + " " + (a == e && 8 == f ? "class='current'": "") + ">\u4e5d\u6708</a></td>";
        d += "<td><a val='9' " + (a == b.getFullYear() && 9 == b.getMonth() ? "class='select'": "") + " " + (a == e && 9 == f ? "class='current'": "") + ">\u5341\u6708</a></td>";
        d += "<td><a val='10' " + (a == b.getFullYear() && 10 == b.getMonth() ? "class='select'": "") + " " + (a == e && 10 == f ? "class='current'": "") + ">\u5341\u4e00\u6708</a></td>";
        d += "<td><a val='11' " + (a == b.getFullYear() && 11 == b.getMonth() ? "class='select'": "") + " " + (a == e && 11 == f ? "class='current'": "") + ">\u5341\u4e8c\u6708</a></td>";
        d += "</tr>";
        d += "</table>";
        return d;
    };
    // 生成年份
    const setY=a=>{
        a = Math.floor(a / 10) * 10;
        let b = "<table class='zui-caltab-year'>",
        d = w(),
        h = "",
        m = "",
        o = "";
        for(let g = 0; g < 3; g++) {
            b += "<tr>";
            for(let i = 0; i < 4; i++) {
                m = h = "";
                if(g + 1 * i + 1 != 1 && (g + 1) * (i + 1) != 12) {
                    if(a == d.getFullYear()) h = "select";
                    if(a == e) m = "current";
                    b += "<td><a class='" + h + " " + m + "' >" + a + "</a></td>";
                    a++
                }else if(g + 1 * i + 1 == 1) {
                    if(a - 1 == d.getFullYear()) h = "select";
                    if(a - 1 == e) m = "current";
                    b += "<td><a class='prevY " + h + " " + m + "' " + o + ">" + (a - 1) + "</a></td>";
                }else{
                    if(a == d.getFullYear()) h = "select";
                    if(a == e) m = "current";
                    b += "<td><a class='nextY " + h + " " + m + "' " + o + ">" + a + "</a></td>";
                };
            };
            b += "</tr>";
        };
        b += "</table>";
        return b;
    };
    // 切换
    const update=(s,d,m)=>{
        const reserve=that.find(".zui-calendar-reserve");
        const enabled=that.find(".zui-calendar-enabled");
        if(s=='open'){
            reserve.html(d);
            reserve.css('top',36);
        }else if(s=='close'){
            reserve.empty();
            reserve.css('top','-100%');
            enabled.html(d);
        }else{
            if(m){
                reserve.html(d);
            }else{
                enabled.html(d);
            };
        };
    };
    // 格式化日期
    const w=()=>{
        const reg = /(\d\d\d\d)(\W)?(\d\d)(\W)?(\d\d)/g;
        let a = $n.val();
        a = a.replace(reg, "$1/$3/$5@").split("@")[0];
        return new Date(a);
    };
    // 操作绑定
    const mp=()=>{
        that.find(".zui-prev-month").mousedown(()=>{
            if($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                d = setM(Number($('.zui-calendar').find(".currentYear").text()) - 1);
                update('prev',d,true);
                bindMonth();
                $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 1);
            }else if($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                d = setY(Number($('.zui-calendar').find(".currentYear").text()) - 10);
                update('prev',d,true);
                bindYear();
                $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 10);
            }else if($('.zui-calendar').find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                const a = $('.zui-calendar').find(".currentYear"),
                b = $('.zui-calendar').find(".currentMonth"),
                d = setD(Number(a.text()), Number(b.text()) - 2);
                update('prev',d);
                if(Number(b.text()) != 1) b.text(Number(b.text()) - 1);
                else{
                    a.text(Number(a.text()) - 1);
                    b.text("12");
                }
                bindDay();
            };
            return false;
        });
        that.find(".zui-next-month").mousedown(()=>{
            if(that.find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                d = setM(Number(that.find(".currentYear").text()) + 1);
                update('next',d,true);
                bindMonth();
                that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 1)
            }else if(that.find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                d = setY(Number(that.find(".currentYear").text()) + 10);
                update('next',d,true);
                bindYear();
                that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 10)
            }else if(that.find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                const a = that.find(".currentYear"),
                b = that.find(".currentMonth"),
                d = setD(Number(a.text()), Number(b.text()));
                update('next',d);
                if(Number(b.text()) != 12) b.text(Number(b.text()) + 1);
                else{
                    a.text(Number(a.text()) + 1);
                    b.text("1");
                }
                bindDay();
            };
            return false;
        });
        that.find(".zui-month-txt").mousedown(()=>{
            const a = setM(Number(that.find(".currentYear").text()));
            update('open',a);
            bindMonth();
            return false;
        });
        that.find(".zui-year-txt").mousedown(()=>{
            const a = setY(Number(that.find(".currentYear").text()));
            update('open',a);
            bindYear();
            return false;
        });
    };
};

// zui-date绑定
Zui.prototype.optiondate=el=>{
    el.each((i,n)=>{
        // 获取自定义属性
        const o_ab=n.attributes;
        let o_ar='';
        for(let j=0;j<o_ab.length;j++){
            o_ar+=' '+o_ab[j].name+'="'+o_ab[j].value+'"';
        };
        const $n=$(n);
        const dom=
            '<div class="zui-date-wrap">'+
                '<input '+o_ar+' readonly>'+
                '<i class="zui-icon-date"></i>'+
            '</div>';
            const that=$(dom);
        $n.replaceWith(that);
        
        // 绑定插件
        zui.calendar(that.find('.zui-date'));
    });
};

// nav导航
Zui.prototype.nav=el=>{
    el.each((i,n)=>{
        const $n=$(n);
        // 添加下划线元素
        $n.append('<div class="zui-nav-sliding"></div>');
        const $s=$n.find('.zui-nav-sliding');

        const $li=$n.find('li');
        // ul左距
        const uw=$n.offset().left;

        // 初始化下划线位置和长度
        $s.css({
            width:$n.find('.active').innerWidth(),
            left:$n.find('.active').offset().left-uw
        });
        // hover事件和click更改active
        let sto;
        $li.off().hover(function(){
            // 下划线移动并改变长度
            const w=$(this).innerWidth();
            $s.css({width:w,left:$(this).offset().left-uw});
            // 展开二级
            $(this).find('.zui-nav-child').addClass('open');
            $(this).siblings().find('.zui-nav-child').removeClass('open');
            clearTimeout(sto);
        },function(){
            // 下划线移动回active处,延时500ms
            const $at=$n.find('.active');
            const that=$(this);
            sto=setTimeout(function(){
                $s.css({width:$at.innerWidth(),left:$at.offset().left-uw});
                // 收起二级
                that.find('.zui-nav-child').removeClass('open');
            },500);
        }).click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });
    });
};

// linkage联动
Zui.prototype.linkage=d=>{
    // 分割select元素  获取数据
    const st=d.el.split(',');
    if(!$(st[0]).length) return; // 没找到一级select，返回

    const dt=d.data;

    // 接收selected索引，遍历data，对比索引输出数据
    const sc=(ii,x)=>{
        // 获取对应省份所有数据
        const c=dt[x[0]];
        // 遍历x数据索引
        st.forEach((n,i)=>{
            // 更新change事件之后的select
            if(i>ii){
                let dd=c[i];
                if(i>1)dd=dd[x[i-1]];
                let op='';
                dd.forEach((p,z)=>{
                    op+='<option value="'+p+'">'+p+'</option>';
                });
                $(n).html(op);
            };
        });
        if(d.call) d.call();
    };
    // change调用此函数，获取selected索引值，传给sc输出数据
    const cg=ii=>{
        let x=[];
        for(let i=0;i<st.length;i++){
            // 如果change的是一级，初始化其他的索引为0
            let dx;
            if(ii==0 && i==0 || ii!=0){
                dx=$(st[i]+' option:selected').index();
            }else{
                dx=0;
            };
            x.push(dx);
        };
        // 传个change的select索引，不更新上级，传下级数据索引
        sc(ii,x);
    };
    // select绑定change事件，并传元素索引，辨别触发的是第几个select
    st.forEach((n,i)=>{
        $(n).off().on('change',function(){
            cg(i);
        });
    });

    // 初始化输出一级option
    const t=()=>{
        let op='';
        dt.forEach(n=>{
            op+='<option value="'+n[0]+'">'+n[0]+'</option>';
        });
        $(st[0]).html(op);
        // 默认选择第一项
        cg(0);
    };
    t();
};

// 分页器
Zui.prototype.paging=dt=>{
    const el=$(dt.el);
    // 总页数/最后一页
    const last=Math.ceil(dt.amount/dt.divide);
    // 如果总页数=1,就隐藏掉分页器
    if(last==1) return el.hide();

    if(dt.show==undefined) dt.show=5;
    if(dt.prev==undefined) dt.prev='上一页';
    if(dt.first==undefined) dt.first='首页';
    if(dt.last==undefined) dt.last='尾页';
    if(dt.next==undefined) dt.next='下一页';

    const pg=(current)=>{
        let dom='';
        // 是否载入prev和first
        if(current!=1 && dt.prev!=''){
            dom+='<a class="prev" href="javascript:;">'+dt.prev+'</a>';
        };
        if(current!=1 && dt.first!='' && last>dt.show){
            dom+='<a class="first" href="javascript:;">'+dt.first+'</a>';
        };

        // 缩进值
        const rt=parseInt((dt.show-1)/2);

        // 循环开始条件值
        let st=1;
        if(current>rt) st=current-rt;
        if(current>last-rt) st=last-dt.show+1;

        // 生成分页按钮
        for(let i=st;i<st+dt.show;i++){
            // 如果超出总数退出循环
            if(i>last) return;
            // 如果是当前页
            if(i==current){
                dom+='<a class="active" href="javascript:;">'+i+'</a>';
            }else if(i>0){
                dom+='<a href="javascript:;">'+i+'</a>';
            };
        };

        // 是否载入last和next
        if(current!=last && dt.last!='' && last>dt.show){
            dom+='<a class="last" href="javascript:;">'+dt.last+'</a>';
        };
        if(current!=last && dt.next!=''){
            dom+='<a class="next" href="javascript:;">'+dt.next+'</a>';
        };
        el.html(dom);
    };
    pg(dt.current);

    // 切换事件
    $(document).on('click',dt.el+' a',function(){
        const c=$(this).attr('class');
        let index=0;
        if(c=='active') return;
        if(c==undefined){
            index=Number($(this).text());
        }else{
            index=Number($(this).siblings('.active').text());
        };
        // 功能按钮操作
        switch(c){
            case 'prev': index--;
                break;
            case 'next': index++;
                break;
            case 'first': index=1;
                break;
            case 'last': index=last;
                break;
        };
        // 防错拦截
        if(index<1||index>last) return;
        // 重置分页器
        pg(index);
        // 启动回调
        dt.callback(index);
    });
};

/*
2017-09-03
name：zui框架-表单校验模块
by：harvey
qq：269144551
官网：http://www.zjw7.com/
*/

Zui.prototype.validate=dt=>{
	// 非法名字
	const ne = ["妈", "爸", "爹", "爷", "姐", "哥", "瞧瞧", "你猜", "高富帅", "白富美", "屌丝", "先生", "女士", "小姐", "帅哥", "美女", "啊啊", "习近平", "习大大", "奥巴马", "马化腾", "毛泽东", "尼玛", "你", "我", "草", "泥", "痴", "狗", "猫", "喵", "蛋", "主任", "老师", "师傅", "医生", "教授", "老", "猪", "呵呵", "贱", "二", "三", "四", "五", "六", "七", "八", "九", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾", "佰", "仟", "傻"];
	// 百家姓数组
	const bjx = ["赵","钱","孙","李","周","吴","郑","王","冯","陈","褚","卫","蒋","沈","韩","杨","朱","秦","尤","许","何","吕","施","张","孔","曹","严","华","金","魏","陶","姜","戚","谢","邹","喻","柏","水","窦","章","云","苏","潘","葛","奚","范","彭","郎","鲁","韦","昌","马","苗","凤","花","方","俞","任","袁","柳","酆","鲍","史","唐","费","廉","岑","薛","雷","贺","倪","汤","滕","殷","罗","毕","郝","邬","安","常","乐","于","时","傅","皮","卞","齐","康","伍","余","元","卜","顾","孟","平","黄","和","穆","萧","尹","姚","邵","湛","汪","祁","毛","禹","狄","米","贝","明","臧","计","伏","成","戴","谈","宋","茅","庞","熊","纪","舒","屈","项","祝","董","梁","杜","阮","蓝","闵","席","季","麻","强","贾","路","娄","危","江","童","颜","郭","梅","盛","林","刁","锺","徐","邱","骆","高","夏","蔡","田","樊","胡","凌","霍","虞","万","支","柯","昝","管","卢","莫","经","房","裘","缪","干","解","应","宗","丁","宣","贲","邓","郁","单","杭","洪","包","诸","左","石","崔","吉","钮","龚","程","嵇","邢","滑","裴","陆","荣","翁","荀","羊","於","惠","甄","麴","家","封","芮","羿","储","靳","汲","邴","糜","松","井","段","富","巫","乌","焦","巴","弓","牧","隗","山","谷","车","侯","宓","蓬","全","郗","班","仰","秋","仲","伊","宫","宁","仇","栾","暴","甘","钭","历","戎","祖","武","符","刘","景","詹","束","龙","叶","幸","司","韶","郜","黎","蓟","溥","印","宿","白","怀","蒲","邰","从","鄂","索","咸","籍","赖","卓","蔺","屠","蒙","池","乔","阳","郁","胥","能","苍","双","闻","莘","党","翟","谭","贡","劳","逄","姬","申","扶","堵","冉","宰","郦","雍","却","璩","桑","桂","濮","牛","寿","通","边","扈","燕","冀","僪","浦","尚","农","温","别","庄","晏","柴","瞿","阎","充","慕","连","茹","习","宦","艾","鱼","容","向","古","易","慎","戈","廖","庾","终","暨","居","衡","步","都","耿","满","弘","匡","国","文","寇","广","禄","阙","东","欧","殳","沃","利","蔚","越","夔","隆","师","巩","厍","聂","晁","勾","敖","融","冷","訾","辛","阚","那","简","饶","空","曾","毋","沙","乜","养","鞠","须","丰","巢","关","蒯","相","查","后","荆","红","游","竺","权","逮","盍","益","桓","公","万俟","司马","上官","欧阳","夏侯","诸葛","闻人","东方","赫连","皇甫","尉迟","公羊","澹台","公冶","宗政","濮阳","淳于","单于","太叔","申屠","公孙","仲孙","轩辕","令狐","钟离","宇文","长孙","慕容","司徒","司空","召","有","舜","丛","岳","寸","贰","皇","侨","彤","竭","端","赫","实","甫","集","象","翠","狂","辟","典","良","函","芒","苦","其","京","中","夕","之","章佳","那拉","冠","宾","香","果","纳喇","乌雅","范姜","碧鲁","张廖","张简","图门","太史","公叔","乌孙","完颜","马佳","佟佳","富察","费莫","蹇","称","诺","来","多","繁","戊","朴","回","毓","税","荤","靖","绪","愈","硕","牢","买","但","巧","枚","撒","泰","秘","亥","绍","以","壬","森","斋","释","奕","姒","朋","求","羽","用","占","真","穰","翦","闾","漆","贵","代","贯","旁","崇","栋","告","休","褒","谏","锐","皋","闳","在","歧","禾","示","是","委","钊","频","嬴","呼","大","威","昂","律","冒","保","系","抄","定","化","莱","校","么","抗","祢","綦","悟","宏","功","庚","务","敏","捷","拱","兆","丑","丙","畅","苟","随","类","卯","俟","友","答","乙","允","甲","留","尾","佼","玄","乘","裔","延","植","环","矫","赛","昔","侍","度","旷","遇","偶","前","由","咎","塞","敛","受","泷","袭","衅","叔","圣","御","夫","仆","镇","藩","邸","府","掌","首","员","焉","戏","可","智","尔","凭","悉","进","笃","厚","仁","业","肇","资","合","仍","九","衷","哀","刑","俎","仵","圭","夷","徭","蛮","汗","孛","乾","帖","罕","洛","淦","洋","邶","郸","郯","邗","邛","剑","虢","隋","蒿","茆","菅","苌","树","桐","锁","钟","机","盘","铎","斛","玉","线","针","箕","庹","绳","磨","蒉","瓮","弭","刀","疏","牵","浑","恽","势","世","仝","同","蚁","止","戢","睢","冼","种","涂","肖","己","泣","潜","卷","脱","谬","蹉","赧","浮","顿","说","次","错","念","夙","斯","完","丹","表","聊","源","姓","吾","寻","展","出","不","户","闭","才","无","书","学","愚","本","性","雪","霜","烟","寒","少","字","桥","板","斐","独","千","诗","嘉","扬","善","揭","祈","析","赤","紫","青","柔","刚","奇","拜","佛","陀","弥","阿","素","长","僧","隐","仙","隽","宇","祭","酒","淡","塔","琦","闪","始","星","南","天","接","波","碧","速","禚","腾","潮","镜","似","澄","潭","謇","纵","渠","奈","风","春","濯","沐","茂","英","兰","檀","藤","枝","检","生","折","登","驹","骑","貊","虎","肥","鹿","雀","野","禽","飞","节","宜","鲜","粟","栗","豆","帛","官","布","衣","藏","宝","钞","银","门","盈","庆","喜","及","普","建","营","巨","望","希","道","载","声","漫","犁","力","贸","勤","革","改","兴","亓","睦","修","信","闽","北","守","坚","勇","汉","练","尉","士","旅","五","令","将","旗","军","行","奉","敬","恭","仪","母","堂","丘","义","礼","慈","孝","理","伦","卿","问","永","辉","位","让","尧","依","犹","介","承","市","所","苑","杞","剧","第","零","谌","招","续","达","忻","六","鄞","战","迟","候","宛","励","粘","萨","邝","覃","辜","初","楼","城","区","局","台","原","考","妫","纳","泉","老","清","德","卑","过","麦","曲","竹","百","福","言","第五","佟","爱","年","笪","谯","哈","墨","南宫","赏","伯","佴","佘","牟","商","西门","东门","左丘","梁丘","琴","后","况","亢","缑","帅","微生","羊舌","海","归","呼延","南门","东郭","百里","钦","鄢","汝","法","闫","楚","晋","谷梁","宰父","夹谷","拓跋","壤驷","乐正","漆雕","公西","巫马","端木","颛孙","子车","督","仉","司寇","亓官","鲜于","锺离","盖","逯","库","郏","逢","阴","薄","厉","稽","闾丘","公良","段干","开","光","操","瑞","眭","泥","运","摩","伟","铁","迮","付"];
    // 所有zui-rule元素
    const ipt=$(dt.form).find('[zui-rule]');
    // 获取zui-rule参数
	const getv=z=>{
		let ru={};
		const v=z.split(',');
		v.forEach(n=>{
			const r=n.split(':');
			switch(r[0]){
				case 'rule': ru.rule=r[1];
					break;
				case 'required': ru.required=true;
					break;
				case 'length':
					if(r[1].indexOf('~')!=-1){
						const t=r[1].split('~');
						ru.min=t[0];
						ru.max=t[1];
					}else{
						ru.leng=r[1];
					};
                    break;
                case 'interval':
					if(r[1].indexOf('~')!=-1){
						const t=r[1].split('~');
						ru.minval=t[0];
						ru.maxval=t[1];
					}else{
						ru.interval=r[1];
					};
					break;
				case 'title': ru.title=r[1];
					break;
                case 'point': ru.point=r[1];
                    if(r[1].indexOf('~')!=-1){
                        const t=r[1].split('~');
                        ru.point_min=t[0];
                        ru.point_max=t[1];
                    }else{
                        ru.point=r[1];
                    };
					break;
				case 'tip': ru.tip=r[1];
					break;
				case 'port': ru.port=r[1];
                    break;
                case 'contrast':
                    if(r[1].indexOf('~')!=-1){
                        const t=r[1].split('~');
                        ru.contrast=t[0];
                        ru.contrast_type=t[1];
                    }else{
                        ru.contrast=r[1];
                    };
					break;
			};
		});
		return ru;
	};
	// 公共校验
	const vd=(n,ru)=>{
        // 如果文本框为禁用状态,直接通过
        if(n.attr('disabled')) return verify.pass++;
        // 取值
		const v=n.val();
		// 非必选值为空，跳过
		if(v=='' && !ru.required) return verify.pass++;
		// 判断校验类别
		let vy;
		switch(ru.rule){
			case 'name':
				vy=verify.name;
				if(!ru.title) ru.title='姓名';
				if(ru.min==undefined) ru.min=2;
				if(ru.max==undefined) ru.max=6;
				break;
			case 'phone':
				vy=verify.phone;
				if(!ru.title) ru.title='手机号';
				ru.leng=11;
				break;
			case 'number':
				vy=verify.number;
				if(!ru.title) ru.title='数字';
				break;
			case 'email':
				vy=verify.email;
				if(!ru.title) ru.title='邮箱';
				break;
			case 'idcard':
				vy=verify.idcard;
				if(!ru.title) ru.title='身份证';
				ru.leng=18;
				break;
			case 'chinese':
				vy=verify.chinese;
				if(!ru.title) ru.title='内容';
				break;
			case 'checkbox':
				vy=verify.checkbox;
				if(!ru.title) ru.title='选项';
				break;
			case 'select':
				vy=verify.select;
				if(!ru.title) ru.title='下拉框';
                break;
            case 'account':
				vy=verify.account;
				if(!ru.title) ru.title='账号';
                break;
            case 'img':
				vy=verify.img;
				if(!ru.title) ru.title='图片';
				break;
			default: if(!ru.title) ru.title='';
        };
		// 如果是checkbox\select\img类型,直接去调用校验方法
		if(ru.rule=='checkbox' || ru.rule=='select' || ru.rule=='img'){
            return vy(n,ru);
        };
		// 公用校验规则
		// 必选为空
		if(v=='' && ru.required) return verify.error(n,ru,'不能为空！');
		// 是否为默认值
		if(dt.illegality){
			for(let i in dt.illegality){
				if(dt.illegality[i]==v) return verify.error(n,ru,'不能为默认值！');
			};
		};
        // 长度校验
        let leng=v.length;
        if(v.indexOf('.')>0) leng-=1; //包含小数点,长度-1
		if(ru.min!=undefined && leng<ru.min) return verify.error(n,ru,'长度不足！');
		if(ru.max!=undefined && leng>ru.max) return verify.error(n,ru,'长度超出！');
        if(ru.leng!=undefined && leng!=ru.leng) return verify.error(n,ru,'长度不正确！');
        // 对比,默认对比是否相同
        if(ru.contrast!=undefined){
            // 默认相同
            let contrast_type=true;
            if(ru.contrast_type=='false') contrast_type=false;
            const contrast=$(ru.contrast).val();
            // 判断是否相同或不同
            if(contrast!=v && contrast_type) return verify.error(n,ru,'不一致！');
            if(contrast==v && !contrast_type) return verify.error(n,ru,'不能一致！');
        };
        // 删除原有错误提示
        n.siblings('.zui-validate-error,.zui-validate-succee').remove();
        if(!vy && !ru.port) return verify.pass++;
		// 调用对应校验方法,return,防止执行下面的远程校验
		if(vy) if(vy(n,ru)===false) return;
        // 判断是否需要远程校验
        if(ru.port) if(verify.port(n,ru)===false) return verify.pass--;
	};
	// 验证大法
	const verify={
		pass:0,
		name:(n,ru)=>{
			const v=n.val();
			const reg = /^[\u4E00-\u9FA5]+$/;
			// 是否为中文
			if(!reg.test(v)) return verify.error(n,ru,'必须是中文！');
			// 非法姓名判断
			for(let i=0;i<ne.length;i++){
				if(v.indexOf(ne[i])>=0) return verify.error(n,ru,'不合法！');
			};
			// 百家姓判断
			if(bjx.indexOf(v.substr(0,1))!=-1||bjx.indexOf(v.substr(0,2))!=-1){
				return verify.pass++;
			}else{
				return verify.error(n,ru,'姓氏非百家姓！');
			};
        },
        chinese:(n,ru)=>{
			const v=n.val();
            const reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
            const reg2 = /^[\u4E00-\u9FA5]+$/;
            // 是否含符号
			if(reg.test(v)) return verify.error(n,ru,'不能包含符号！');
			// 是否为中文
            if(!reg2.test(v)) return verify.error(n,ru,'必须是中文！');
			return verify.pass++;
        },
        account:(n,ru)=>{
            const v=n.val();
            const reg = /^([a-z]|[A-Z])[0-9a-zA-Z_]+$/;
            if(!reg.test(v)) return verify.error(n,ru,'格式不正确！');
            return verify.pass++;
        },
		phone:(n,ru)=>{
			const v=n.val();
			const reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			if(isNaN(v)) return verify.error(n,ru,'无效！');
			if(!reg.test(v)) return verify.error(n,ru,'不正确！');
			return verify.pass++;
		},
		number:(n,ru)=>{
			const v=n.val();
			// 是否为有效数字
			if(isNaN(v)) return verify.error(n,ru,'无效！');
			// 是否为正数
            if(v<0) return verify.error(n,ru,'不能为负数！');
			// 小数点位数判断
			if(ru.point) if(v.indexOf('.')==-1 || v.split('.')[1].length!=ru.point) return verify.error(n,ru,'请保留位'+ru.point+'小数！');
            // 数值区间判断
            if(ru.minval!=undefined && v<ru.minval) return verify.error(n,ru,'不能小于'+ru.minval+'！');
            if(ru.maxval!=undefined && v>ru.maxval) return verify.error(n,ru,'不能大于'+ru.maxval+'！');
            if(ru.interval!=undefined && v!=ru.interval) return verify.error(n,ru,'必须等于'+ru.interval+'！');
            return verify.pass++;
		},
		email:(n,ru)=>{
			const v=n.val();
			// 规则校验
			const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!reg.test(v)){
				return verify.error(n,ru,'无效！');
			};
			return verify.pass++;
		},
		idcard:(n,ru)=>{
			const v=n.val();
			// 小写x转大写
			if(v.substring(17)=='x') v=v.substring(0,17)+'X';

			//身份证省的编码 
			const idcity={ 
				11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
				21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏", 
				33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南", 
				42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆", 
				51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃", 
				63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外" 
			};
			//取身份证前两位,校验省份 
			if(!idcity[v.substr(0,2)]) return verify.error(n,ru,'省份不正确！');
			
			// 校验出生日期
			const oy=v.substr(6,4) + '/' + v.substr(10,2) + '/'+v.substr(12,2);
			const oday = new Date(oy);
			const now_year = new Date().getFullYear();
			let om=(oday.getMonth()+1);
			let od=oday.getDate();
			if(om<10) om='0'+om;
			if(od<10) od='0'+od;
			if(oy!=oday.getFullYear() + '/' + om + '/' + od) return verify.error(n,ru,'日期不正确！');
			//判断年份的范围（1岁到120岁之间)
			const tm = now_year - oday.getFullYear(); 
			if(tm < 1 || tm > 120) return verify.error(n,ru,'出生年份不正确！');

			// 最后一位校验码
			const arr_i = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; 
			const arr_c = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
			let ct = 0;
			for(let i = 0; i < 17; i ++){ 
				ct += v.substr(i, 1) * arr_i[i];
			};
			const vn = arr_c[ct % 11]; 
			if(vn != v.substr(17, 1)) return verify.error(n,ru,'号码不正确！');
			return verify.pass++;
		},
		checkbox:(n,ru)=>{
			const leng=n.find(':checked').length;
            // 必选判断
            if(leng==0 && ru.required) return verify.error(n,ru,'必须选择！');
            // 选择数量判断
            if(ru.min!=undefined && leng<ru.min) return verify.error(n,ru,'选项不足'+ru.min+'个！');
            if(ru.max!=undefined && leng>ru.max) return verify.error(n,ru,'选项超出'+ru.max+'个！');
            if(ru.leng!=undefined && leng!=ru.leng) return verify.error(n,ru,'选项必须为'+ru.leng+'个！');
			n.siblings('.zui-validate-error,.zui-validate-succee').remove();
			return verify.pass++;
		},
		select:(n,ru)=>{
			const v=n.find(':selected').text();
			// 必选判断
			if(!ru.required) return verify.pass++;
			// 判断是否非法值
			if(dt.illegality){
				for(let i in dt.illegality){
					if(dt.illegality[i]==v) return verify.error(n,ru,'不能选默认项！');
				};
			};
			n.siblings('.zui-validate-error,.zui-validate-succee').remove();
			return verify.pass++;
        },
        img:(n,ru)=>{
            const leng=n.find('img').length;
            // 图片数量判断
            if(ru.min!=undefined && leng<ru.min) return verify.error(n,ru,'不足'+ru.min+'张！');
            if(ru.max!=undefined && leng>ru.max) return verify.error(n,ru,'超出'+ru.max+'张！');
            if(ru.leng!=undefined && leng!=ru.leng) return verify.error(n,ru,'必须为'+ru.leng+'张！');
            n.siblings('.zui-validate-error,.zui-validate-succee').remove();
            return verify.pass++;
        },
        port:(n,ru)=>{
            const v=n.val();
            let pt='';
			const pp=ru.port.split(']');
			const pd=[];
			pp.forEach(nn=>{
				pd.push(nn.substring(1,nn.length));
			});
			$.ajax({
				type:pd[0],
				url: pd[1],
				data: pd[2]+'='+v+'&'+pd[3], //key=value & key=value&
				async:false, //同步进行
				success:function(data){
					return pt=data;
				},
				error:function(){
					return pt='ajax_error';
				}
            });
            // 判断ajax校验结果
            if(pt!=''){
                if(pt=='ajax_error'){
                    return verify.error(n,ru,'校验时服务器异常！');
                }else if(pt=='success'){
                    // 成功提示
                    return verify.error(n,ru,v+'可以使用！',true);
                }else{
                    return verify.error(n,ru,v+'不能使用！');
                };
            };
        },
		error:(n,ru,info,status)=>{
            // 提示信息
			let tip='';
			if(ru.tip){
				tip=ru.tip;
			}else{
				tip=ru.title+info;
            };
            // 获取样式配置
			let pt='bottom';
			if(dt.position) pt=dt.position;
			// 渲染
			const $pt=n.parent();
            if($pt.css('position')=='static') $pt.css('position','relative');
            n.siblings('.zui-validate-error,.zui-validate-succee').remove();
            let ty='error';
            if(status) ty='succee';
            $pt.append('<div class="zui-validate-'+ty+' zui-validate-'+pt+'">'+tip+'</div>');
            if(status){
                // 成功
                return true;
            }else{
                // 错误
                return false;
            };
        }
	};
    // 判断是否绑定blur事件
	if(dt.blur!=false){ 
        $(document).on('blur',dt.form+' [zui-rule]',function(){
            // 只读的输入框和select元素,blur时不校验,防止zui-select等元素校验时机错误
            if($(this).attr('readonly') || $(this).prop("tagName")=='SELECT') return;
            // 获取配置
            let ru=getv($(this).attr('zui-rule')); 
            // 调用公共校验
            vd($(this),ru);
        });
    };

	// 提交按钮，触发所有blur事件，再判断验证是否全部通过
	$(dt.submit).click(()=>{
		// 启动所绑表单所有ipt的blur事件，再次校验全部ipt
		verify.pass=0;
        ipt.each(function(){
            // 获取配置
            let ru=getv($(this).attr('zui-rule'));
            // 开启校验
            vd($(this),ru);

            if($(this).attr('readonly') || $(this).prop("tagName")=='SELECT'){
                // 绑定change后删除错误提示
                $(this).one('mouseup',function(){
                    $(this).siblings('.zui-validate-error,.zui-validate-succee').remove();
                });
            };
        });
        console.log('需要校验:'+ipt.length+'个元素，通过'+verify.pass+'个');
        // 比对需要校验的元素数量与通过数量是否一致
		if(verify.pass==ipt.length && verify.pass!=0){
			// 校验通关，执行函数
			dt.succee();
		};
	});
};


// 实例化Zui
const zui=new Zui();


// 轮播方法
//     zui.imgfocus({
//         main:'.zui-imglayer', //父标签
//         item:'.zui-imglayer-main li', //轮播体
//         index:dt.index,  //默认焦点，可选，不填为0
//         autoplay:true, //是否自动播放，可选，不填为false
//         palytime:3000,  //播放间隔时间，默认为3000
//         loop:true  //是否循环，可选，不填为true
//     });
