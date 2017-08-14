
jQuery.fn.extend({
    calendar: function(c) {
        // 初始化
        c.upper=c.upper||NaN;
        c.lower=c.lower||NaN;
        c.format=c.format||'';

        let $n = $(this);

        // 开启选择器
        let today,e,f,q,that;
        let cd=n=>{
            if(!$n.val()==''){
                today = new Date($n.val());
            }else{
                today = new Date();
            }
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
            let t=()=>{
                return n.innerHeight()+5;
            };

            // 出现位置
            that.css({
                'top': t(),
            });

            // 加载时分秒选择功能
            hns(c.format);

            // 绑定选择日期
            bindDay();
            // 绑定操作
            mp();
        };

        // 最终输出的时间
        let ttt='';
        let hhh=' 00:00:00';

        // 时分秒
        let hns=d=>{
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
            t+=        '<span class="zui-calendar-times-con"><input id="zui-range-hh" type="range" min="00" max="24" step="1" value="'+sp[0]+'"></span>';
            t+=    '</div>';
            t+=    '<div class="zui-calendar-times-item">';
            t+=        '<span class="zui-calendar-times-title">分钟</span>';
            t+=        '<span class="zui-calendar-times-con"><input id="zui-range-nn" type="range" min="00" max="60" step="1" value="'+sp[1]+'"></span>';
            t+=    '</div>';
            t+=    '<div class="zui-calendar-times-item">';
            t+=        '<span class="zui-calendar-times-title">秒钟</span>';
            t+=        '<span class="zui-calendar-times-con"><input id="zui-range-ss" type="range" min="00" max="60" step="1" value="'+sp[2]+'"></span>';
            t+=    '</div>';
            t+='</div>';

            let $dom=$(t);
            that.find('.zui-calendar-main-con').append($dom);

            let h=$dom.find('#zui-range-hh');
            let n=$dom.find('#zui-range-nn');
            let s=$dom.find('#zui-range-ss');

            // 鼠标拖动滑块
            $dom.find('input[type="range"]').mousedown(function(){
                $(this).on('mousemove change',function(e){
                    let v=$(this).val();
                    if(v.length==1) v='0'+v;
                    let m;
                    let id=$(this).attr('id');
                    if(id=='zui-range-hh'){
                        m='#zui-calendar-times-show-hh';
                    }else if(id=='zui-range-nn'){
                        m='#zui-calendar-times-show-nn';
                    }else{
                        m='#zui-calendar-times-show-ss';
                    };
                    m=$dom.find(m);
                    // 动态显示值
                    m.addClass('on').text(v);
                    // 输出
                    if(e.type=='change') f();
                });
            });
            // 鼠标放开滑块
            $dom.find('input[type="range"]').on('mouseup',function(){
                $(this).off('mousemove');
                // 输出
                f();
            });
            // 输出hhh数据
            let f=()=>{
                // 添加时分秒数据
                hhh=' ';
                $dom.find('.zui-calendar-times-show i').each((i,n)=>{
                    hhh+=$(n).text();
                    if($dom.find('.zui-calendar-times-show i').length!=i+1) hhh+=':';
                });
                $dom.find('.on').removeClass('on');
                $n.val(ttt+hhh);
            }
        };

        // 绑定日期选择
        let bindDay=()=>{
            that.find(".zui-caltab-day a").mouseup(function(){
                let a = new Date(that.find(".currentYear").text() + "/" + that.find(".currentMonth").text() + "/1");
                let d = $(this).text();
                if ($(this).hasClass("prevD")) {
                    // 如果选择上个月的天数
                    a.setMonth(a.getMonth() - 1);
                    a.setDate(d);
                    that.find(".zui-prev-month").triggerHandler("mouseup");
                } else if ($(this).hasClass("nextD")) {
                    // 如果选择下个月的天数
                    a.setMonth(a.getMonth() + 1);
                    a.setDate(d);
                    that.find(".zui-next-month").triggerHandler("mouseup");
                };
                // 输出日期
                ttt = a.getFullYear() + "-" + (Number(a.getMonth() + 1) < 10 ? "0" + Number(a.getMonth() + 1) : Number(a.getMonth() + 1)) + "-" + (Number(d) < 10 ? "0" + d: d);

                $(".zui-calendar table a").removeClass("select");
                // 给已选日期加标记
                $(".zui-caltab-day a:contains('" + d + "')").each(function() {
                    d == $(this).text() && !$(this).hasClass("prevD") && !$(this).hasClass("nextD") && $(this).addClass("select");
                });

                if(c.format.indexOf('hh')<0 && c.format.indexOf('nn')<0 && c.format.indexOf('ss')<0){
                    $n.val(ttt);
                    that.remove();
                }else{
                    $n.val(ttt+hhh);
                };
                return false;
            });
        };
        
        // 绑定月份选择
        let bindMonth=()=>{
            that.find(".zui-caltab-month a").mouseup(function() {
                let a = setD(Number(that.find(".currentYear").text()), Number($(this).attr("val")));
                that.find(".currentMonth").text(Number($(this).attr("val")) + 1);
                update('close',a);
                bindDay();
            });
        };
        // 选择年份选择
        let bindYear=()=>{
            that.find(".zui-caltab-year a").mouseup(function() {
                let a = setD(Number($(this).text()), Number(that.find(".currentMonth").text()) - 1);
                that.find(".currentYear").text(Number($(this).text()));
                update('close',a);
                bindDay();
            });
        };
        // 生成日期天数
        let setD=(a, b)=>{
            let newDate = new Date(a, b, 1);
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
            g = "<table class='zui-caltab-day'>";
            g += "<tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr>";
            let i = w(),
            l = "",
            p = "",
            t = "";
            let xx=5;
            if(m>4&&o>30) xx=6;
            for (let x = 0; x < xx; x++) {
                g += "<tr>";
                for (let y = 0; y < 7; y++) {
                    let j = x * 7 + y + 1 - m;
                    p = l = "";
                    if (c.lower != NaN && c.lower > new Date(newDate.getFullYear(), newDate.getMonth(), j) || c.upper != NaN && new Date(newDate.getFullYear(), newDate.getMonth(), j) > c.upper) if (0 < j && j <= o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                        g += "<td><span class='" + l + "'>" + j + "</span></td>"
                    } else if (j <= 0) {
                        if (newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                        g += "<td><span class='" + l + "' " + t + ">" + h + "</span></td>";
                        h++
                    } else {
                        if (j > o) {
                            if (newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                            g += "<td><span class='" + l + "' " + t + ">" + d + "</span></td>";
                            d++
                        }
                    } else if (0 < j && j <= o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() == f && j == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() == i.getMonth() && j == i.getDate()) p = "select";
                        g += "<td><a class='" + p + " " + l + "'>" + j + "</a></td>"
                    } else if (j <= 0) {
                        if (newDate.getFullYear() == e && newDate.getMonth() - 1 == f && h == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() - 1 == i.getMonth() && h == i.getDate()) p = "select";
                        g += "<td><a class='prevD " + p + " " + l + "' " + t + ">" + h + "</a></td>";
                        h++
                    } else if (j > o) {
                        if (newDate.getFullYear() == e && newDate.getMonth() + 1 == f && d == q) l = "current";
                        if (newDate.getFullYear() == i.getFullYear() && newDate.getMonth() + 1 == i.getMonth() && d == i.getDate()) p = "select";
                        g += "<td><a class='nextD " + p + " " + l + "' " + t + ">" + d + "</a></td>";
                        d++;
                    }
                    g = g.replace("class=' '", "");
                }
                g += "</tr>"
            }
            g += "</table>";
            return g;
        };
        // 生成月份
        let setM=a=>{
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
            return d
        };
        // 生成年份
        let setY=a=>{
            a = Math.floor(a / 10) * 10;
            let b = "<table class='zui-caltab-year'>",
            d = w(),
            h = "",
            m = "",
            o = "";
            for (let g = 0; g < 3; g++) {
                b += "<tr>";
                for (let i = 0; i < 4; i++) {
                    m = h = "";
                    if (g + 1 * i + 1 != 1 && (g + 1) * (i + 1) != 12) {
                        if (a == d.getFullYear()) h = "select";
                        if (a == e) m = "current";
                        b += "<td><a class='" + h + " " + m + "' >" + a + "</a></td>";
                        a++
                    } else if (g + 1 * i + 1 == 1) {
                        if (a - 1 == d.getFullYear()) h = "select";
                        if (a - 1 == e) m = "current";
                        b += "<td><a class='prevY " + h + " " + m + "' " + o + ">" + (a - 1) + "</a></td>"
                    } else {
                        if (a == d.getFullYear()) h = "select";
                        if (a == e) m = "current";
                        b += "<td><a class='nextY " + h + " " + m + "' " + o + ">" + a + "</a></td>"
                    }
                }
                b += "</tr>"
            }
            b += "</table>";
            return b;
        };
        
        // 切换
        let update=(s,d,m)=>{
            let reserve=that.find(".zui-calendar-reserve");
            let enabled=that.find(".zui-calendar-enabled");
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
                }
            };
        };
     
        // 格式化日期
        let w=()=>{
            let re = /(\d\d\d\d)(\W)?(\d\d)(\W)?(\d\d)/g;
            let a = $n.val();
            a = a.replace(re, "$1/$3/$5@").split("@")[0];
            return new Date(a);
        };
        
        // 操作绑定
        let mp=()=>{
            that.find(".zui-prev-month").mouseup(()=>{
                if ($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                    d = setM(Number($('.zui-calendar').find(".currentYear").text()) - 1);
                    update('prev',d,true);
                    bindMonth();
                    $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 1)
                } else if ($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                    d = setY(Number($('.zui-calendar').find(".currentYear").text()) - 10);
                    update('prev',d,true);
                    bindYear();
                    $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 10)
                }else if ($('.zui-calendar').find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                    let a = $('.zui-calendar').find(".currentYear"),
                    b = $('.zui-calendar').find(".currentMonth"),
                    d = setD(Number(a.text()), Number(b.text()) - 2);
                    update('prev',d);
                    if (Number(b.text()) != 1) b.text(Number(b.text()) - 1);
                    else {
                        a.text(Number(a.text()) - 1);
                        b.text("12");
                    }
                    bindDay();
                };
                return false;
            });
            that.find(".zui-next-month").mouseup(()=>{
                if (that.find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                    d = setM(Number(that.find(".currentYear").text()) + 1);
                    update('next',d,true);
                    bindMonth();
                    that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 1)
                } else if (that.find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                    d = setY(Number(that.find(".currentYear").text()) + 10);
                    update('next',d,true);
                    bindYear();
                    that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 10)
                }else if (that.find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                    let a = that.find(".currentYear"),
                    b = that.find(".currentMonth"),
                    d = setD(Number(a.text()), Number(b.text()));
                    update('next',d);
                    if (Number(b.text()) != 12) b.text(Number(b.text()) + 1);
                    else {
                        a.text(Number(a.text()) + 1);
                        b.text("1");
                    }
                    bindDay();
                };
                return false;
            });
            that.find(".zui-month-txt").mouseup(()=>{
                let a = setM(Number(that.find(".currentYear").text()));
                update('open',a);
                bindMonth();
                return false;
            });
            that.find(".zui-year-txt").mouseup(()=>{
                let a = setY(Number(that.find(".currentYear").text()));
                update('open',a);
                bindYear();
                return false;
            });
        };

        // zui-date绑定
        $n.on("click",function(){
            cd($(this));
            // 点击外部隐藏
            $(document).mouseup(e=>{
                if($(e.target).attr("class") != $n.attr("class") && $(e.target).parents('.zui-calendar').length==0&&$(e.target).parents('.zui-caltab-year,.zui-caltab-month').length==0){
                    that.remove();
                };
            });
        });
    }
});