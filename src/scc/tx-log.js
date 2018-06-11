'use strict';

var async = require('async');
var winston = require('winston');

var mysql = require('../database/mysql');
var Base = require('./base');
var util = require('util');

var TxLog = function () {
	this.tableName = 'tx_log';
};
util.inherits(TxLog, Base);
var txlog = new TxLog();

TxLog.newRow = function (data, callback) {
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
			winston.error('TxLog.newRow data.err:', data);
		}
		if (err) {
			winston.error('TxLog.newRow err:', data);
		}
		if (data.err) {
			return callback(data.err);
		}
		return callback(err);
	});
};

TxLog.record = function (data, callback) {
	data.method = '2';
	TxLog.newRow(data, callback);
};

TxLog.begin = function (data, callback) {
	data.method = '1';
	TxLog.newRow(data, callback);
};

TxLog.end = function (data, callback) {
	data.method = '3';
	TxLog.newRow(data, callback);
};

module.exports = txlog;
