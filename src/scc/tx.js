'use strict';

var utils = require('../utils');
var Base = require('./base');
var util = require('util');

var Tx = function () {
	this.tableName = 'txs';
};
util.inherits(Tx, Base);
var tx = new Tx();

Tx.prototype.initRow = function () {
	var data = {
		transaction_uid: 0,
		date_issued: new Date().toLocaleString(),
		publish_uid: 0,
		transaction_type: '1',
		tx_no: utils.generateUUID(),
	};
	return data;
};

Tx.prototype.getTransactionTypeText = function (transactionType) {
	switch (transactionType) {
	case '2':
		return '[[admin/scc-reward/index:outgoings]]';
	case '1':
		return '[[admin/scc-reward/index:income]]';
	default:
		return '[[admin/scc-reward/index:income]]';
	}
};

module.exports = tx;
