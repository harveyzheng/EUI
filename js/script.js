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

    // 切换内容
    $('.nav a').click(function(){
        // 列表索引
        let x=$(this).parent().parent().index();
        // 按钮的索引
        let i=$(this).parent().index()-1;
        // 页面名称
        let pg=page[x][i];
        // 开启loading

        // 加载页面
        $('.main').load('page/'+pg+'.html',()=>{
            // 加载完回调
            $('.wrapper').animate({scrollTop:0},0);
            // 关闭loading
        });
    });






});