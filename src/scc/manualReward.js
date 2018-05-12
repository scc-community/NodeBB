'use strict';

var mysql = require('../database/mysql');

var ManualReward = module.exports;

ManualReward.getManualRewards = function (limit_binding, callback) {
	mysql.baseQuery('manual_rewards', 'ORDER BY date_issued DESC LIMIT ?,?', limit_binding, callback);
};

ManualReward.createManualReward = function (data, callback) {
	mysql.newRow('manual_rewards', data, callback);
};

ManualReward.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM manual_rewards', null, callback);
};
