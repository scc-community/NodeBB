'use strict';

var async = require('async');
var scc = require('../scc');

module.exports = function (User) {
	User.registerReward = function (rewardItem, uid, sccParams, data, callback) {
		data = data || {};
		data.registerReward = {
			rewardItem: rewardItem,
			uid: uid,
		};
		var initTxData = User.buildTxRow(rewardItem, uid, sccParams, scc.tx.initDefaultRow());
		data.registerReward.initTxData = initTxData;
		if (initTxData.scc > 0) {
			async.waterfall([
				function (next) {
					User.getSccToken(uid, next);
				},
				function (oldSccToken, next) {
					data.registerReward.oldSccToken = oldSccToken;
					scc.tx.createTx(initTxData, next);
				},
				function (row, next) {
					data.registerReward.createTxData = row._data;
					data.txs_id = row._data.id;
					User.incrSccToken(uid, row._data.scc, next);
				},
				function (newSccToken, next) {
					data.registerReward.newSccToken = newSccToken;
					next();
				},
			], function (err) {
				callback(err);
			});
		} else {
			data.txs_id = null;
			return callback();
		}
	};

	User.buildTxRow = function (rewardItem, uid, sccParams, data) {
		var category = 'register';
		data.uid = uid;
		data.reward_type = scc.rewardType.getRewardType(category, rewardItem);
		data.content = scc.rewardType.getContentTemplate(category, rewardItem);
		data.scc = scc.rewardType.getScc(category, rewardItem, sccParams);
		return data;
	};
};
