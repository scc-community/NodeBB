'use strict';

var scc = require('../../scc');
var utils = require('../../utils');

var ManualReward = module.exports;

ManualReward.createManualRewardWithTxs = function (socket, manualRewardData, callback) {
	if (!manualRewardData) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	manualRewardData.date_issued = new Date().toLocaleString();

	var txsData = {
		uid: manualRewardData.uid,
		transaction_uid: 0,
		publish_uid: manualRewardData.publish_uid,
		transaction_type: '1',
		tx_no: utils.generateUUID(),
		reward_type: manualRewardData.reward_type,
		date_issued: manualRewardData.date_issued,
		scc: manualRewardData.scc_setted,
	};
	if (manualRewardData.content) {
		txsData.content = manualRewardData.content.trim();
	}
	if (manualRewardData.memo) {
		txsData.memo = manualRewardData.memo.trim();
	}
	scc.manualReward.newRowWithTxs(manualRewardData, txsData, function (err) {
		callback(err);
	});
};

ManualReward.getAllRewardTypes = function (socket, callback) {
	var category = null;
	var withAll = false;
	var selectedItem = {
		category: 'other',
		item: 'other',
	};
	var rewardtypesData = scc.rewardType.getOptions(category, withAll, selectedItem);
	var data = {
		allrewardtypes: rewardtypesData,
	};
	callback(data);
};
