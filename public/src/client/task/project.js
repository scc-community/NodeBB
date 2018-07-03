'use strict';


define('forum/task/project', [], function () {
	var Proejct = {};

	Proejct.init = function () {
		function handleProjectCreate() {
			$('#createProject').on('click', function () {
				ajaxify.go('task/project/detail');
			});
		}

		handleProjectCreate();
	};

	return Proejct;
});
