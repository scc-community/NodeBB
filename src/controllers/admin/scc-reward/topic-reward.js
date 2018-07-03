'use strict';

var async = require('async');
var db = require('../../../database');
var pagination = require('../../../pagination');
var scc = require('../../../scc');


var TopicRewardController = module.exports;

TopicRewardController.initWhere = function (req) {
	var where = [
		{
			key: 'status',
			value: (!req.query.filterByStatus ? '1' : req.query.filterByStatus), // 默认未发放
		},
		{
			key: 'reward_type',
			value: req.query.filterByRewardType,
		},
		{
			key: 'scc_setted',
			value: (req.query.filterByModifyStatus === '1' ? 'NOT NULL' : null) || (req.query.filterByModifyStatus === '0' ? 'NULL' : null),
			compaser: 'IS',
		},
	];
	return where;
};

TopicRewardController.initOrderby = function (req) {
	var orderCondition = [
		{
			scc_issued: (req.query.orderByIssueScc === '1' ? 'DESC' : null) || (req.query.orderByIssueScc === '0' ? 'ASC' : null),
		},
		{
			date_posted: 'DESC',
		},
	];
	return orderCondition;
};

TopicRewardController.getModifyStatusOptions = function () {
	var data = [{
		value: null,
		text: '[[admin/scc-reward/topic-reward:option-all]]',
	}, {
		value: 0,
		text: '[[admin/scc-reward/topic-reward:option-nomodify]]',
	}, {
		value: 1,
		text: '[[admin/scc-reward/topic-reward:option-modifyed]]',
	}];
	return data;
};

TopicRewardController.getStatusOptions = function () {
	var data = [{
		value: 1,
		text: '[[admin/scc-reward/topic-reward:option-noissue]]',
	}, {
		value: 2,
		text: '[[admin/scc-reward/topic-reward:option-issued]]',
	}, {
		value: 3,
		text: '[[admin/scc-reward/topic-reward:option-removed]]',
	}];
	return data;
};

TopicRewardController.getRewardOrderOptions = function () {
	var data = [{
		value: null,
		text: '[[admin/scc-reward/topic-reward:option-all]]',
	}, {
		value: 0,
		text: '[[admin/scc-reward/topic-reward:option-reward-asc]]',
	}, {
		value: 1,
		text: '[[admin/scc-reward/topic-reward:option-reward-desc]]',
	}];
	return data;
};

TopicRewardController.get = function (req, res, next) {
	var page = parseInt(req.query.page, 10) || 1;
	var resultsPerPage = 50;
	var start = Math.max(0, page - 1) * resultsPerPage;

	async.waterfall([
		function (next) {
			async.parallel({
				topicrewards: function (next) {
					var topicRewards = [];
					async.waterfall([
						function (next) {
							scc.topicReward.getRows(
								TopicRewardController.initWhere(req),
								TopicRewardController.initOrderby(req),
								[start, resultsPerPage], next);
						},
						function (result, next) {
							result.forEach(function (item) {
								topicRewards.push(item._data);
							});
							async.each(topicRewards, function (topicReward, next) {
								async.waterfall([
									function (next) {
										db.getObjectFields('user:' + topicReward.uid, ['username', 'userslug'], next);
									},
									function (userData, next) {
										topicReward.username = userData.username;
										topicReward.userslug = userData.userslug;
										topicReward.rewardtype_content = scc.rewardType.find('id', topicReward.reward_type).content;
										topicReward.jsonData = JSON.stringify(topicReward);
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
			var rewardTypeOptions = scc.rewardType.getOptions('topic', true);
			var statusOptions = TopicRewardController.getStatusOptions();
			var modifyStatusOptions = TopicRewardController.getModifyStatusOptions();
			var rewardOrderOptions = TopicRewardController.getRewardOrderOptions();
			var data = {
				topicrewards: receiveData.topicrewards,
				pagination: pagination.create(page, Math.max(1, Math.ceil(receiveData.topicrewards.length / resultsPerPage)), req.query),
				rewardtypes: rewardTypeOptions,
				statuses: statusOptions,
				modifystatuses: modifyStatusOptions,
				rewardorderitems: rewardOrderOptions,
				filterbyNoissueStatus: !req.query.filterByStatus ? true : req.query.filterByStatus === '1',
				condition: {
					filterByStatus: !req.query.filterByStatus ? '1' : req.query.filterByStatus,
					filterByRewardType: req.query.filterByRewardType,
					filterByModifyStatus: req.query.filterByModifyStatus,
					orderByIssueScc: req.query.orderByIssueScc,
				},
				conditionTitle: {
					filterByStatus: getOptionText(statusOptions, req.query.filterByStatus),
					filterByRewardType: getOptionText(rewardTypeOptions, req.query.filterByRewardType, '[[admin/scc-reward/topic-reward:topic-type]]'),
					filterByModifyStatus: getOptionText(modifyStatusOptions, req.query.filterByModifyStatus, '[[admin/scc-reward/topic-reward:modify-status]]'),
					orderByIssueScc: getOptionText(rewardOrderOptions, req.query.orderByIssueScc, '[[admin/scc-reward/topic-reward:reward-order]]'),
				},
			};
			res.render('admin/scc-reward/topic-reward', data);
		},
	], next);

	function getOptionText(data, queryKey, defaultText) {
		if (!queryKey) {
			return defaultText || data[0].text;
		}
		for (var index = 0; index < data.length; index++) {
			var item = data[index];
			if (item.value === parseInt(queryKey, 10)) {
				return item.text;
			}
		}
	}
};
