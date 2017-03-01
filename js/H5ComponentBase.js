var H5ComponentBase = function (name, cfg) {
    var cfg = cfg || {};
    var id = ('h5_c_' + Math.random()).replace('.', '_');
    var cls = 'h5_component_' + cfg.type;
    var component = $('<div class="h5_component ' + cls + ' h5_component_name_' + name + '" id="' + id + '"></div>');

    cfg.text && component.text(cfg.text); // 添加文本
    cfg.width && component.width(cfg.width / 2); // 设定宽度
    cfg.height && component.height(cfg.height / 2); // 设定高度
    cfg.bg && component.css('backgroundImage', 'url(' + cfg.bg + ')'); // 设定背景
    cfg.center === true && component.css({ // 设定居中
        marginLeft: -cfg.width / 4,
        left: '50%'
    });
    cfg.css && component.css(cfg.css); // 添加CSS样式

    // 添加事件
    if (typeof cfg.onclick === "function") {
        component.on("click", cfg.onclick);
    }

    component.on('onLoad', function () {
        setTimeout(function () {
            component.addClass(cls + '_load').removeClass(cls + '_leave');
            cfg.animateIn && component.animate(cfg.animateIn);
        }, cfg.delay || 0);
        return false;
    });

    component.on('onLeave', function () {
        setTimeout(function () {
            component.addClass(cls + '_leave').removeClass(cls + '_load');
            cfg.animateOut && component.animate(cfg.animateOut);
        }, cfg.delay || 0);
        return false;
    });
    return component;
};