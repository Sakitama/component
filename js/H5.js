var jdata = []; //内容管理对象
var H5 = function () {
	this.id = ('h5_' + Math.random()).replace('.', '_');
	this.el = $('<div class="h5" id="' + this.id + '"></div>').hide();
	this.page = [];
	$('body').append(this.el);

	/**
	 * 添加页面
	 * @param name
	 * @returns {H5}
	 */
	this.addPage = function (name) {
		jdata.push({
			isPage: true,
			name: name
		});
		var page = $('<div class="h5_page section"></div>');
		if (name) {
			page.addClass('h5_page_' + name);
		}
		this.el.append(page);
		this.page.push(page);
		return this;
	};

	/**
	 * 添加组件
	 * @param name
	 * @param cfg
	 * @returns {h5}
	 */
	this.addComponent = function (name, cfg) {
		jdata.push({
			isPage: false,
			name: name,
			cfg: cfg
		});
		cfg = cfg || {};
		cfg = $.extend({
			type: 'base'
		}, cfg);
		var component;
		var page = this.page.slice(-1)[0];
		switch (cfg.type) {
			case 'base':
				component = H5ComponentBase(name, cfg);
				break;
			case 'polygonalLine':
				component = H5ComponentPolygonalLine(name, cfg);
				break;
			case 'pie':
				component = H5ComponentPie(name, cfg);
				break;
			case 'bar':
				component = H5ComponentBar(name, cfg);
				break;
			case 'bar_v':
				component = H5ComponentBar_v(name, cfg);
				break;
			case 'radar':
				component = H5ComponentRadar(name, cfg);
				break;
			case 'ring':
				component = H5ComponentRing(name, cfg);
				break;
			case 'point':
				component = H5ComponentPoint(name, cfg);
				break;
			default: break;
		}
		page.append(component);
		return this;
	};
    this.loader = H5_loading;
};