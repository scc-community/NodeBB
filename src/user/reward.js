'use strict';

var async = require('async');
var scc = require('../scc');

module.exports = function (User) {
	User.registerReward = function (rewardItem, uid, params, data, callback) {
		data = data || {};
		data.registerReward = {
			rewardItem: rewardItem,
			params: params,
			uid: uid,
			txs_id: null,
			oldSccToken: null,
			createTxData: null,
			newSccToken: null,
		};
		var initTxData = User.initTxRow(rewardItem, uid, params, scc.tx.initRow());
		data.registerReward.initTxData = initTxData;
		if (initTxData.scc > 0) {
			async.waterfall([
				function (next) {
					User.getSccToken(uid, next);
				},
				function (oldSccToken, next) {
					data.registerReward.oldSccToken = oldSccToken;
					User.initTxContent(rewardItem, params, next);
				},
				function (content, next) {
					initTxData.content += content;
					scc.tx.nowRow(initTxData, next);
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
			return callback();
		}
	};

	User.initTxRow = function (rewardItem, uid, params, data) {
		var category = 'register';
		data.uid = uid;
		var rewardType = scc.rewardType.get(category, rewardItem);
		data.reward_type = rewardType.id;
		data.content = rewardType.content;
		data.scc = scc.rewardType.getScc(category, rewardItem, params);
		return data;
	};

	User.initTxContent = function (rewardItem, params, callback) {
		var result = '';
		var uid = '';
		switch (rewardItem) {
		case 'register_invited':
			uid = params.invitedUID;
			break;
		case 'invite_friend':
		case 'invite_extra':
			uid = params.inviteID;
			break;
		}
		if (!uid) {
			return callback(null, result);
		}
		async.waterfall([
			function (next) {
				User.getUserFields(uid, ['username', 'userslug'], next);
			},
			function (userData, next) {
				result = '<a href="/user/' + userData.userslug + '">(' + userData.username + ')</a>';
				next(null, result);
			},
		], callback);
	};
};
