'use strict';


define('forum/task/module', [], function () {
	var Module = {};

	Module.init = function () {
		function handleCodemoduleCreate() {
			$('#createCodemodule').on('click', function () {
				ajaxify.go('task/module/detail');
			});
		}

		handleCodemoduleCreate();
	};

	return Module;
});
