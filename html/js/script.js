// zui开发文档页面
// harvey
// QQ:269144551

"use strict";
// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?2fef5d4b271a913ed2e378ae1a45aadf";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

$(function(){

    let tag={
        // 页面名称储存
        page:[
            ['introduction','standard','commonality'],
            ['color','zui-icon','zui-nav','zui-btn','zui-ipt','zui-select','zui-form','zui-table','zui-list','zui-tab','zui-fold','zui-tree','zui-page','zui-row','element'],
            ['loading','progress','prompts','message','layer','date','imgview','imglayer','imgfocus','uploadimg','precode']
        ],
        ld:d=>{
            // 加载页面
            $('.main').load('page/'+tag.page[d[0]][d[1]]+'.html',()=>{
                // 加载完回调
                localStorage.url=d;
                $('.wrapper').animate({scrollTop:0},0);
                zui.init();
                $('.nav a').removeClass('on');
                $('dl').eq(d[0]).find('a').eq(d[1]).addClass('on');
            });
        },
    };
    if(localStorage.url){
        // 加载本地索引
        tag.ld(localStorage.url.split(','));
    }else{
        // 加载快速上手
        tag.ld([0,0]);
    };
    // 切换内容
    $('.nav a').click(function(){
        // 列表索引
        let x=$(this).parent().parent().index();
        // 按钮的索引
        let i=$(this).parent().index()-1;
        // 加载页面
        tag.ld([x,i]);
    });
    






});