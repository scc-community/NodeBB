'use strict';


define('forum/compose', [], function () {
	var Compose = {};

	Compose.init = function () {
		var container = $('.composer');

		if (container.length) {
			$(window).trigger('action:composer.enhance', {
				container: container,
			});
		}

		// if (window.document.location.pathname === '/') {
		// 	$('#customSCCfooter').removeClass('hidden');
		// } else {
		// 	$('#customSCCfooter').addClass('hidden');
		// }
	};

	return Compose;
});
