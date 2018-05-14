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
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed', 'publish_uid',
	];
	mysql.batchInsert('topic_rewards', fieldNames, data, null, callback);
};

TopicReward.getManualRewards = function (where, orderby, limit, callback) {
	var sqlCondition = '';
	if (where) {
		for (var whereIndex = 0; whereIndex < where.length; whereIndex++) {
			sqlCondition += (' ORDER BY ' + where[whereIndex].key + ' ' + where[whereIndex].value + ',');
		}
		sqlCondition = sqlCondition.substring(0, sqlCondition.length - 3);
	}
	if (orderby) {
		for (var orderByIndex = 0; orderByIndex < orderby.length; orderByIndex++) {
			sqlCondition += (' ORDER BY ' + orderby[orderByIndex].key + ' ' + orderby[orderByIndex].value + ',');
		}
		sqlCondition = sqlCondition.substring(0, sqlCondition.length - 1);
	}
	if (limit) {
		sqlCondition += ' LIMIT ' + limit[0] + ',' + limit[1];
	}
	mysql.baseQuery('topic_rewards', sqlCondition, null, callback);
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
