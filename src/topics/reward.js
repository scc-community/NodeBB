'use strict';

var async = require('async');
var db = require('../database');
var scc = require('../scc');

module.exports = function (Topics) {
	var getAvailableTopics = function (topicsRewards, callback) {
		var results = [];
		async.each(topicsRewards, function (topicReward, next) {
			var data = JSON.parse(topicReward);
			var key = 'topic:' + data.tid + ':tags';
			async.parallel({
				isAllowReward: async.apply(db.getObjectField, 'category:' + data.cid, 'isAllowReward'),
				isExistTag: async.apply(db.exists, key),
			}, function (err, receiveData) {
				if (receiveData.isAllowReward && receiveData.isExistTag) {
					async.waterfall([
						function (next) {
							db.isSetMembers(key, ['转载', '原创', '翻译'], next);
						},
						function (exists, next) {
							if (exists[0] === true || exists[1] === true || exists[2] === true) {
								results.push(data);
							}
							next();
						},
					], next);
				} else {
					next(err);
				}
			}, next);
		}, function (err) {
			callback(err, results);
		});
	};

	var calcTopicReward = function (publishuid, topicsRewards, callback) {
		var results = [];
		async.each(topicsRewards, function (topicReward, next) {
			async.waterfall([
				function (next) {
					async.parallel({
						rewardtype: function (next) {
							var key = 'topic:' + topicReward.tid + ':tags';
							async.waterfall([
								function (next) {
									db.isSetMembers(key, ['转载', '原创', '翻译'], next);
								},
								function (exists, next) {
									var rewardTypeResult = {};
									if (exists[0] === true) {
										rewardTypeResult = {
											id: scc.rewardType.rewardTypes['topic:reprint'].id,
											item: scc.rewardType.rewardTypes['topic:reprint'].item,
										};
									} else if (exists[1] === true) {
										rewardTypeResult = {
											id: scc.rewardType.rewardTypes['topic:original'].id,
											item: scc.rewardType.rewardTypes['topic:original'].item,
										};
									} else if (exists[2] === true) {
										rewardTypeResult = {
											id: scc.rewardType.rewardTypes['topic:translation'].id,
											item: scc.rewardType.rewardTypes['topic:translation'].item,
										};
									}
									next(null, rewardTypeResult);
								},
							], next);
						},
						postData: async.apply(db.getObjectFields, 'post:' + topicReward.pid, ['timestamp', 'upvotes', 'content']),
						topicData: async.apply(db.getObjectFields, 'topic:' + topicReward.pid, ['title']),
					}, function (err, receiveData) {
						var upvotes = parseInt(receiveData.postData.upvotes, 10) || 0;
						var postdate = new Date(parseInt(receiveData.postData.timestamp, 10)).toLocaleString();
						var data = [
							topicReward.uid,
							receiveData.rewardtype.id,
							topicReward.tid,
							topicReward.cid,
							receiveData.topicData.title,
							receiveData.postData.content.length,
							upvotes,
							postdate,
							scc.rewardType.getScc('topic', receiveData.rewardtype.item, receiveData.postData.content.length) + upvotes,
							publishuid,
						];
						next(err, data);
					});
				},
				function (data, next) {
					results.push(data);
					next(null);
				},
			], next);
		}, function (err) {
			callback(err, results);
		});
	};

	var cleanTopicRewards = function (topicsRewards, callback) {
		var items = [];
		for (var index = 0; index < topicsRewards.length; index++) {
			items.push(topicsRewards[index][2]);
		}
		db.deleteObjectFields('topics:rewardscheck', items, callback);
	};

	Topics.buildTopicsReward = function (publishuid, callback) {
		async.waterfall([
			function (next) {
				db.getObject('topics:rewardscheck', next);
			},
			function (topicsRewards, next) {
				getAvailableTopics(topicsRewards, next);
			},
			function (topicsRewards, next) {
				calcTopicReward(publishuid, topicsRewards, next);
			},
			function (topicsRewards, next) {
				scc.topicReward.bcreateTopicReward(topicsRewards, function (err) {
					next(err, topicsRewards);
				});
			},
			function (topicsRewards, next) {
				cleanTopicRewards(topicsRewards, next);
			},
		], function (err) {
			callback = callback || function () {};
			if (err) {
				console.log(err);
			}
			callback(err);
		});
	};
};
