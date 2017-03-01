var H5_loading = function (images) {
	if (this._images === undefined) { //第一次执行该方法
		this._images = (images || []).length;//需要加载的图片数
		this._loaded = 0; //刚开始时加载了0个资源

		var that = this;
		for (s in images) {
			if (images.hasOwnProperty(s)) {
                var img = new Image;
                img.onload = function () {
                    that.loader(); //每加载完一张图片就调用一次该方法
                };
                img.src = images[s];
			}
		}
		$('#rate').text('0%');
		return this;
	} else {
		this._loaded++;
		$('#rate').text(((this._loaded / this._images * 100) >> 0) + "%");
		if (this._loaded < this._images) { //图片没有加载完则提前退出方法，继续加载剩余图片
			return this;
		}
	}
	//图片全部加载完毕
	$('.h5_page_one').find('.h5_component').trigger('onLoad');
	this.el.fullpage({
		onLeave: function (index, nextIndex, direction) {
			$(this).find('.h5_component').trigger('onLeave');
		},
		afterLoad: function (anchorLink, index) {
			$(this).find('.h5_component').trigger('onLoad');
		}
	});
	this.el.show();
};