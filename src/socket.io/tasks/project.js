'use strict';

var async = require('async');
var pagination = require('../../pagination');
var scc = require('../../scc');

module.exports = function (SocketTasks) {
	SocketTasks.project = {};
	SocketTasks.project.newProject = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var rowData = {
			publish_uid: data.publish_uid,
			date_published: new Date().toLocaleString(),
			delivery_deadline: data.delivery_deadline,
			title: data.title,
			description: data.description,
			codemodule_count: 0,
			architect_count: 0,
			scc_sum: 0,
			status: data.status,
		};
		scc.project.newRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.saveProject = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			id: data.projectId,
			delivery_deadline: data.delivery_deadline,
			title: data.title,
			description: data.description,
			status: data.status,
		};
		scc.project.updateRow(null, rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.deleteProject = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		scc.project.deleteRowById(null, data.projectId, function (err) {
			callback(err);
		});
	};

	// SocketTasks.project.endProject = function (socket, data, callback) {
	// 	if (!data) {
	// 		return callback(new Error('[[error:invalid-data]]'));
	// 	}
	// 	if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
	// 		return callback(new Error('[[error:balanced-project]]'));
	// 	}
	// 	var rowData = {
	// 		id: data.projectId,
	// 		date_closed: new Date().toLocaleString(),
	// 		status: scc.taskCategoryItem.get('project_status', 'closed').id,
	// 	};
	// 	scc.project.updateRow(null, rowData, function (err) {
	// 		callback(err);
	// 	});
	// };

	SocketTasks.project.cutoffProject = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}
		var rowData = {
			projectId: data.projectId,
			sccSum: data.sccSum,
			status: data.status,
			projectTitle: data.projectTitle,
			publishUId: data.publishUId,
		};
		scc.project.cutoffTask(rowData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.newCodeModule = function (socket, data, callback) {
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

	SocketTasks.project.getCodeModules = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		var query = data.query || '';
		var searchBy = data.searchBy || 'title';
		// var sortBy = data.sortBy,
		var page = data.page || 1;
		var resultsPerPage = 20;
		var start = Math.max(0, page - 1) * resultsPerPage;
		var stop = start + resultsPerPage;

		var rowData = {
			title: query,
		};
		var where = [{
			key: searchBy,
			compaser: 'like',
			value: '%' + rowData.title + '%',
		}];

		async.waterfall([
			function (next) {
				scc.codeModule.getRows(where, null, [start, stop], next);
			},
			function (result, next) {
				var codeModules = [];
				result.forEach(function (item) {
					var include = false;
					if (data.excludeIds) {
						for (var index = 0; index < data.excludeIds.length; index++) {
							var codeModuleId = data.excludeIds[index];
							if (parseInt(codeModuleId, 10) === item._data.id) {
								include = true;
								break;
							}
						}
					}
					if (!include) {
						codeModules.push(item._data);
					}
				});
				next(null, codeModules);
			},
			function (codeModules, next) {
				var searchResult = {
					matchCount: codeModules.length,
					pageCount: Math.ceil(codeModules.length / resultsPerPage),
					codeModules: codeModules,
					pagination: pagination.create(page, Math.max(1, Math.ceil(codeModules.length / resultsPerPage))),
				};
				next(null, searchResult);
			},
		], callback);
	};

	SocketTasks.project.deleteCodeModule = function (socket, data, callback) {
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

	SocketTasks.project.newArchitect = function (socket, data, callback) {
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
			architect_uid: data.architectUId,
			scc: data.scc,
			work_desc: data.workDesc,
		};
		scc.project.newArchitect(rowData, architectData, function (err) {
			callback(err);
		});
	};

	SocketTasks.project.saveArchitect = function (socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		if (data.status === scc.taskCategoryItem.get('project_status', 'balanced').id) {
			return callback(new Error('[[error:balanced-project]]'));
		}

		var rowData = {
			id: data.projectArchitectId,
			p_id: data.projectId,
			architect_uid: data.architectUId,
			scc: data.scc,
			work_desc: data.workDesc,
		};
		scc.projectArchitect.updateRow(null, rowData, function (err) {
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
