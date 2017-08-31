// zui开发文档页面
// harvey
// QQ:269144551

"use strict";
// 百度统计
var _hmt = _hmt || [];
(function() {
    const hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?2fef5d4b271a913ed2e378ae1a45aadf";
    const s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
})();

$(function(){
    // 获取url page参数
    const getpage=(k)=>{
         const reg = new RegExp("(^|&)"+ k +"=([^&]*)(&|$)");
         const v = window.location.search.substr(1).match(reg);
         if(v!=null){
             return unescape(v[2])
        }else{
            history.pushState({},'快速入门','index.html?page=introduction');
        };
         return 'introduction';
    };
    // 加载页面
    const ld=pg=>{
        $('.main').load('page/'+pg+'.html',()=>{
            // 加载完回调
            $('.wrapper').animate({scrollTop:0},0);
            nav(pg);
        });
    };
    // 给nav对应的a标签添加on
    const nav=s=>{
        $('.nav a').removeClass('on');
        const st=[
            ['introduction','standard','commonality'],
            ['color','zui-icon','zui-nav','zui-btn','zui-ipt','zui-select','zui-form','zui-table','zui-list','zui-tab','zui-fold','zui-tree','zui-page','zui-row','element'],
            ['loading','progress','prompts','message','layer','date','imgview','imglayer','imgfocus','uploadimg','precode']
        ];
        st.forEach((n,i)=>{
            n.forEach((nn,ii)=>{
                if(s==nn) $('.nav dl').eq(i).find('a').eq(ii).addClass('on');
            });
        });
    };
    ld(getpage('page'));
    // 切换页面
    $('.nav a').click(function(e){
        e.preventDefault();
        console.log($(this).text())
        history.replaceState(null,$(this).text(),$(this).attr('href'));
        ld(getpage('page'));
    });
});