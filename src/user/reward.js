'use strict';

var async = require('async');
var scc = require('../scc');

module.exports = function (User) {
	User.registerReward = function (rewardItem, uid, /* tx_no, */ callback) {
		var txData = {
			uid: uid,
			date_issued: new Date().toLocaleString(),
			// tx_no require fill data
		};

		async.waterfall([
			function (next) {
				txData = scc.tx.initRow('register', rewardItem, txData);
				scc.tx.createTx(txData, next);
			},
			function (row, next) {
				User.incrScctoken(uid, row._data.scc, next);
			},
			function (scc, next) {
				next();
			},
		], callback);
	};
};
