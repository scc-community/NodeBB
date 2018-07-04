'use strict';

define('forum/task/centerdetail', ['uploader'], function (uploader) {
	var CenterDetail = {};

	CenterDetail.init = function () {
		console.warn('[deprecation] require(\'admin/settings\').init() has been deprecated, please call require(\'admin/settings\').prepare() directly instead.');
		CenterDetail.prepare();
	};

	CenterDetail.prepare = function (callback) {
		handleUploads();

		if (typeof callback === 'function') {
			callback();
		}
	};

	function handleUploads() {
		$('[component="upload"]').each(function () {
			var uploadBtn = $(this);
			uploadBtn.on('click', function () {
				uploader.show({
					title: uploadBtn.attr('data-title'),
					description: uploadBtn.attr('data-description'),
					route: uploadBtn.attr('data-route'),
					params: {},
					showHelp: uploadBtn.attr('data-help') ? uploadBtn.attr('data-help') === 1 : undefined,
					accept: uploadBtn.attr('data-accept'),
				}, function (newUrl) {
					var data = {
						codemoduleId: uploadBtn.attr('data-id'),
						status: parseInt(uploadBtn.attr('data-status'), 10),
						newUrl: newUrl,
						oldUrl: uploadBtn.attr('data-url'),
					};
					socket.emit('tasks.module.submitModuleTask', data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						app.alertSuccess('上传成功');
						ajaxify.refresh();
					});
				});
			});
		});
	}

	return CenterDetail;
});
