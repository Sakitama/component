// 折线图组件对象
var H5ComponentPolygonalLine = function (name, cfg) {
    var component,
        w,
        h,
        cns,
        ctx,
        step,
        i,
        y,
        x,
        pointCoordinate;

    component = H5ComponentBase(name, cfg);

    // 第一个canvas，用于绘制网格线
    cns = document.createElement("canvas");
    ctx = cns.getContext("2d");
    w = cfg.width;
    h = cfg.height;
    cns.width = w;
    cns.height = h;
    component.append(cns);

    // 绘制网格线
    step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#aaa";
    // 水平网格线
    for (i = 0; i < step + 1; i++) {
        y = h / step * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }
    // 垂直网格线
    step = cfg.data.length + 1;
    for (i = 0; i < step + 1; i++) {
        x = w / step * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }
    ctx.stroke();

    // 加入canvas，作为数据层
    cns = document.createElement("canvas");
    ctx = cns.getContext("2d");
    cns.width = w;
    cns.height = h;
    component.append(cns);

    // 获取数据点坐标和绘制项目名称
    pointCoordinate = [];
    for (i = 0; i < cfg.data.length; i++) {
        x = w / step * (i + 1);
        y = (1 - cfg.data[i][1]) * h;
        pointCoordinate.push([x, y]);
        // 绘制项目名称
        component.append($("<div class='text'>").text(cfg.data[i][0]).css({
            "left": x / 2 - w / step / 2,
            "width": w / step,
            "transition": "all 1s " + (1.7 + i * 0.2) + "s"
        }));
    }

    /**
     * 绘制折线、数据和阴影
     * @param per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
     */
    function draw(per) {

        var point,
            i;

        // 清除画布
        ctx.clearRect(0, 0, w, h);

        // 根据百分比重新修正数据
        point = pointCoordinate.map(function (item) {
            return [item[0], h - (h - item[1]) * per];
        });

        // 绘制数据点
        ctx.beginPath();
        ctx.fillStyle = "#ff8878";
        for (i = 0; i < point.length; i++) {
            ctx.moveTo(point[i][0], point[i][1]);
            ctx.arc(point[i][0], point[i][1], 5, 0, 2 * Math.PI);
        }
        ctx.fill();

        // 绘制连接数据点的直线
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";
        ctx.moveTo(point[0][0], point[0][1]);
        for (i = 1; i < point.length; i++) {
            ctx.lineTo(point[i][0], point[i][1]);
        }
        ctx.stroke();

        // 连接完整区块
        ctx.lineTo(point[i - 1][0], h);
        ctx.lineTo(point[0][0], h);
        ctx.lineTo(point[0][0], point[0][1]);
        ctx.fillStyle = "rgba(255, 136, 120, 0.2)";
        ctx.fill();

        //写数据
        for (i = 0; i < point.length; i++) {
            ctx.fillStyle = cfg.data[i][2] ? cfg.data[i][2] : "#595959";
            ctx.fillText((cfg.data[i][1] * 100 * per >> 0) + "%", point[i][0] - 10, point[i][1] - 10);
        }
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