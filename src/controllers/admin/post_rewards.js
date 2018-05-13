'use strict';

var async = require('async');
var sccMgr = require('../../post_rewards.js');
var winston = require('winston');


var postRewardsController = module.exports;

var userData = {Page: {isUnvested: true, isRejected: false, isReleased: false}, Data: {isEmpty: false}};
var releasedData = {Page: {isUnvested: false, isRejected: false, isReleased: true}, Data: {isEmpty: false}};
var rejectedData = {Page: {isUnvested: false, isRejected: true, isReleased: false}, Data: {isEmpty: false}};

postRewardsController.get = function (req, res, callback) {
	switch(req.params.q) {
		case "released":
			releasedRewards(req, res, callback);
			break;
		case "rejected":
			rejectedRewards(req, res, callback);
			break;
		default:
			unvestedRewards(req, res, callback);
			break;
	}

};

//Un-vested rewards
function unvestedRewards(req, res, callback) {
	//Get all unvested rewards records
	async.waterfall([
		function(next) {
			sccMgr.getUnvestedRewards(1, 1, 1, next);
		},
		function(data) {
		    if (!Array.isArray(data.unvested.records)) {
		    	userData.Data.isEmpty = true;
		    	userData.Data.records = [];
			} else {
				userData.Data.isEmpty = data.unvested.records.length > 1 ? false : true;
				userData.Data.records = data.unvested.records;
			}

			res.render('admin/sccmanage/post_rewards', userData);
		}
	], callback);

}

//TODO: duplicated code, compare to unvested and rejected, the process is the same, only difference is getData
function  releasedRewards(req, res, callback) {
	async.waterfall([
		function(next) {
			sccMgr.getReleasedRewards(next);
		},
		function(data) {
			if (!Array.isArray(data.records)) {
				releasedData.Data.isEmpty = true;
				releasedData.Data.records = [];
			} else {
				releasedData.Data.isEmpty = data.records.length > 1 ? false : true;
				releasedData.Data.records = data.records;
			}

			res.render("admin/sccmanage/post_rewards_released", releasedData);
		}

	], callback)


}

function rejectedRewards (req, res, callback) {
	async.waterfall([
		function(next) {
			sccMgr.getRejectedRewards(next);
		},
		function(data) {
			if (!Array.isArray(data.records)) {
				rejectedData.Data.isEmpty = true;
				rejectedData.Data.records = [];
			} else {
				rejectedData.Data.isEmpty = data.records.length > 1 ? false : true;
				rejectedData.Data.records = data.records;
			}

			res.render("admin/sccmanage/post_rewards_rejected", rejectedData);
		}

	], callback)

}
