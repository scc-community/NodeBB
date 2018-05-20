'use strict';

var async = require('async');
var mysql = require('../database/mysql');

var user = require('../user');

var ManualReward = module.exports;

ManualReward.getManualRewards = function (where, orderby, limit, callback) {
	mysql.pageQuery('manual_rewards', where, orderby, limit, callback);
};

ManualReward.createManualRewardWithTxs = function (manualRewardData, txData, callback) {
	async.waterfall([
		function (next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						mysql.nnewRow('manual_rewards', conn, manualRewardData, next);
					},
					function (row, next) {
						mysql.nnewRow('txs', conn, txData, next);
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
			user.incrSccToken(txData.uid, txData.scc, next);
		},
	], callback);
};

ManualReward.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM manual_rewards', null, callback);
};

ManualReward.createManualReward = function (data, callback) {
	mysql.newRow('manual_rewards', data, callback);
};
