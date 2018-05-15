'use strict';

var async = require('async');
var db = require('../../../database');
var pagination = require('../../../pagination');
var scc = require('../../../scc');

var TopicRewardController = module.exports;

TopicRewardController.get = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	var where = [];
	var whereIndex = 0;
	if (req.query.filterByRewardType) {
		where[whereIndex] = {
			key: 'reward_type', value: req.query.filterByRewardType,
		};
		whereIndex += 1;
	}
	if (req.query.filterByIsModifyScc) {
		where[whereIndex] = {
			key: 'scc_setted',
			value: 0,
		};
		whereIndex += 1;
	}
	if (req.query.filterByIsModifyScc) {
		where[whereIndex] = {
			key: 'reward_type',
			value: req.query.filterByTopicRewardType,
		};
		whereIndex += 1;
	}
	where[whereIndex] = {
		key: 'scc_setted',
		value: req.query.whereTopicRewardType,
	};

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
				topicrewards: function (next) {
					var topicrewards = [];
					async.waterfall([
						function (next) {
							scc.topicReward.getTopicRewards(null, [{
								key: 'date_issued',
								value: 'DESC',
							}], [start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								topicrewards.push(item._data);
							});
							async.each(topicrewards, function (manualReward, next) {
								async.waterfall([
									function (next) {
										db.getObjectField('user:' + manualReward.uid, 'username', next);
									},
									function (username, next) {
										manualReward.username = username;
										manualReward.rewardtype_content = scc.rewardType.getRewardTypeText(manualReward.reward_type);
										next();
									},
								], next);
							}, function (err) {
								next(err, topicrewards);
							});
						},
					], next);
				},
			}, next);
		},
		function (receiveData) {
			var data = {
				topicrewards: receiveData.topicrewards,
				pagination: pagination.create(page, Math.max(1, Math.ceil(receiveData.count / resultsPerPage)), req.query),
			};
			res.render('admin/scc-reward/manual-reward', data);
		},
	], next);
};
