'use strict';

var async = require('async');
var db = require('../../../database');
var pagination = require('../../../pagination');
var scc = require('../../../scc');

var TopicRewardController = module.exports;

TopicRewardController.initWhereSql = function (req) {
	var where = [];
	var whereIndex = 0;
	if (req.query.filterByRewardType) {
		where[whereIndex] = {
			key: 'reward_type',
			value: scc.rewardType.getRewardType('topic', 'req.query.filterByIsModifyScc'),
		};
		whereIndex += 1;
	}
	if (req.query.filterByIsModifyScc) {
		where[whereIndex] = {
			key: 'scc_setted',
		};
		switch (req.query.filterByIsModifyScc) {
		case 'true':
			where[whereIndex].compaser = 'IS NOT NULL';
			break;
		case 'false':
			where[whereIndex].compaser = 'IS NULL';
			break;
		}
		whereIndex += 1;
	}
	return where;
};

TopicRewardController.initOrderbySql = function (req) {
	var orderby = [];
	var orderbyIndex = 0;
	if (req.query.orderByIssueScc) {
		orderby[orderbyIndex] = {
			key: 'scc_issued',
		};
		orderby[orderbyIndex].value = req.query.orderByIssueScc.toUpperCase();
		orderbyIndex += 1;
	}

	orderby[orderbyIndex] = {
		key: 'date_posted',
	};
	orderby[orderbyIndex].value = req.query.orderByPostDate.toUpperCase();
	orderbyIndex += 1;
	return orderby;
};

TopicRewardController.getAllRewardTypes = function (socket, callback) {
	function recursive(rewardtype, datas) {
		var data = {};
		if (rewardtype.category === 'topic') {
			data.value = rewardtype.id;
			data.text = rewardtype.content;
			datas.push(data);
		}
	}

	var rewardtypesData = [];
	scc.rewardType.rewardTypeList.forEach(function (rewardtype) {
		recursive(rewardtype, rewardtypesData);
	});
	return rewardtypesData;
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
				topicRewards: function (next) {
					var topicRewards = [];
					async.waterfall([
						function (next) {
							scc.topicReward.getTopicRewards(
								TopicRewardController.initWhereSql,
								TopicRewardController.initOrderbySql,
								[start, resultsPerPage], next);
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
			res.render('admin/scc-reward/topic-reward', data);
		},
	], next);
};
