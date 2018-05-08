'use strict';

var mysql = require('../database/mysql');

var PostReward = module.exports;

PostReward.getPostRewards = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('topic_rewards', sqlCondition, variable_binding, callback);
};

PostReward.createPostReward = function (data, callback) {
	mysql.newRow('topic_rewards', data, callback);
};
