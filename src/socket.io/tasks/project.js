'use strict';

var scc = require('../../scc');

module.exports = function (SocketTasks) {
	SocketTasks.project = {};
	SocketTasks.project.newTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var rowData = {
			publish_uid: data.publish_uid,
			date_published: new Date().toLocaleString(),
			delivery_deadline: data.delivery_deadline,
			title: data.title,
			codemodule_count: 0,
			architect_count: 0,
			status: scc.taskCategoryItem.get('project_status', 'beginning').id,
		};
		scc.project.newRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.saveTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.id,
			delivery_deadline: data.delivery_deadline,
			title: data.title,
			status: data.status,
		};
		scc.project.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.deleteTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		scc.project.deleteRowById(null, data.id, function (err) {
			callback(err);
		});
	};

	// SocketTasks.project.endTask = function (socket, data, callback) {
	// 	if (!data) {
	// 		return callback(new Error('[[error:invalid-data]]'));
	// 	}
	// 	if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
	// 		return callback(new Error('[[error:balanced-project]]'));
	// 	}
	// 	var rowData = {
	// 		id: data.id,
	// 		date_closed: new Date().toLocaleString(),
	// 		status: scc.taskCategoryItem.get('project_status', 'closed').id,
	// 	};
	// 	scc.project.updateRow(null, rowData, function (err) {
	// 		callback(err);
	// 	});
	// };

	SocketTasks.project.cutoffTask = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		scc.project.cutoffTask(data.id, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.addModule = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.projectId,
		};
		var codeModuleRowData = {
			id: data.codeModuleId,
		};
		scc.project.newCodeModule(rowData, codeModuleRowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.getModules = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var rowData = {
			title: data.title,
		};
		var where = [{
			key: 'title',
			compaser: 'like',
			value: rowData.title + '%',
		}];
		scc.codeModule.getRows(where, null, [0, 10], function (err) {
			callback(err);
		});
	};

	SocketTasks.project.deleteModule = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.projectId,
		};
		var codeModuleRowData = {
			id: data.codeModuleId,
		};
		scc.project.deleteCodeModule(rowData, codeModuleRowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.addArchitect = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.projectId,
		};
		var architectData = {
			p_id: data.projectId,
			architect_uid: data.architectId,
			scc: data.scc,
			work_desc: data.work_desc,
		};
		scc.project.newArchitectData(rowData, architectData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.deleteArchitect = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.projectId,
		};
		var architectRowData = {
			id: data.architectId,
		};
		scc.project.deleteArchitect(rowData, architectRowData, function (err) {
			callback(err);
		});
	};
};
