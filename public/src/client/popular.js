'use strict';


define('forum/popular', ['components'], function (components) {
	var Popular = {};

	Popular.init = function () {
		app.enterRoom('popular_topics');

		components.get('popular/tab')
			.removeClass('active')
			.find('a[href="' + window.location.pathname + '"]')
			.parent().addClass('active');

		// if (window.document.location.pathname === '/') {
		// 	$('#customSCCfooter').removeClass('hidden');
		// } else {
		// 	$('#customSCCfooter').addClass('hidden');
		// }
	};

	return Popular;
});
