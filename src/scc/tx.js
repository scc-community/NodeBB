'use strict';

var mysql = require('../database/mysql');
var rewardType = require('./rewardType');
var utils = require('../utils');

var Tx = module.exports;

Tx.getTxs = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('txs', sqlCondition, variable_binding, callback);
};

Tx.createTx = function (data, callback) {
	mysql.newRow('txs', data, callback);
};

Tx.initRow = function (category, item, txData, sccParams) {
	var data = {
		uid: txData.uid,
		transaction_uid: 0,
		date_issued: txData.date_issued,
		memo: txData.memo,
		publish_uid: txData.publish_uid ? txData.publish_uid : 0,
		transaction_type: txData.transaction_type ? txData.transaction_type : '1',
		tx_no: txData.tx_no ? txData.tx_no : utils.generateUUID(),
		reward_type: rewardType.getRewardType(category, item),
		content: rewardType.getContentTemplate(category, item),
		scc: rewardType.getScc(category, item, sccParams),
	};
	return data;
};

Tx.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM txs', null, callback);
};

Tx.getTransactionTypeText = function (transactionType) {
	switch (transactionType) {
	case '2':
		return '[[admin/scc-reward/tx:outgoings]]';
	case '1':
		return '[[admin/scc-reward/tx:income]]';
	default:
		return '[[admin/scc-reward/tx:income]]';
	}
};
