'use strict';

module.exports = function (mysqlClient, module) {
	module.connect = function (customFunc, callback) {
		mysqlClient.connect(function (conn) {
			customFunc(conn, callback);
		}, function (err) {
			callback(err);
		});
	};

	module.getModel = function (tableName) {
		return mysqlClient.get(tableName).Table;
	};

	module.transaction = function (customFunc, callback) {
		mysqlClient.connect(function (conn) {
			mysqlClient.transaction(conn, function (conn) {
				customFunc(conn, callback);
			}, function (err) {
				callback(err);
			});
		});
	};

	module.ncursor = function (querySql, callback) {
		mysqlClient.cursor(querySql, callback);
	};

	module.format = function (sql, variable_binding) {
		return mysqlClient.format(sql, variable_binding);
	};
};
