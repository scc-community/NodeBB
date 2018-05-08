'use strict';

var mysql = require('../database/mysql');

var TopicReward = module.exports;

TopicReward.getTopicRewards = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('topic_rewards', sqlCondition, variable_binding, callback);
};

TopicReward.createTopicReward = function (data, callback) {
	mysql.newRow('topic_rewards', data, callback);
};
