// zui开发文档页面
// harvey
// QQ:269144551

$(function(){

    // 页面名称储存
    let page=[
        ['introduction','standard','commonality'],
        ['color','zui-icon','zui-nav','zui-btn','zui-ipt','zui-radio','zui-checkbox','zui-select','zui-form','zui-table','zui-list','zui-tab','zui-fold','zui-tree','zui-page','zui-row','element'],
        ['loading','progress','prompts','message','layer','date','imgview','imglayer','imgfocus','uploadimg','precode']
    ];

    // 
    let ld=d=>{
        // 加载页面
        $('.main').load('page/'+d[0]+'.html',()=>{
            // 加载完回调
            localStorage.url=d;
            $('.wrapper').animate({scrollTop:0},0);
            zui.init();
            $('.nav a').removeClass('on');
            $('dl').eq(d[1]).find('a').eq(d[2]).addClass('on');
        });
    };
    if(localStorage.url) ld(localStorage.url.split(','));

    // 切换内容
    $('.nav a').click(function(){
        // 列表索引
        let x=$(this).parent().parent().index();
        // 按钮的索引
        let i=$(this).parent().index()-1;
        // 页面名称
        let pg=page[x][i];
        // 加载页面
        ld([pg,x,i]);
    });
    






});