// 雷达图组件对象
var H5ComponentRadar = function (name, cfg) {
    var component,
        w,
        h,
        cns,
        ctx,
        r,
        i,
        step,
        isBlue,
        pointCoordinate,
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
     * 计算坐标点
     * @param rad
     * @param radius
     * @returns {*[]}
     */
    function getPointCoordinate(rad, radius) {
        var x,
            y;
        x = r + Math.sin(rad) * radius;
        y = r + Math.cos(rad) * radius;
        return [x, y];
    }

    /**
     * 计算一圈坐标点
     * @param radius
     * @param rad
     * @returns {Array}
     */
    function calculateCirclePointCoordinate(step, radius) {
        var i,
            x,
            y,
            rad,
            point;
        point = [];
        // 计算多边形的顶点坐标
        // 已知：圆心坐标(a. b)和半径r
        // rad = (2 * Math.PI / 360) * (360 / 项目个数)
        // x = a + Math.sin(rad) * r;
        // y = b + Math.cos(rad) * r;
        for (i = 0; i < step; i++) {
            rad = (2 * Math.PI / 360) * (360 / step) * i;
            point.push(getPointCoordinate(rad, radius));
        }
        return point;
    }

    /**
     * 绘制放射图
     * @param radius
     * @param color
     */
    function drawMap(ctx, radius) {
        var i,
            temp;
        ctx.beginPath();
        temp = calculateCirclePointCoordinate(step, radius);
        for (i = 0; i < temp.length; i++) {
            ctx.lineTo(temp[i][0], temp[i][1]); // 第一个lineTo相当于moveTo
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     * 绘制数据
     * @param ctx
     * @param step
     * @param per
     */
    function draw(ctx, step, per) {
        // 清除画布
        ctx.clearRect(0, 0, w, h);

        var i,
            temp;

        ctx.strokeStyle = "red";
        ctx.fillStyle = "rgba(255, 136, 120, 0.2)";
        // 连接数据点
        ctx.beginPath();
        for (i = 0; i < step; i++) {
            rad = (2 * Math.PI / 360) * (360 / step) * i;
            temp = getPointCoordinate(rad, r * cfg.data[i][1] * per);
            ctx.lineTo(temp[0], temp[1]);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // 填充数据点
        ctx.fillStyle = "#ff7676";
        for (i = 0; i < step; i++) {
            rad = (2 * Math.PI / 360) * (360 / step) * i;
            temp = getPointCoordinate(rad, r * cfg.data[i][1] * per);
            ctx.beginPath();
            ctx.arc(temp[0], temp[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // 第一个canvas，用于绘制网格线
    cns = addCanvas(w, h);
    ctx = cns.getContext("2d");
    component.append(cns);

    isBlue = false; // 交替变化颜色
    for (i = 10; i > 0; i--) { // 从外向内绘制，半径逐渐减小
        ctx.fillStyle = (isBlue = !isBlue) ? "#99c0ff" : "#f1f9ff";
        drawMap(ctx, r * i / 10);
    }

    // 根据取得的外圈坐标点绘制伞骨和项目名称
    pointCoordinate = calculateCirclePointCoordinate(step, r); // 取得最外圈坐标点
    ctx.strokeStyle = "#e0e0e0";
    ctx.beginPath();
    for (i = 0; i < step; i++) {
        ctx.moveTo(r, r);
        ctx.lineTo(pointCoordinate[i][0], pointCoordinate[i][1]);

        // 添加项目名称
        text = $("<div class='text'>");
        text.text(cfg.data[i][0]);
        // 调整项目文本的位置
        if (pointCoordinate[i][0] > r) {
            text.css("left", pointCoordinate[i][0] / 2);
        } else {
            text.css("right", (w - pointCoordinate[i][0]) / 2);
        }
        if (pointCoordinate[i][1] > r) {
            text.css("top", pointCoordinate[i][1] / 2);
        } else {
            text.css("bottom", (h - pointCoordinate[i][1]) / 2);
        }
        // 有特殊样式
        if (cfg.data[i][2]) {
            text.css("color", cfg.data[i][2]);
        }
        text.css("transition", "all 1s " + (2 + i * 0.2) + "s");
        component.append(text);
    }
    ctx.stroke();

    // 第二个canvas，用于绘制数据
    cns = addCanvas(w, h);
    ctx = cns.getContext("2d");
    component.append(cns);

    component.on("onLoad", function () {
        var s,
            i;

        s = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s += .01;
                draw(ctx, step, s);
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
                draw(ctx, step, s);
            }, i * 10);
        }
    });

    return component;
};