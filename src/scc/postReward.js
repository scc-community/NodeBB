'use strict';

var mysql = require('../database/mysql');

var PostReward = module.exports;

PostReward.getPostRewards = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('post_rewards', sqlCondition, variable_binding, callback);
};

PostReward.createPostReward = function (data, callback) {
	mysql.newRow('post_rewards', data, callback);
};
