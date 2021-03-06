'use strict';

var async = require('async');
var winston = require('winston');

var mysql = require('../database/mysql');

var TxLog = module.exports;

TxLog.createTxLog = function (data, callback) {
	async.waterfall([
		function (next) {
			mysql.newRow('tx_log', {
				event: data.event,
				group_id: data.group_id,
				method: data.method,
				txs_id: data.txs_id,
				data: JSON.stringify(data),
			}, next);
		},
	], function (err) {
		if (data.err) {
			winston.error('TxLog.createTxLog data.err:', data);
		}
		if (err) {
			winston.error('TxLog.createTxLog err:', data);
		}
		if (data.err) {
			return callback(data.err);
		}
		return callback(err);
	});
};

TxLog.record = function (data, callback) {
	data.method = '2';
	TxLog.createTxLog(data, callback);
};

TxLog.begin = function (data, callback) {
	data.method = '1';
	TxLog.createTxLog(data, callback);
};

TxLog.end = function (data, callback) {
	data.method = '3';
	TxLog.createTxLog(data, callback);
};
