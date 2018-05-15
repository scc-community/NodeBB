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
		content: manualRewardData.content,
		memo: manualRewardData.memo,
	};

	scc.manualReward.createManualRewardWithTxs(manualRewardData, txsData, function (err) {
		callback(err);
	});
};

ManualReward.getAllRewardTypes = function (socket, callback) {
	function recursive(rewardtype, categoriesData) {
		var data = {};
		data.value = rewardtype.id;
		data.text = rewardtype.content;
		if (rewardtype.category === 'other' && rewardtype.item === 'other') {
			data.selected = true;
		}
		categoriesData.push(data);
	}

	var rewardtypesData = [];
	scc.rewardType.rewardTypeList.forEach(function (rewardtype) {
		recursive(rewardtype, rewardtypesData);
	});
	var data = {
		allrewardtypes: rewardtypesData,
	};
	callback(data);
};
