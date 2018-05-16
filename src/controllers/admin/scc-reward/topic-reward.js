'use strict';

var async = require('async');
var scc = require('../../../scc');
var winston = require("winston")
;
var TopicRewardController = module.exports;

<<<<<<< HEAD
var userData = { Page: { isUnvested: true, isRejected: false, isReleased: false }, Data: { isEmpty: false } };
var releasedData = { Page: { isUnvested: false, isRejected: false, isReleased: true }, Data: { isEmpty: false } };
var rejectedData = { Page: { isUnvested: false, isRejected: true, isReleased: false }, Data: { isEmpty: false } };
var defaultFilter = {
	topicType: 1, // 1 全部，2， 原创， 3， 转发， 4， 翻译
	modType: 1, // 1 全部， 2， 是， 3， 否
	sortType: 1, // 1 for desc, 2 for asc
	pageNo: 1,
	pageSize: 30, //default
};

TopicRewardController.get = function (req, res, callback) {
	switch (req.params.q) {
		case 'released':
			releasedRewards(req, res, callback);
			break;
		case 'rejected':
			rejectedRewards(req, res, callback);
			break;
		default:
			unvestedRewards(req, res, callback);
			break;
	}
};

// Un-vested rewards
function unvestedRewards(req, res, callback) {
	// Get all unvested rewards records
	async.waterfall([
		function (next) {
			TopicRewardController.getUnvestedRewards("all", 1, 1, 1, 30, next);
		},
		function (data) {
			//winston.info(JSON.stringify(data));
			if (!Array.isArray(data.unvested)) {
				userData.Data.isEmpty = true;
				userData.Data.records = [];
			} else {
				userData.Data.isEmpty = !(data.unvested && data.unvested.length > 1);
				userData.Data.records = data.unvested;
			}
			res.render('admin/scc-reward/topic-reward', userData);
		},
	], callback);
}
=======
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
>>>>>>> 0eed1936eff358582b727c0065f12da8705cf19e

// TODO: duplicated code, compare to unvested and rejected, the process is the same, only difference is getData
function releasedRewards(req, res, callback) {
	async.waterfall([
		function (next) {
<<<<<<< HEAD
			TopicRewardController.getReleasedRewards(next);
		},
		function (data) {
			if (!Array.isArray(data.records)) {
				releasedData.Data.isEmpty = true;
				releasedData.Data.records = [];
			} else {
				releasedData.Data.isEmpty = !(data.records.length > 1);
				releasedData.Data.records = data.records;
			}

			res.render('admin/scc-reward/topic-reward-released', releasedData);
=======
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
>>>>>>> 0eed1936eff358582b727c0065f12da8705cf19e
		},
	], callback);
}

function rejectedRewards(req, res, callback) {
	async.waterfall([
		function (next) {
			TopicRewardController.getRejectedRewards(next);
		},
		function (data) {
			if (!Array.isArray(data.records)) {
				rejectedData.Data.isEmpty = true;
				rejectedData.Data.records = [];
			} else {
				rejectedData.Data.isEmpty = !(data.records.length > 1);
				rejectedData.Data.records = data.records;
			}
			res.render('admin/scc-reward/topic-reward-rejected', rejectedData);
		},
	], callback);
}

TopicRewardController.getUnvestedRewards = function (postType, modType, sortType, pageNo, pageSize, callback) {
	async.parallel({
			unvested: function (next) {
				scc.topicReward.getUnvestedRewards(postType, modType, sortType, pageNo, pageSize, next);
			},
		},
		callback);
};

TopicRewardController.getReleasedRewards = function (callback) {
	async.waterfall([
		function (next) {
			scc.topicReward.getReleasedRewards(next);
		},
	], callback);
};

TopicRewardController.getRejectedRewards = function (callback) {
	async.waterfall([
		function (next) {
			scc.topicReward.getRejectedRewards(next);
		},
	], callback);
};

TopicRewardController.releaseSCC = function (data, callback) {
	async.waterfall([
		function (next) {
			scc.topicReward.releaseSCC(data, next);
		},

	], callback);
};

TopicRewardController.modifySCCNum = function (data, callback) {
	async.waterfall([
		function (next) {
			scc.topicReward.modifySCCNum(data, next);
		},

	], callback);
};

TopicRewardController.rejectSCC = function (data, callback) {
	async.waterfall([
		function (next) {
			scc.topicReward.rejectSCC(data, next);
		},

	], callback);
};

TopicRewardController.restoreSCC = function (data, callback) {
	async.waterfall([
		function (next) {
			var id = 1;
			scc.topicReward.restoreSCC(id, next);
		},

	], callback);
};
