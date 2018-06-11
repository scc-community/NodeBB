'use strict';

var async = require('async');
var mysql = require('../database/mysql');

function Base() {}

Base.prototype.getRows = function (where, orderby, limit, callback) {
	mysql.pageQuery(this.tableName, where, orderby, limit, callback);
};

Base.prototype.newRow = function (data, callback) {
	mysql.newRow(this.tableName, data, callback);
};

Base.prototype.deleteRows = function (conditionSql, variable_binding, callback) {
	mysql.deleteRows(this.tableName, conditionSql, variable_binding, callback);
};

Base.prototype.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM ' + this.tableName, null, callback);
};

Base.prototype.updateRow = function (row, callback) {
	mysql.connect(function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nfindById(this.tableName, conn, row.id, next);
			},
			function (row, next) {
				mysql.nupdateRow(row, conn, row, next);
			},
		], function (err) {
			conn.release();
			next(err);
		}, next);
	}, callback);
};

module.exports = Base;
