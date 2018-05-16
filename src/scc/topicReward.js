'use strict';

var async = require('async');
var mysql = require('../database/mysql');

var TopicReward = module.exports;

TopicReward.getTopicRewards = function (where, orderby, limit, callback) {
	mysql.pageQuery('topic_rewards', where, orderby, limit, callback);
};

TopicReward.createTopicReward = function (data, callback) {
	mysql.newRow('topic_rewards', data, callback);
};

TopicReward.bcreateTopicReward = function (data, callback) {
	var fieldNames = ['uid', 'reward_type', 'topic_id', 'topic_category', 'topic_title',
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed', 'scc_setted', 'scc_issued', 'publish_uid',
	];
	mysql.batchInsert('topic_rewards', fieldNames, data, null, callback);
};

TopicReward.updateTopicRewardsWithTxs = function (topicRewardData, txData, callback) {
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nfindById('topic_rewards', conn, topicRewardData.id, next);
			},
			function (row, next) {
				mysql.nupdateRow(row, conn, topicRewardData, next);
			},
			function (row, next) {
				mysql.nnewRow('txs', conn, txData, next);
			},
			function (row, next) {
				conn.commit();
				conn.release();
				next();
			},
		], next);
	}, callback);
};

TopicReward.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM topic_rewards', null, callback);
};
