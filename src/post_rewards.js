'use strict';
var async = require('async');
var dataProvider = require("./scc/topicReward.js");
var SccMgr = module.exports;

SccMgr.getUnvestedRewards = function(postType, modType, sortType, callback) {
	async.parallel({
		unvested: function(next) {
			dataProvider.getUnvestedRewards(postType, modType, sortType, next);
		}
		},
		callback);
};

SccMgr.getReleasedRewards = function(callback) {
	async.waterfall([
		function(next) {
			dataProvider.getReleasedRewards(next);
		}
	], callback);
};

SccMgr.getRejectedRewards = function(callback) {
	async.waterfall([
		function(next) {
			dataProvider.getRejectedRewards(next);
		}
	], callback);
};

SccMgr.releaseSCC = function(data, callback) {
	async.waterfall([
		function (next) {
			dataProvider.releaseSCC(data, next);
		}

	], callback);
};

SccMgr.modifySCCNum = function(data, callback) {
	async.waterfall([
		function (next) {
			dataProvider.modifySCCNum(data, next);
		}

	], callback);
};

SccMgr.rejectSCC = function(data, callback) {
	async.waterfall([
		function (next) {
			dataProvider.rejectSCC(data, next);
		}

	], callback);
};

SccMgr.restoreSCC = function(data, callback) {
	async.waterfall([
		function (next) {
			dataProvider.restoreSCC(id, next);
		}

	], callback);
};



