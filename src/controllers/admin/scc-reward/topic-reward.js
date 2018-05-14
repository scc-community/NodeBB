'use strict';

var async = require('async');
var scc = require('../../../scc');
var pagination = require('../../../pagination');
var db = require('../../../database');

var TopicRewardController = module.exports;

TopicRewardController.get = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	var sortByDateIssued = req.query.sortByDateIssued;
	var filterBySccIsModdify = req.query.filterBySccIsModdify;
	var filterByTopicRewardType = req.query.filterByTopicRewardType;

	async.waterfall([
		function (next) {
			async.parallel({
				count: function (next) {
					async.waterfall([
						function (next) {
							scc.topicReward.getCount(next);
						},
						function (result, _, next) {
							next(null, result[0].count);
						},
					], next);
				},
				topicRewards: function (next) {
					var topicRewards = [];
					async.waterfall([
						function (next) {
							scc.topicReward.getTopicRewards([start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								topicRewards.push(item._data);
							});
							async.each(topicRewards, function (topicReward, next) {
								async.waterfall([
									function (next) {
										db.getObjectField('user:' + topicReward.uid, 'username', next);
									},
									function (username, next) {
										topicReward.username = username;
										for (let index = 0; index < scc.rewardType.rewardTypeList.length; index++) {
											var rewardType = scc.rewardType.rewardTypeList[index];
											if (rewardType.id === topicReward.reward_type) {
												topicReward.rewardtype_content = rewardType.content;
												break;
											}
										}
										next();
									},
								], next);
							}, function (err) {
								next(err, topicRewards);
							});
						},
					], next);
				},
			}, next);
		},
		function (receiveData) {
			var data = {
				topicRewards: receiveData.topicRewards,
				pagination: pagination.create(page, Math.max(1, Math.ceil(receiveData.count / resultsPerPage)), req.query),
			};
			res.render('admin/scc-reward/manual-reward', data);
		},
	], next);
};
