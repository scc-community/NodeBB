'use strict';

var async = require('async');

module.exports = function (mysqlClient, module) {
	module.nativeConnect = function (successCallback, errorCallback) {
		mysqlClient.connect(successCallback, errorCallback);
	};

	module.connect = function (customFunc, callback) {
		async.waterfall([
			function (next) {
				module.nativeConnect(function (conn) {
					next(null, conn);
				}, function (err) {
					next(err);
				});
			},
			function (conn, next) {
				customFunc(conn, next);
			},
		], callback);
	};

	module.getModel = function (tableName) {
		return mysqlClient.get(tableName).Table;
	};

	module.transaction = function (callback) {
		mysqlClient.transaction(null, callback);
	};

	module.cursor = function (querySql, callback) {
		mysqlClient.cursor(querySql, callback);
	};

	module.format = function (sql, params) {
		mysqlClient.format(sql, params);
	};
};
