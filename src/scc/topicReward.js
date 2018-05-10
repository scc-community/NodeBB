'use strict';

var mysql = require('../database/mysql');

var TopicReward = module.exports;

TopicReward.getTopicRewards = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('topic_rewards', sqlCondition, variable_binding, callback);
};

TopicReward.createTopicReward = function (data, callback) {
	mysql.newRow('topic_rewards', data, callback);
};

TopicReward.bcreateTopicReward = function (data, callback) {
	var fieldNames = ['uid', 'reward_type', 'topic_id', 'topic_category', 'topic_title', 'topic_link',
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed',
	];
	mysql.batchInsert('topic_rewards', fieldNames, data, null, callback);
};
