'use strict';

module.exports = function (mysqlClient, module) {
	module.updateRow = function (row, data, callback) {
		module.connect(function (conn, next) {
			module.nupdateRow(row, conn, data, next);
		}, callback);
	};

	module.nupdateRow = function (row, conn, data, callback) {
		row.update(conn, data, callback);
	};

	module.ndeleteRow = function (row, conn, callback) {
		var deleteSql = 'DELETE FROM ' + row._table.getName + ' WHERE ' + row.getId() + ' = ' + row.get(row.getId());
		module.nQuery(conn, deleteSql, null, null, callback);
	};

	module.deleteRow = function (row, data, callback) {
		module.connect(function (conn, next) {
			module.ndeleteRow(row, conn, next);
		}, callback);
	};

	module.getFieldValue = function (row, fieldName) {
		return row.get(fieldName);
	};

	module.getId = function (row) {
		return row.getId();
	};
};
