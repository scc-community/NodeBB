'use strict';

var scc = require('../../scc');
var file = require('../../file');
var path = require('path');

module.exports = function (SocketTasks) {
	SocketTasks.module = {};
	SocketTasks.module.newModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var rowData = {
			publish_uid: data.publish_uid,
			accept_uid: data.accept_uid,
			title: data.title,
			scc: data.scc,
			requirement_desc: data.requirement_desc,
			delivery_deadline: data.delivery_deadline,
			dev_language: data.dev_language,
			app: data.app,
			memo: data.memo,
		};
		if (data.publish) {
			rowData.date_published = new Date().toLocaleString();
			rowData.status = scc.taskCategoryItem.get('code_module_status', 'published').id;
		} else {
			rowData.status = scc.taskCategoryItem.get('code_module_status', 'draft').id;
		}
		scc.codeModule.newRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.saveModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'closed').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			publish_uid: data.publish_uid,
			accept_uid: data.accept_uid,
			title: data.title,
			scc: data.scc,
			requirement_desc: data.requirement_desc,
			delivery_deadline: data.delivery_deadline,
			dev_language: data.dev_language,
			app: data.app,
			memo: data.memo,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.publishModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'draft').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			date_published: new Date().toLocaleString(),
			status: scc.taskCategoryItem.get('code_module_status', 'published').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.deleteModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'closed').id) {
			return callback(new Error('[[error:closed-project]]'));
		}
		if (data.url && data.url.trim() !== '') {
			var codemodulePath = path.resolve(__dirname, '../../..') + data.url.replace('/assets', '/public');
			file.delete(codemodulePath);
		}
		scc.codeModule.deleteRowById(null, data.codemoduleId, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.endModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'closed').id) {
			return callback(new Error('[[error:closed-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'draft').id) {
			return callback(new Error('[[error:draft-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			date_closed: new Date().toLocaleString(),
			status: scc.taskCategoryItem.get('code_module_status', 'closed').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.developingModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var publishedStatus = scc.taskCategoryItem.get('code_module_status', 'published').id;
		var developingStatus = scc.taskCategoryItem.get('code_module_status', 'developing').id;
		if (!(data.status === publishedStatus || data.status === developingStatus)) {
			return callback(new Error('[[error:published-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			status: data.status,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.submitModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}

		var developingStatus = scc.taskCategoryItem.get('code_module_status', 'developing').id;
		var submitStatus = scc.taskCategoryItem.get('code_module_status', 'submited').id;
		if (!(data.status === developingStatus || data.status === submitStatus)) {
			return callback(new Error('[[error:developing-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			status: data.status,
		};
		if (data.oldUrl && data.oldUrl.trim() !== '') {
			var codemodulePath = path.resolve(__dirname, '../../..') + data.oldUrl.replace('/assets', '/public');
			file.delete(codemodulePath);
		}
		if (data.newUrl) {
			rowData.url = data.newUrl;
			rowData.date_upload = new Date().toLocaleString();
		}
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.unSubmitModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'submited').id) {
			return callback(new Error('[[error:submited-project]]'));
		}
		var rowData = {
			id: data.codemoduleId,
			status: scc.taskCategoryItem.get('code_module_status', 'developing').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.cutoffModuleTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'submited').id) {
			return callback(new Error('[[error:submited-project]]'));
		}
		scc.codeModule.cutoffTask(data, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.getDevLanguages = function (socket, data, callback) {
		var searchResult = {
			devLanguages: scc.taskCategoryItem.getOptions('dev_language'),
		};
		callback(null, searchResult);
	};

	SocketTasks.module.getApps = function (socket, data, callback) {
		var searchResult = {
			apps: scc.taskCategoryItem.getOptions('app'),
		};
		callback(null, searchResult);
	};
};
