'use strict';

var async = require('async');
var db = require('../database');
var topicReward = require('../scc/topicReward');
var utils = require('../utils');

module.exports = function (Topics) {
	var getAllowRewardTopics = function (topicsRewards, callback) {
		var results = [];
		async.each(topicsRewards, function (topicReward, next) {
			var data = JSON.parse(topicReward);
			async.waterfall([
				function (next) {
					db.getObjectField('category:' + data.cid, 'isAllowReward', next);
				},
				function (isAllowReward, next) {
					if (isAllowReward) {
						results.push(data);
					}
					next(null, results);
				},
			], next);
		}, function (err) {
			callback(err, results);
		});
	};

	var calcTopicReward = function (topicsRewards, callback) {
		var results = [];
		async.each(topicsRewards, function (topicReward, next) {
			async.waterfall([
				function (next) {
					async.parallel({
						postData: async.apply(db.getObjectFields, 'post:' + topicReward.pid, ['timestamp', 'upvotes', 'content']),
						topicData: async.apply(db.getObjectField, 'topic:' + topicReward.pid, 'title'),
					}, function (err, receiveData) {
						var rewardtype = 1;
						var scc = 1;
						var link = '';
						var data = [
							topicsRewards.uid,
							rewardtype,
							topicsRewards.tid,
							topicsRewards.cid,
							receiveData.topicData.title,
							link,
							receiveData.postData.content.length,
							receiveData.postData.upvotes,
							utils.toISOString(receiveData.postData.timestamp),
							scc,
						];
						next(err, data);
					});
				},
				function (data, next) {
					results.push(data);
					next(null, results);
				},
			], next);
		}, function (err) {
			callback(err, results);
		});
	};

	var buildMysqlRows = function (topicsRewards) {
		var results = [];
		for (var index = 0; index < topicsRewards.length; index++) {
			results[index] = [
				topicsRewards[index].uid,
				topicsRewards[index].rewardtype,
				topicsRewards[index].tid,
				topicsRewards[index].cid,
				topicsRewards[index].title,
				topicsRewards[index].link,
				topicsRewards[index].wordcount,
				topicsRewards[index].upvotes,
				topicsRewards[index].postdate,
				topicsRewards[index].scc,
			];
		}
		return results;
	};

	Topics.buildTopicsReward = function (callback) {
		async.waterfall([
			function (next) {
				db.getObject('topics:rewardscheck', next);
			},
			function (topicsRewards, next) {
				getAllowRewardTopics(topicsRewards, next);
			},
			function (topicsRewards, next) {
				calcTopicReward(topicsRewards, next);
			},
			function (calcTopicRewards, next) {
				var mysqlRows = buildMysqlRows(calcTopicRewards);
				topicReward.bcreateTopicReward(mysqlRows, next);
			},
		], callback);
	};
};
