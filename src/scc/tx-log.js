'use strict';

var async = require('async');
var winston = require('winston');
var Base = require('./base');
var util = require('util');

var TxLog = function () {
	this.tableName = 'tx_log';
};
util.inherits(TxLog, Base);
var txlog = new TxLog();

TxLog.prototype.log = function (conn, data, callback) {
	var me = this;
	async.waterfall([
		function (next) {
			var rowData = {
				event: data.event,
				group_id: data.group_id,
				method: data.method,
				txs_id: data.txs_id,
				data: JSON.stringify(data),
			};
			me.newRow(conn, rowData, next);
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

TxLog.prototype.record = function (data, callback) {
	data.method = '2';
	this.log(null, data, callback);
};

TxLog.prototype.begin = function (data, callback) {
	data.method = '1';
	this.log(null, data, callback);
};

TxLog.prototype.end = function (data, callback) {
	data.method = '3';
	this.log(null, data, callback);
};

module.exports = txlog;
