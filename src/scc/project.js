'use strict';

var async = require('async');
var mysql = require('../database/mysql');
var Base = require('./base');
var util = require('util');
var utils = require('../utils');
var scc = require('../scc');
var user = require('../user');

var Project = function () {
	this.tableName = 'projects';
};
util.inherits(Project, Base);
var project = new Project();

Project.prototype.newCodeModule = function (rowData, codeModuleRowData, callback) {
	var me = this;
	async.waterfall([
		function (next) {
			me.findRowById(null, rowData.id, next);
		},
		function (row, next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						rowData.codemodule_count = row._data.codemodule_count + 1;
						rowData.codemodule_url = null;
						mysql.nupdateRow(row, conn, rowData, next);
					},
					function (result, next) {
						var data = {
							p_id: rowData.id,
							cm_id: codeModuleRowData.id,
						};
						scc.projectCodeModule.newRow(conn, data, next);
					},
				], next);
			}, next);
		},
	], callback);
};

Project.prototype.deleteCodeModule = function (rowData, codeModuleRowData, callback) {
	var me = this;
	async.waterfall([
		function (next) {
			me.findRowById(null, rowData.id, next);
		},
		function (row, next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						rowData.codemodule_count = row._data.codemodule_count - 1;
						mysql.nupdateRow(row, conn, rowData, next);
					},
					function (result, next) {
						scc.projectCodeModule.deleteRows(conn, 'WHERE p_id = ? AND cm_id = ?', [rowData.id, codeModuleRowData.id], next);
					},
				], next);
			}, next);
		},
	], callback);
};

Project.prototype.newArchitect = function (rowData, architectRowData, callback) {
	var me = this;
	async.waterfall([
		function (next) {
			me.findRowById(null, rowData.id, next);
		},
		function (row, next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						rowData.architect_count = row._data.architect_count + 1;
						mysql.nupdateRow(row, conn, rowData, next);
					},
					function (result, next) {
						scc.projectArchitect.newRow(conn, architectRowData, next);
					},
				], next);
			}, next);
		},
	], callback);
};

Project.prototype.deleteArchitect = function (rowData, architectRowData, callback) {
	var me = this;
	async.waterfall([
		function (next) {
			me.findRowById(null, rowData.id, next);
		},
		function (row, next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						rowData.architect_count = row._data.architect_count - 1;
						mysql.nupdateRow(row, conn, rowData, next);
					},
					function (result, next) {
						scc.projectArchitect.deleteRowById(conn, [architectRowData.id], next);
					},
				], next);
			}, next);
		},
	], callback);
};

Project.prototype.cutoffTask = function (rowData, callback) {
	if (!rowData) {
		return callback(new Error('error:invalid-data'));
	}
	var data = {
		event: 'Project.cutoffTask',
		group_id: utils.generateUUID(),
		parameters: {
			rowData: rowData,
		},
		result: {},
	};
	var me = this;
	var txData = {};
	var projectData = {};
	async.waterfall([
		function (next) {
			scc.txLog.begin(data, next);
		},
		function (next) {
			mysql.transaction(function (conn, next) {
				var rewardType = scc.rewardType.get('task', 'project');
				async.waterfall([
					function (next) {
						projectData = {
							id: rowData.projectId,
							date_cutoff: new Date().toLocaleString(),
							status: scc.taskCategoryItem.get('project_status', 'balanced').id,
							scc_sum: rowData.sccSum,
						};
						me.updateRow(conn, projectData, next);
					},
					function (result, next) {
						data.result.project = projectData;
						scc.projectArchitect.getRows([{	key: 'p_id', value: rowData.projectId }], null, null, next);
					},
					function (result, next) {
						var projectArchitects = [];
						result.forEach(function (item) {
							projectArchitects.push(item._data);
						});
						data.parameters.projectArchitects = projectArchitects;
						async.eachSeries(projectArchitects, function (projectArchitect, next) {
							txData = {
								uid: projectArchitect.architect_uid,
								transaction_uid: 0,
								publish_uid: rowData.publishUId,
								transaction_type: '1',
								tx_no: utils.generateUUID(),
								reward_type: rewardType.id,
								date_issued: new Date().toLocaleString(),
								scc: projectArchitect.scc,
								content: '项目架构工作(' + rowData.projectId + ':' + rowData.projectTitle + ')',
							};
							data.result.paTxDatas = [];
							data.result.paTxDatas.push(txData);
							scc.tx.newRow(conn, txData, next);
						}, next);
					},
					function (next) {
						scc.vpcm.getRows([{ key: 'p_id', value: rowData.projectId }], null, null, next);
					},
					function (result, next) {
						var vpcms = [];
						result.forEach(function (item) {
							vpcms.push(item._data);
						});
						data.parameters.vpcms = vpcms;
						async.eachSeries(vpcms, function (vpcm, next) {
							txData = {
								uid: vpcm.cm_accept_uid,
								transaction_uid: 0,
								publish_uid: rowData.publishUId,
								transaction_type: '1',
								tx_no: utils.generateUUID(),
								reward_type: rewardType.id,
								date_issued: new Date().toLocaleString(),
								scc: vpcm.cm_scc * 0.5,
								content: '模块(' + vpcm.cm_id + ':' + vpcm.cm_title + ')被项目(' + rowData.projectId + ':' + rowData.projectTitle + ')采用',
							};
							data.result.vpcmTxDatas = [];
							data.result.vpcmTxDatas.push(txData);
							scc.tx.newRow(conn, txData, next);
						}, next);
					},
				], next);
			}, next);
		},
		function (next) {
			async.eachSeries(data.result.paTxDatas, function (tx, next) {
				async.waterfall([
					function (next) {
						user.getSccToken(tx.uid, next);
					},
					function (scctoken, next) {
						tx.oldSccToken = scctoken;
						user.incrSccToken(tx.uid, tx.scc, next);
					},
					function (scctoken, next) {
						tx.newSccToken = scctoken;
						next();
					},
				], next);
			}, next);
		},
		function (next) {
			async.eachSeries(data.result.vpcmTxDatas, function (tx, next) {
				async.waterfall([
					function (next) {
						user.getSccToken(tx.uid, next);
					},
					function (scctoken, next) {
						tx.oldSccToken = scctoken;
						user.incrSccToken(tx.uid, tx.scc, next);
					},
					function (scctoken, next) {
						tx.newSccToken = scctoken;
						next();
					},
				], next);
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

