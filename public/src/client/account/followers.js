'use strict';


define('forum/account/followers', ['forum/account/header'], function (header) {
	var	Followers = {};

	Followers.init = function () {
		// if (window.document.location.pathname === '/') {
		// 	$('#customSCCfooter').removeClass('hidden');
		// } else {
		// 	$('#customSCCfooter').addClass('hidden');
		// }
		header.init();
	};

	return Followers;
});
