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
        if(c.times!='true') return;
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

// 弹出查看图片方法