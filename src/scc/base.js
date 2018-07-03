'use strict';

var async = require('async');
var mysql = require('../database/mysql');

function Base() {}

Base.prototype.getRows = function (where, orderby, limit, callback) {
	mysql.pageQuery(this.tableName, where, orderby, limit, callback);
};

Base.prototype.newRow = function (conn, data, callback) {
	if (conn) {
		mysql.nnewRow(this.tableName, conn, data, callback);
	} else {
		mysql.newRow(this.tableName, data, callback);
	}
};

Base.prototype.deleteRowById = function (conn, id, callback) {
	this.deleteRows(conn, 'WHERE id = ?', id, callback);
};

Base.prototype.findRowById = function (conn, id, callback) {
	if (conn) {
		mysql.nfindById(this.tableName, conn, id, callback);
	} else {
		mysql.findById(this.tableName, id, callback);
	}
};

Base.prototype.deleteRows = function (conn, conditionSql, variable_binding, callback) {
	if (conn) {
		mysql.ndeleteRows(conn, this.tableName, conditionSql, variable_binding, callback);
	} else {
		mysql.deleteRows(this.tableName, conditionSql, variable_binding, callback);
	}
};

Base.prototype.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM ' + this.tableName, null, callback);
};

Base.prototype.updateRow = function (conn, data, callback) {
	var me = this;
	var submit = function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nfindById(me.tableName, conn, data.id, next);
			},
			function (row, next) {
				mysql.nupdateRow(row, conn, data, next);
			},
		], next);
	};
	if (conn) {
		submit(conn, callback);
	} else {
		mysql.connect(function (conn, next) {
			submit(conn, next);
		}, callback);
	}
};

module.exports = Base;
