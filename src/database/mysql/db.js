'use strict';

module.exports = function (mysqlClient, module) {
	module.connect = function (proc, callback) {
		mysqlClient.connect(proc, callback);
	};

	module.getModel = function (tableName) {
		return mysqlClient.get(tableName).Table;
	};

	module.transaction = function (proc, callback) {
		mysqlClient.transaction(proc, callback);
	};

	module.format = function (sql, variable_binding) {
		return mysqlClient.format(sql, variable_binding);
	};
};
