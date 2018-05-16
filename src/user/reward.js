'use strict';

var async = require('async');
var scc = require('../scc');

module.exports = function (User) {
	User.registerReward = function (rewardItem, uid, /* tx_no, */ params, callback) {
		var txData = {
			uid: uid,
			date_issued: new Date().toLocaleString(),
			// tx_no require fill data
		};
		txData = scc.tx.initRow('register', rewardItem, txData, params);
		if (txData.scc > 0) {
			async.waterfall([
				function (next) {
					scc.tx.createTx(txData, next);
				},
				function (row, next) {
					User.incrSccToken(uid, row._data.scc, next);
				},
				function (_, next) {
					next();
				},
			], function (err) {
				if (err) {
					// log
				}
				callback(err);
			});
		} else {
			return callback();
		}
	};
};
