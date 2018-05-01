'use strict';

module.exports = function (mysqlClient, module) {
	module.newRow = function (model, conn, data, callback) {
		if (typeof model === 'string') {
			model = module.getModel('users');
		}
		model.create(conn, data, callback);
	};

	module.find = function (model, conn, querySql, callback) {
		model.find(conn, querySql, callback);
	};

	module.findById = function (model, conn, row_id, callback) {
		model.findById(conn, row_id, callback);
	};

	module.findAll = function (model, conn, callback) {
		model.findAll(conn, callback);
	};

	module.baseQuery = function (model, querySql) {
		return model.baseQuery(querySql);
	};
};
