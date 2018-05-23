'use strict';

var mysql = require('../database/mysql');
var utils = require('../utils');

var Tx = module.exports;

Tx.getTxs = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('txs', sqlCondition, variable_binding, callback);
};

Tx.createTx = function (data, callback) {
	mysql.newRow('txs', data, callback);
};

Tx.initDefaultRow = function () {
	var data = {
		transaction_uid: 0,
		date_issued: new Date().toLocaleString(),
		publish_uid: 0,
		transaction_type: '1',
		tx_no: utils.generateUUID(),
	};
	return data;
};

Tx.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM txs', null, callback);
};

Tx.getTransactionTypeText = function (transactionType) {
	switch (transactionType) {
	case '2':
		return '[[admin/scc-reward/index:outgoings]]';
	case '1':
		return '[[admin/scc-reward/index:income]]';
	default:
		return '[[admin/scc-reward/index:income]]';
	}
};
