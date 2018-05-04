'use strict';

var mysql = require('../database/mysql');

var ManualReward = module.exports;

ManualReward.getManualRewards = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('manual_rewards', sqlCondition, variable_binding, callback);
};

ManualReward.createManualReward = function (data, callback) {
	mysql.newRow('manual_rewards', data, callback);
};
