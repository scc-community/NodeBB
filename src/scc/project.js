'use strict';

var async = require('async');
var mysql = require('../database/mysql');
var Base = require('./base');
var util = require('util');
var utils = require('../utils');
var scc = require('../scc');

var Project = function () {
	this.tableName = 'projects';
};
util.inherits(Project, Base);
var project = new Project();

Project.prototype.newCodeModule = function (rowData, codeModuleRowData, callback) {
	var me = this;
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				me.findRowById(conn, rowData.id, next);
			},
			function (row, next) {
				rowData.codemodule_count = row._data[0].row.codemodule_count + 1;
				mysql.nupdateRow(row, conn, rowData, next);
			},
			function (result, next) {
				var data = {
					p_id: rowData.id,
					cm_id: codeModuleRowData.id,
				};
				scc.codeModule.newRow(conn, data, next);
			},
		], function (err) {
			if (err) {
				conn.rollback();
			} else {
				conn.commit();
			}
			conn.release();
			next(err);
		}, next);
	}, callback);
};

Project.prototype.deleteCodeModule = function (rowData, codeModuleRowData, callback) {
	var me = this;
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				me.findRowById(conn, rowData.id, next);
			},
			function (row, next) {
				rowData.codemodule_count = row._data[0].row.codemodule_count - 1;
				mysql.nupdateRow(row, conn, rowData, next);
			},
			function (result, next) {
				scc.codeModule.deleteRowById(conn, codeModuleRowData.id, next);
			},
		], function (err) {
			if (err) {
				conn.rollback();
			} else {
				conn.commit();
			}
			conn.release();
			next(err);
		}, next);
	}, callback);
};

Project.prototype.newArchitect = function (rowData, architectRowData, callback) {
	var me = this;
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				me.findRowById(conn, rowData.id, next);
			},
			function (row, next) {
				rowData.codemodule_count = row._data[0].row.codemodule_count + 1;
				mysql.nupdateRow(row, conn, rowData, next);
			},
			function (result, next) {
				scc.projectArchitect.newRow(conn, architectRowData, next);
			},
		], function (err) {
			if (err) {
				conn.rollback();
			} else {
				conn.commit();
			}
			conn.release();
			next(err);
		}, next);
	}, callback);
};

Project.prototype.deleteArchitect = function (rowData, architectRowData, callback) {
	var me = this;
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				me.findRowById(conn, rowData.id, next);
			},
			function (row, next) {
				rowData.architect_count = row._data[0].row.architect_count - 1;
				mysql.nupdateRow(row, conn, rowData, next);
			},
			function (result, next) {
				scc.projectArchitect.deleteRowById(conn, architectRowData.id, next);
			},
		], function (err) {
			if (err) {
				conn.rollback();
			} else {
				conn.commit();
			}
			conn.release();
			next(err);
		}, next);
	}, callback);
};

Project.prototype.cutoffTask = function (id, callback) {
	if (!id) {
		return callback(new Error('error:invalid-Id'));
	}
	var data = {
		event: 'Project.cutoffTask',
		group_id: utils.generateUUID(),
		parameters: {
			id: id,
		},
		result: {},
	};
	var me = this;
	async.waterfall([
		function (next) {
			scc.txLog.begin(data, next);
		},
		function (next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						var projectData = {
							id: id,
							date_cutoff: new Date().toLocaleString(),
							status: scc.taskCategoryItem.get('project_status', 'balanced').id,
						};
						me.updateRow(conn, projectData, next);
					},
					function (result, next) {
						data.result.project = result;
						scc.projectArchitect.getRows([{	key: 'p_id',	value: id }], null, null, next);
					},
					function (projectArchitects, next) {
						data.parameters.projectArchitects = projectArchitects;
						async.eachSeries(projectArchitects, function (projectArchitect, next) {
							var rewardType = scc.rewardType.get('task', 'project');
							var txData = {
								uid: projectArchitect.architect_uid,
								transaction_uid: 0,
								publish_uid: data.result.project.publish_uid,
								transaction_type: '1',
								tx_no: utils.generateUUID(),
								reward_type: rewardType.id,
								date_issued: new Date().toLocaleString(),
								scc: projectArchitect.scc,
								content: rewardType.content + ':' + project.id,
							};
							data.result.paTxDatas.push(txData);
							scc.tx.newRow(conn, txData, next);
						}, next);
					},
					function (next) {
						scc.vpcm.getRows([{ key: 'p_id', value: id }], null, null, next);
					},
					function (vpcms, next) {
						data.parameters.vpcms = vpcms;
						async.eachSeries(vpcms, function (vpcm, next) {
							var rewardType = scc.rewardType.get('task', 'code_module');
							var txData = {
								uid: vpcm.accept_uid,
								transaction_uid: 0,
								publish_uid: data.result.project.publish_uid,
								transaction_type: '1',
								tx_no: utils.generateUUID(),
								reward_type: rewardType.id,
								date_issued: new Date().toLocaleString(),
								scc: vpcm.cm_scc,
								content: rewardType.content + ':' + vpcm.cm_id,
							};
							data.result.vpcmTxDatas.push(txData);
							scc.tx.newRow(conn, txData, next);
						}, next);
					},
				], function (err) {
					if (err) {
						conn.rollback();
					} else {
						conn.commit();
					}
					conn.release();
					next(err);
				}, next);
			}, next);
		},
		function (next) {
			scc.txLog.record(data, next);
		},
	], function (err) {
		if (err) {
			data.err = {
				message: err.message,
				stack: err.stack,
			};
		}
		scc.txLog.end(data, callback);
	});
};

module.exports = project;

