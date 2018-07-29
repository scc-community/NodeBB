'use strict';

var async = require('async');
var mysql = require('../database/mysql');
var util = require('util');
var utils = require('../utils');
var user = require('../user');
var scc = require('../scc');
var Base = require('./base');

var CodeModule = function () {
	this.tableName = 'code_modules';
};
util.inherits(CodeModule, Base);
var codeModule = new CodeModule();

CodeModule.prototype.getCountByAcceptUId = function (acceptUId, callback) {
	mysql.query('SELECT COUNT(*) AS count FROM ' + this.tableName + 'WHERE accept_uid = ?', [acceptUId], callback);
};

CodeModule.prototype.cutoffTask = function (data, callback) {
	if (!data) {
		return callback(new Error('error:invalid-Id'));
	}
	var logData = {
		event: 'CodeModule.cutoffTask',
		group_id: utils.generateUUID(),
		parameters: {
			id: data.codemoduleId,
		},
		result: {},
	};
	var me = this;
	var txData = {};
	async.waterfall([
		function (next) {
			scc.txLog.begin(logData, next);
		},
		function (next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						var codeModuleData = {
							id: data.codemoduleId,
							date_cutoff: new Date().toLocaleString(),
							status: scc.taskCategoryItem.get('code_module_status', 'balanced').id,
						};
						me.updateRow(conn, codeModuleData, next);
					},
					function (result, next) {
						var rewardType = scc.rewardType.get('task', 'code_module');
						txData = {
							uid: data.accept_uid,
							transaction_uid: 0,
							publish_uid: data.publish_uid,
							transaction_type: '1',
							tx_no: utils.generateUUID(),
							reward_type: rewardType.id,
							date_issued: new Date().toLocaleString(),
							scc: data.scc,
							content: '创建模块(' + data.codemoduleId + ':' + data.title + ')',
						};
						logData.result.codeModule = result;
						scc.tx.newRow(conn, txData, next);
					},
					function (row, next) {
						logData.result.tx = row._data;
						next();
					},
				], next);
			}, next);
		},
		function (next) {
			scc.txLog.record(logData, next);
		},
		function (next) {
			user.getSccToken(txData.uid, next);
		},
		function (scctoken, next) {
			logData.oldSccToken = scctoken;
			user.incrSccToken(txData.uid, txData.scc, next);
		},
		function (scctoken, next) {
			logData.newSccToken = scctoken;
			scc.txLog.record(logData, next);
		},
	], function (err) {
		if (err) {
			logData.err = {
				message: err.message,
				stack: err.stack,
			};
		}
		scc.txLog.end(logData, callback);
	});
};

module.exports = codeModule;
