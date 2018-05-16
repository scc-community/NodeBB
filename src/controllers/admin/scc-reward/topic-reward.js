'use strict';

var async = require('async');
var scc = require('../../../scc');
var winston = require("winston")
;
var TopicRewardController = module.exports;

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

// TODO: duplicated code, compare to unvested and rejected, the process is the same, only difference is getData
function releasedRewards(req, res, callback) {
	async.waterfall([
		function (next) {
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
