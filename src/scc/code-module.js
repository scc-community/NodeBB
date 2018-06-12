'use strict';

var async = require('async');
var mysql = require('../database/mysql');
var util = require('util');
var utils = require('../utils');
var scc = require('../scc');
var Base = require('./base');

var CodeModule = function () {
	this.tableName = 'code_modules';
};
util.inherits(CodeModule, Base);
var codeModule = new CodeModule();

CodeModule.prototype.cutoffTask = function (id, callback) {
	if (!id) {
		return callback(new Error('error:invalid-Id'));
	}
	var data = {
		event: 'CodeModule.cutoffTask',
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
						var codeModuleData = {
							id: id,
							date_cutoff: new Date().toLocaleString(),
							status: scc.taskCategoryItem.get('code_module_status', 'balanced').id,
						};
						me.updateRow(conn, codeModuleData, next);
					},
					function (result, next) {
						var rewardType = scc.rewardType.get('task', 'code_module');
						var txData = {
							uid: result.accept_uid,
							transaction_uid: 0,
							publish_uid: result.publish_uid,
							transaction_type: '1',
							tx_no: utils.generateUUID(),
							reward_type: rewardType.id,
							date_issued: new Date().toLocaleString(),
							scc: result.scc,
							content: rewardType.content + ':' + result.id,
						};
						data.result.codeModule = result;
						scc.tx.newRow(conn, txData, next);
					},
					function (row, next) {
						data.result.tx = row._data;
						next();
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

module.exports = codeModule;
