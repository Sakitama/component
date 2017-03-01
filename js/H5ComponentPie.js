// 饼图组件对象
var H5ComponentPie = function (name, cfg) {
    var component,
        w,
        h,
        cns,
        ctx,
        r,
        i,
        step,
        sAngel,
        eAngel,
        perText,
        x,
        y,
        text;

    component = H5ComponentBase(name, cfg);
    w = cfg.width;
    h = cfg.height;
    r = w / 2; // 圆心坐标
    step = cfg.data.length; // 项目个数

    /**
     * 添加canvas
     * @param w
     * @param h
     * @returns {*}
     */
    function addCanvas(w, h) {
        var cns = document.createElement("canvas");
        cns.width = w;
        cns.height = h;
        return cns;
    }

    /**
     * 获取随机十六进制颜色
     * @returns {string}
     */
    function getRandomColor() {
        return  '#' + (function (color) {
            return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)]) && (color.length === 6) ?  color : arguments.callee(color);
        })('');
    }

    // 第一个canvas，用于绘制底图层
    cns = addCanvas(w, h);
    ctx = cns.getContext("2d");
    component.append(cns);

    ctx.beginPath();
    ctx.fillStyle = "#eee";
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();

    // 第二个canvas，用于绘制数据层
    cns = addCanvas(w, h);
    ctx = cns.getContext("2d");
    component.append(cns);

    sAngel = 1.5 * Math.PI;
    for (i = 0; i < step; i++) {
        eAngel = sAngel + Math.PI * 2 * cfg.data[i][1];
        ctx.beginPath();
        ctx.fillStyle = getRandomColor();
        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngel, eAngel);
        ctx.fill();
        sAngel = eAngel;

        // 添加项目名称
        text = $("<div class='text'>");
        text.text(cfg.data[i][0]);
        perText = $("<div class='per'>");
        perText.text(cfg.data[i][1] * 100 + "%");
        text.append(perText);
        x = r + Math.sin(.5 * Math.PI - sAngel) * r;
        y = r + Math.cos(.5 * Math.PI - sAngel) * r;
        if (x > w / 2) {
            text.css("left", x / 2 + 5); //加5是为了让文本离饼图更远
        } else {
            text.css("right", (w - x) / 2 + 5);
        }
        if (y > h / 2) {
            text.css("top", y / 2 + 5);
        } else {
            text.css("bottom", (h - y) / 2 + 5);
        }
        if (cfg.data[i][2]) {
            text.css("color", cfg.data[i][2]);
        }
        text.css("transition", "all 1s " + (2 + i * 0.2) + "s");
        component.append(text);
    }

    // 第三个canvas，用于绘制遮罩层
    cns = addCanvas(w, h);
    ctx = cns.getContext("2d");
    component.append(cns);

    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.fillStyle = "#eee";
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();

    sAngel = 1.5 * Math.PI; // 由于环图到不了2PI，所以这里为了环图进行修正

    // 消除遮罩层动画
    function draw(per) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(r, r);
        if (per <= 0) { // leave的情况下per的值会负溢出，此时直接进行覆盖
            ctx.arc(r, r, r, 0, 2 * Math.PI);
        } else {
            ctx.arc(r, r, r, sAngel, sAngel + 2 * Math.PI * per, true);
        }
        ctx.closePath();
        ctx.fill();
    }

    component.on("onLoad", function () {
        var s,
            i;

        s = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s += .01;
                draw(s);
            }, i * 10 + 700);
        }
    });

    component.on("onLeave", function () {
        var s,
            i;

        s = 1;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= .01;
                draw(s);
            }, i * 10);
        }
    });

    return component;
};