'use strict';


define('forum/account/groups', ['forum/account/header'], function (header) {
	var AccountTopics = {};

	AccountTopics.init = function () {
		// if (window.document.location.pathname === '/') {
		// 	$('#customSCCfooter').removeClass('hidden');
		// } else {
		// 	$('#customSCCfooter').addClass('hidden');
		// }
		header.init();

		var groupsEl = $('#groups-list');

		groupsEl.on('click', '.list-cover', function () {
			var groupSlug = $(this).parents('[data-slug]').attr('data-slug');

			ajaxify.go('groups/' + groupSlug);
		});
	};

	return AccountTopics;
});
