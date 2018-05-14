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

	var sortBySql = [];
	var sortBySqlIndex = 0;
	if (req.query.sortByscc) {
		sortBySql[sortBySqlIndex] = { key: 'scc_issued', value: req.query.sortByScc };
	}
	sortBySql[sortBySqlIndex] = { key: 'date_posted', value: 'DESC' };

	var whereSql = [];
	var whereSqlIndex = 0;
	if (req.query.filterByTopicRewardType) {
		whereSql[whereSqlIndex] = { key: 'reward_type', value: req.query.filterByTopicRewardType };
	}
	if (req.query.filterBySccIsModdify === 0) {
		whereSql[whereSqlIndex] = { key: 'scc_setted', value: 0, oper: '<>' };
	} else if (req.query.filterBySccIsModdify === 1) {
		whereSql[whereSqlIndex] = { key: 'scc_setted', value: 0, oper: '<>' };
	}

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
