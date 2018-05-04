'use strict';

var mysql = require('../database/mysql');

var Tx = module.exports;

Tx.getTxs = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('txs', sqlCondition, variable_binding, callback);
};

Tx.createTx = function (data, callback) {
	mysql.newRow('txs', data, callback);
};

