'use strict';

var async = require('async');
var mysql = require('../database/mysql');

var ManualReward = module.exports;

ManualReward.getManualRewards = function (where_binding, orderby_binding, limit_binding, callback) {
	var sqlCondition = '';
	if (where_binding) {
		for (const whereKey in where_binding) {
			if (where_binding.hasOwnProperty(whereKey)) {
				var whereValue = where_binding[whereKey];

			}
		}
		sqlCondition +=  ;
	}
	mysql.baseQuery('manual_rewards', sqlCondition, limit_binding, callback);
};

ManualReward.createManualRewardWithTxs = function (manualRewardData, txData, callback) {
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nnewRow('manual_rewards', conn, manualRewardData, next);
			},
			function (row, next) {
				mysql.nnewRow('txs', conn, txData, next);
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
