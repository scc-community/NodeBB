'use strict';

var scc = require('../../scc');

module.exports = function (SocketTasks) {
	SocketTasks.module = {};
	SocketTasks.module.newTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var rowData = {
			publish_uid: data.publish_uid,
			accept_uid: data.accept_uid,
			title: data.title,
			scc: data.scc,
			requirement_desc: data.requirement_desc,
			delivery_deadlin: data.delivery_deadlin,
			dev_language: data.dev_language,
			app: data.app,
			memo: data.memo,
		};
		if (data.withPublish) {
			rowData.date_published = new Date().toLocaleString();
			rowData.status = scc.taskCategoryItem.get('code_module_status', 'published').id;
		} else {
			rowData.status = scc.taskCategoryItem.get('code_module_status', 'draft').id;
		}
		scc.codeModule.newRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.saveTask = function (socket, data, callback) {
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
			id: data.id,
			publish_uid: data.publish_uid,
			accept_uid: data.accept_uid,
			title: data.title,
			scc: data.scc,
			requirement_desc: data.requirement_desc,
			delivery_deadlin: data.delivery_deadlin,
			dev_language: data.dev_language,
			app: data.app,
			memo: data.memo,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.publishTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'draft').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'closed').id) {
			return callback(new Error('[[error:closed-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'published').id) {
			return callback(new Error('[[error:published-project]]'));
		}
		var rowData = {
			id: data.id,
			date_published: new Date().toLocaleString(),
			status: scc.taskCategoryItem.get('code_module_status', 'published').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.deleteTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		if (data.status === scc.taskCategoryItem.get('code_module_status', 'closed').id) {
			return callback(new Error('[[error:closed-project]]'));
		}
		scc.codeModule.deleteRowById(null, data.id, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.endTask = function (socket, data, callback) {
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
			id: data.id,
			date_closed: new Date().toLocaleString(),
			status: scc.taskCategoryItem.get('code_module_status', 'closed').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.developingTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var publishedStatus = scc.taskCategoryItem.get('code_module_status', 'published').id;
		var developingStatus = scc.taskCategoryItem.get('code_module_status', 'developing').id;
		if (data.status !== publishedStatus || data.status !== developingStatus) {
			return callback(new Error('[[error:published-project]]'));
		}
		var rowData = {
			id: data.id,
			status: scc.taskCategoryItem.get('code_module_status', 'developing').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.submitTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'developing').id) {
			return callback(new Error('[[error:developing-project]]'));
		}
		var rowData = {
			id: data.id,
			status: scc.taskCategoryItem.get('code_module_status', 'submited').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.unSubmitTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'submited').id) {
			return callback(new Error('[[error:submited-project]]'));
		}
		var rowData = {
			id: data.id,
			status: scc.taskCategoryItem.get('code_module_status', 'developing').id,
		};
		scc.codeModule.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.module.cutoffTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status !== scc.taskCategoryItem.get('code_module_status', 'submited').id) {
			return callback(new Error('[[error:submited-project]]'));
		}
		scc.codeModule.cutoffTask(data.id, function (err) {
			callback(err);
		});
	};
};
