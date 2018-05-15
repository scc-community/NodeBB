'use strict';


define('forum/account/following', ['forum/account/header'], function (header) {
	var	Following = {};

	Following.init = function () {
		// if (window.document.location.pathname === '/') {
		// 	$('#customSCCfooter').removeClass('hidden');
		// } else {
		// 	$('#customSCCfooter').addClass('hidden');
		// }
		header.init();
	};

	return Following;
});
