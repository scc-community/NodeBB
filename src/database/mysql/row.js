'use strict';

module.exports = function (mysqlClient, module) {
	module.update = function (row, conn, data, callback) {
		row.update(conn, data, callback);
	};

	module.getFieldValue = function (row, fieldName) {
		return row.get(fieldName);
	};

	module.getId = function (row) {
		return row.getId();
	};
};
