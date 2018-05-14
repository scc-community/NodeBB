'use strict';

var async = require('async');
var mysql = require('../database/mysql');

var ManualReward = module.exports;

ManualReward.getManualRewards = function (limit_binding, callback) {
	mysql.baseQuery('manual_rewards', 'ORDER BY date_issued DESC LIMIT ?,?', limit_binding, callback);
};

ManualReward.createManualRewardWithTxs = function (manualRewardData, topicRewardData, callback) {
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nnewRow('manual_rewards', conn, manualRewardData, next);
			},
			function (row, next) {
				mysql.nnewRow('txs', conn, topicRewardData, next);
			},
			function (row, next) {
				conn.release();
				next();
			},
		], next);
	}, callback);
};

ManualReward.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM manual_rewards', null, callback);
};

ManualReward.createManualReward = function (data, callback) {
	mysql.newRow('manual_rewards', data, callback);
};
