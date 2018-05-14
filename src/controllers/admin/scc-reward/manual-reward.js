'use strict';

var async = require('async');
var db = require('../../../database');
var pagination = require('../../../pagination');
var scc = require('../../../scc');

var RewardManualController = module.exports;

RewardManualController.get = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	async.waterfall([
		function (next) {
			async.parallel({
				count: function (next) {
					async.waterfall([
						function (next) {
							scc.manualReward.getCount(next);
						},
						function (result, _, next) {
							next(null, result[0].count);
						},
					], next);
				},
				manualrewards: function (next) {
					var manualrewards = [];
					async.waterfall([
						function (next) {
							scc.manualReward.getManualRewards([start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								manualrewards.push(item._data);
							});
							async.each(manualrewards, function (manualReward, next) {
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
								next(err, manualrewards);
							});
						},
					], next);
				},
			}, next);
		},
		function (receiveData) {
			var data = {
				manualrewards: receiveData.manualrewards,
				pagination: pagination.create(page, Math.max(1, Math.ceil(receiveData.count / resultsPerPage)), req.query),
			};
			res.render('admin/scc-reward/manual-reward', data);
		},
	], next);
};
