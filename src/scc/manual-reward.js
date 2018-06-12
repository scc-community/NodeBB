'use strict';

var async = require('async');
var util = require('util');
var mysql = require('../database/mysql');
var user = require('../user');
var scc = require('../scc');
var utils = require('../utils');
var Base = require('./base');

var ManualReward = function () {
	this.tableName = 'manual_rewards';
};
util.inherits(ManualReward, Base);
var manualReward = new ManualReward();

ManualReward.prototype.newRowWithTxs = function (manualRewardData, txData, callback) {
	if (!manualRewardData.uid || !txData.uid || manualRewardData.uid !== txData.uid) {
		return callback(new Error('manual-rewards.uid !== txs.uid'));
	}
	var data = {
		event: 'ManualReward.newRowWithTxs',
		group_id: utils.generateUUID(),
		parameters: {
			manualReward: manualRewardData,
			tx: txData,
			oldSccToken: null,
			newSccToken: null,
			txs_id: null,
			err: null,
		},
		result: {},
	};
	async.waterfall([
		function (next) {
			scc.txLog.begin(data, next);
		},
		function (next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						scc.manualReward.newRow(conn, manualRewardData, next);
					},
					function (row, next) {
						data.result.manualReward = row._data;
						scc.tx.newRow(conn, txData, next);
					},
					function (row, next) {
						data.result.tx = row._data;
						data.txs_id = row._data.id;
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
		function (next) {
			user.getSccToken(txData.uid, next);
		},
		function (scctoken, next) {
			data.oldSccToken = scctoken;
			user.incrSccToken(txData.uid, txData.scc, next);
		},
		function (scctoken, next) {
			data.newSccToken = scctoken;
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

module.exports = manualReward;
