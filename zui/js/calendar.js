
jQuery.fn.extend({
    calendar: function(c) {
        // 初始化
        c.upper=c.upper||NaN;
        c.lower=c.lower||NaN;
        c.wrap=c.wrap||'body';

        let $n = $(this);
        
        // 开启选择器
        let today = new Date;
        let e = today.getFullYear();
        let f = today.getMonth();
        let q = today.getDate();
        let that;
        function cd(n){
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
            $(c.wrap).append(that);

            // 计算出现位置，是否超出可视范围
            let t=()=>{
                return n.offset().top + n.innerHeight()-$(c.wrap).offset().top+5;
            }
            let l=()=>{
                return n.offset().left-$(c.wrap).offset().left;
            };

            // 出现位置
            that.css({
                'top': t(),
                'left': l()
            });

            bindDay();
            mp();
        };
        
        // 绑定日期选择
        function bindDay(){
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
                a = a.getFullYear() + "-" + (Number(a.getMonth() + 1) < 10 ? "0" + Number(a.getMonth() + 1) : Number(a.getMonth() + 1)) + "-" + (Number(d) < 10 ? "0" + d: d);
                $n.val(a);
                $(".zui-calendar table a").removeClass("select");
                // 给已选日期加标记
                $(".zui-caltab-day a:contains('" + d + "')").each(function() {
                    d == $(this).text() && !$(this).hasClass("prevD") && !$(this).hasClass("nextD") && $(this).addClass("select");
                });
                that.remove();
                // 执行回调函数
                if(c.callback) c.callback();
                return false;
            });
        };
        
        // 绑定月份选择
        function bindMonth() {
            that.find(".zui-caltab-month a").mouseup(function() {
                let a = setD(Number(that.find(".currentYear").text()), Number($(this).attr("val")));
                that.find(".currentMonth").text(Number($(this).attr("val")) + 1);
                anim('close',a);
                bindDay();
            });
        };
        // 选择年份选择
        function bindYear() {
            that.find(".zui-caltab-year a").mouseup(function() {
                let a = setD(Number($(this).text()), Number(that.find(".currentMonth").text()) - 1);
                that.find(".currentYear").text(Number($(this).text()));
                anim('close',a);
                bindDay();
            });
        };
        // 生成日期天数
        function setD(a, b) {
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
        function setM(a){
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
        function setY(a) {
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
        function anim(s,d,m){
            let reserve=that.find(".zui-calendar-reserve");
            let enabled=that.find(".zui-calendar-enabled");
            if(s=='open'){
                reserve.html(d);
                reserve.css('top',36);
            }else if(s=='close'){
                reserve.empty();
                reserve.css('top','-100%');
            }else{
                if(m){
                    reserve.html(d);
                }else{
                    enabled.html(d);
                }
                
            };
        };
     
        function w() {
            let re = /(\d\d\d\d)(\W)?(\d\d)(\W)?(\d\d)/g;
            let a = $n.val();
            a = a.replace(re, "$1/$3/$5@").split("@")[0];
            return new Date(a);
        };
        function F(a) {
            let b = [];
            b.x = a.offsetLeft;
            for (b.y = a.offsetTop; a = a.offsetParent;) {
                b.x += a.offsetLeft;
                b.y += a.offsetTop
            };
            return b;
        };
        
        function mp(){
            that.find(".zui-prev-month").mouseup(function() {
                if ($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                    d = setM(Number($('.zui-calendar').find(".currentYear").text()) - 1);
                    anim('prev',d,true);
                    bindMonth();
                    $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 1)
                } else if ($('.zui-calendar').find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                    d = setY(Number($('.zui-calendar').find(".currentYear").text()) - 10);
                    anim('prev',d,true);
                    bindYear();
                    $('.zui-calendar').find(".currentYear").text(Number($('.zui-calendar').find(".currentYear").text()) - 10)
                }else if ($('.zui-calendar').find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                    let a = $('.zui-calendar').find(".currentYear"),
                    b = $('.zui-calendar').find(".currentMonth"),
                    d = setD(Number(a.text()), Number(b.text()) - 2);
                    anim('prev',d);
                    if (Number(b.text()) != 1) b.text(Number(b.text()) - 1);
                    else {
                        a.text(Number(a.text()) - 1);
                        b.text("12");
                    }
                    bindDay();
                };
                return false;
            });
            that.find(".zui-next-month").mouseup(function() {
                if (that.find(".zui-calendar-reserve > .zui-caltab-month").length > 0) {
                    d = setM(Number(that.find(".currentYear").text()) + 1);
                    anim('next',d,true);
                    bindMonth();
                    that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 1)
                } else if (that.find(".zui-calendar-reserve > .zui-caltab-year").length > 0) {
                    d = setY(Number(that.find(".currentYear").text()) + 10);
                    anim('next',d,true);
                    bindYear();
                    that.find(".currentYear").text(Number(that.find(".currentYear").text()) + 10)
                }else if (that.find(".zui-calendar-enabled > .zui-caltab-day").length > 0) {
                    let a = that.find(".currentYear"),
                    b = that.find(".currentMonth"),
                    d = setD(Number(a.text()), Number(b.text()));
                    anim('next',d);
                    if (Number(b.text()) != 12) b.text(Number(b.text()) + 1);
                    else {
                        a.text(Number(a.text()) + 1);
                        b.text("1");
                    }
                    bindDay();
                };
                return false;
            });
            that.find(".zui-month-txt").mouseup(function() {
                let a = setM(Number(that.find(".currentYear").text()));
                anim('open',a);
                bindMonth();
                return false;
            });
            that.find(".zui-year-txt").mouseup(function() {
                let a = setY(Number(that.find(".currentYear").text()));
                anim('open',a);
                bindYear();
                return false;
            });
        };

        // zui-date绑定
        $n.on("click",function() {
            cd($(this));
        });

        // 点击外部隐藏
        $(document).mouseup(function(e){
            if($(e.target).attr("class") != $n.attr("class") && $(e.target).parents('.zui-calendar').length==0){
                that.remove();
            };
        });
    }
});