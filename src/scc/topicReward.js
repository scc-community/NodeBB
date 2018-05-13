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
	var fieldNames = ['uid', 'reward_type', 'topic_id', 'topic_category', 'topic_title',
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed', 'publish_uid',
	];
	mysql.batchInsert('topic_rewards', fieldNames, data, null, callback);
};


// Dummy data, supposed to be to get from DB
TopicReward.getUnvestedRewards = function (postType, modType, sortType, callback) {
	var dummyData = {
		records: [
			{
				id: 1,
				uid: 1000,
				author: 'JackMa', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: '比特币，创新还是骗局？',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 50,
				is_modified: false,
				scc_issued: 0,
			},
			{
				id: 2,
				uid: 1001,
				author: 'Andy', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: 'DAO分叉？',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 60,
				is_modified: true,
				scc_issued: 0,
			},
			{
				id: 3,
				uid: 1002,
				author: 'Michael', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: 'ICO 骗局还是创新？',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 50,
				is_modified: false,
				scc_issued: 0,
			},
			{
				id: 4,
				uid: 2000,
				author: 'Wendy', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: '挖矿，无谓的资源浪费？',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 80,
				is_modified: true,
				scc_issued: 0,
			},
		],
	};

	// Simulate filter conditions
	// TODO: we should use this types to filter data from DB.

	if (postType === 2) {
		dummyData.records.pop();
	}

	if (modType === 2) {
		dummyData.records.unshift();
	}

	if (sortType === 2) {
		dummyData.records.reverse();
	}

	callback(null, dummyData);
};

TopicReward.getReleasedRewards = function (callback) {
	var dummyReleased = {
		records: [
			{
				id: 100,
				uid: 1000,
				author: 'Emma', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: '从美元金本位到布雷登体系的构造说起',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 50,
				is_modified: false,
				scc_issued: 0,
			},
			{
				id: 20000,
				uid: 1001,
				author: 'Eric', // get by userId
				reward_type: 1,
				topic_id: 100,
				topic_category: 1,
				topic_title: '以太坊，多链与共识算法。',
				topic_words_count: 1200,
				topic_upvotes_count: 6,
				date_posted: '2018-5-10 10:00:19',
				scc_autoed: 100,
				scc_setted: 60,
				is_modified: true,
				scc_issued: 0,
			},

		],
	};

	callback(null, dummyReleased);
};

TopicReward.getRejectedRewards = function (callback) {
	var dummyRejected = {
		records: [
			{
				id: 301,
				uid: 1000,
				author: 'EchoZhang', // get by userId
				topic_category: 1,
				topic_title: 'Hyperledger Projects: composer and noar',
				reason: '不符合要求',
			},
			{
				id: 300,
				uid: 1000,
				author: 'WilliamLu', // get by userId
				topic_category: 1,
				topic_title: 'Copied from other forum',
				reason: '抄袭',
			},
		],
	};

	callback(null, dummyRejected);
};

TopicReward.releaseSCC = function (data, callback) {
	var _ret = {};

	// data.records structure [{id:xx, uid:xxx, scc:xxx}]
	// TODO: update from DB
	_ret.code = 0;
	_ret.message = 'Released ' + data.totalSCC + ' to users.';

	callback(null, _ret);
};

TopicReward.modifySCCNum = function (data, callback) {
	// TODO: data structure {Id: rewardsId, sccNum: NewNum, sccComment: Comment}, write to DB
	var _retScc = { code: 0, message: 'Successfully.' };

	callback(null, _retScc);
};

TopicReward.rejectSCC = function (data, callback) {
	// TODO: data schema: {Id: rewardId, reason: reasonId[0,1,2,3]
	// 0, poor quality, 1, copy, 2 unqualified 3, other
	var _retRej = { code: 0, message: 'Succeed' };
	callback(null, _retRej);
};

TopicReward.restoreSCC = function (id, callback) {
	// TODO: restore rewardId, write to DB
	var _retRes = { code: 0, message: 'Succeed.' };

	callback(null, _retRes);
};
