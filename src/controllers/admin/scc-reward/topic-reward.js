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

TopicRewardController.getModifyStatuses = function () {
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

TopicRewardController.getStatuses = function () {
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

TopicRewardController.getRewardOrderItems = function () {
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
										for (var index = 0; index < scc.rewardType.rewardTypeList.length; index++) {
											var rewardType = scc.rewardType.rewardTypeList[index];
											if (rewardType.id === topicReward.reward_type) {
												topicReward.rewardtype_content = rewardType.content;
												break;
											}
										}
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
			var rewardTypes = scc.topicReward.getOptions('topic', true);
			var statuses = TopicRewardController.getStatuses();
			var modifyStatuses = TopicRewardController.getModifyStatuses();
			var rewardOrderItems = TopicRewardController.getRewardOrderItems();
			var data = {
				topicrewards: receiveData.topicrewards,
				pagination: pagination.create(page, Math.max(1, Math.ceil(receiveData.count / resultsPerPage)), req.query),
				rewardtypes: rewardTypes,
				statuses: statuses,
				modifystatuses: modifyStatuses,
				rewardorderitems: rewardOrderItems,
				filterbyNoissueStatus: !req.query.filterByStatus ? true : req.query.filterByStatus === '1',
				condition: {
					filterByStatus: !req.query.filterByStatus ? '1' : req.query.filterByStatus,
					filterByRewardType: req.query.filterByRewardType,
					filterByModifyStatus: req.query.filterByModifyStatus,
					orderByIssueScc: req.query.orderByIssueScc,
				},
				conditionTitle: {
					filterByStatus: getOptionText(statuses, req.query.filterByStatus),
					filterByRewardType: getOptionText(rewardTypes, req.query.filterByRewardType, '[[admin/scc-reward/topic-reward:topic-type]]'),
					filterByModifyStatus: getOptionText(modifyStatuses, req.query.filterByModifyStatus, '[[admin/scc-reward/topic-reward:modify-status]]'),
					orderByIssueScc: getOptionText(rewardOrderItems, req.query.orderByIssueScc, '[[admin/scc-reward/topic-reward:reward-order]]'),
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
