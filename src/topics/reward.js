'use strict';

var async = require('async');
var db = require('../database');


module.exports = function (Topics) {
	Topics.buildTopicsReward = function (callback) {
		async.waterfall([
			function (next) {
				db.getObject('topics:rewardscheck', next);
			},
			function (topicsRewards, next) {
				Topics.getAllowRewardTopics(topicsRewards, next);
			},
			function (topicsRewards, next) {
				Topics.getAllowRewardTopics(topicsRewards, next);
			},
		], callback);
	};

	Topics.getAllowRewardTopics = function (topicsRewards, callback) {
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
};
