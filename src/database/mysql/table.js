'use strict';

var mysql = require('node-mysql');

module.exports = function (mysqlClient, module) {
	module.newRow = function (model, data, callback) {
		module.connect(function (conn, next) {
			module.nnewRow(model, conn, data, next);
			conn.release();
		}, callback);
	};

	module.nnewRow = function (model, conn, data, callback) {
		if (typeof model === 'string') {
			model = module.getModel(model);
		}
		model.create(conn, data, callback);
	};

	module.find = function (model, data, callback) {
		module.connect(function (conn, next) {
			module.nfind(model, conn, data, next);
			conn.release();
		}, callback);
	};

	module.nfind = function (model, conn, querySql, callback) {
		if (typeof model === 'string') {
			model = module.getModel(model);
		}
		model.find(conn, querySql, callback);
	};

	module.findById = function (model, row_id, callback) {
		module.connect(function (conn, next) {
			module.nfindById(model, conn, row_id, next);
			conn.release();
		}, callback);
	};

	module.nfindById = function (model, conn, row_id, callback) {
		if (typeof model === 'string') {
			model = module.getModel(model);
		}
		model.findById(conn, row_id, callback);
	};

	module.findAll = function (model, row_id, callback) {
		module.connect(function (conn, next) {
			module.nfindAll(model, conn, next);
			conn.release();
		}, callback);
	};

	module.nfindAll = function (model, conn, callback) {
		if (typeof model === 'string') {
			model = module.getModel(model);
		}
		model.findAll(conn, callback);
	};

	module.nbaseQuery = function (model, sqlCondition, variable_binding) {
		if (typeof model === 'string') {
			model = module.getModel(model);
		}
		return model.baseQuery(sqlCondition, variable_binding);
	};

	module.pageQuery = function (model, where, orderby, limit, callback) {
		var sqlCondition = '';
		var lastLogicLength = 0;
		if (where && where.length > 0) {
			sqlCondition += ' WHERE ';
			for (var whereIndex = 0; whereIndex < where.length; whereIndex++) {
				var logic = where[whereIndex].logic || 'AND';
				lastLogicLength = logic.length;
				var compaser = where[whereIndex].compaser || '=';
				switch (compaser) {
				case 'IS NULL':
				case 'IS NOT NULL':
					sqlCondition += (' ' + where[whereIndex].key + ' ' + compaser + ' ' + logic);
					break;
				default:
					sqlCondition += (' ' + where[whereIndex].key + compaser + where[whereIndex].value + ' ' + logic);
					break;
				}
			}
			sqlCondition = sqlCondition.substring(0, sqlCondition.length - lastLogicLength);
		}
		if (orderby && orderby.length > 0) {
			for (var orderByIndex = 0; orderByIndex < orderby.length; orderByIndex++) {
				sqlCondition += (' ORDER BY ' + orderby[orderByIndex].key + ' ' + orderby[orderByIndex].value + ',');
			}
			sqlCondition = sqlCondition.substring(0, sqlCondition.length - 1);
		}
		if (limit) {
			sqlCondition += ' LIMIT ' + limit[0] + ',' + limit[1];
		}
		module.baseQuery(model, sqlCondition, null, callback);
	};

	module.baseQuery = function (model, sqlCondition, variable_binding, callback) {
		module.connect(function (conn, next) {
			var selectSql = module.nbaseQuery(model, sqlCondition, variable_binding);
			module.nfind(model, conn, selectSql, next);
			conn.release();
		}, callback);
	};

	module.pageQuery = function (model, where, orderby, limit, callback) {
		var sqlCondition = '';
		if (where && where.length > 0) {
			sqlCondition += ' WHERE ';
			var lastLogic = '';
			for (var whereIndex = 0; whereIndex < where.length; whereIndex++) {
				lastLogic = (where[whereIndex].logic || 'AND').toUpperCase();
				switch (lastLogic) {
				case 'AND':
				case 'OR':
					break;
				default:
					lastLogic = 'AND';
					break;
				}
				where[whereIndex].compaser = where[whereIndex].compaser || '=';
				if (where[whereIndex].key && where[whereIndex].value) {
					sqlCondition += (' ' + where[whereIndex].key + ' ' + where[whereIndex].compaser + ' ' + where[whereIndex].value);
					sqlCondition += (' ' + lastLogic);
				}
			}
			sqlCondition = sqlCondition.substring(0, sqlCondition.length - lastLogic.length);
		}
		if (orderby && orderby.length > 0) {
			sqlCondition += ' ORDER BY ';
			for (var orderByIndex = 0; orderByIndex < orderby.length; orderByIndex++) {
				var element = orderby[orderByIndex];
				for (var fieldName in element) {
					if (element.hasOwnProperty(fieldName)) {
						var item = element[fieldName];
						if (item && (item.toUpperCase() === 'DESC' || item.toUpperCase() === 'ASC')) {
							sqlCondition += (fieldName + ' ' + item + ',');
						}
					}
				}
			}
			sqlCondition = sqlCondition.substring(0, sqlCondition.length - 1);
		}
		if (limit) {
			sqlCondition += ' LIMIT ' + limit[0] + ',' + limit[1];
		}
		module.baseQuery(model, sqlCondition, null, callback);
	};

	module.nquery = function (conn, querySql, variable_binding, callback) {
		var sql = querySql;
		if (variable_binding !== null) {
			sql = mysql.DB.format(querySql, variable_binding);
		}
		conn.query(sql, callback);
	};

	module.query = function (querySql, variable_binding, callback) {
		module.connect(function (conn, next) {
			module.nquery(conn, querySql, variable_binding, next);
			conn.release();
		}, callback);
	};

	module.batchInsert = function (tableName, fieldsName, values, uniqueKey, callback) {
		// ref: https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
		// 'INSERT INTO users (uid) VALUES ? ON DUPLICATE KEY UPDATE uid = uid';
		// values format [[uid1],[uid2]]
		var sql = 'INSERT INTO ' + tableName + ' ( ';
		for (var index = 0; index < fieldsName.length; index++) {
			sql += fieldsName[index];
			if (index !== fieldsName.length - 1) {
				sql += ', ';
			}
		}
		sql += ' ) VALUES ? ';
		if (uniqueKey) {
			sql += 'ON DUPLICATE KEY UPDATE ' + uniqueKey + ' = ' + uniqueKey;
		}
		module.connect(function (conn, next) {
			conn.query(sql, [values], next);
			conn.release();
		}, callback);
	};

	module.nupdateRows = function (conn, tableName, data, conditionSql, variable_binding, callback) {
		if (!tableName) {
			callback(new Error('tableName error'));
		}

		var updateSql = 'UPDATE ' + tableName + ' SET ';
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				updateSql = updateSql + ' ' + key + ' = ' + data[key] + ' ,';
			}
		}
		updateSql[updateSql.length] = '';
		module.nQuery(conn, updateSql, conditionSql, variable_binding, callback);
	};

	module.updateRows = function (tableName, data, conditionSql, variable_binding, callback) {
		module.connect(function (conn, next) {
			module.nupdateRows(conn, tableName, data, conditionSql, variable_binding, next);
			conn.release();
		}, callback);
	};

	module.ndeleteRows = function (conn, tableName, conditionSql, variable_binding, callback) {
		if (!tableName) {
			callback(new Error('tableName error'));
		}
		var deleteSql = 'DELETE FROM ' + tableName + ' ';
		if (conditionSql) {
			deleteSql += conditionSql;
		}
		module.nquery(conn, deleteSql, variable_binding, callback);
	};

	module.deleteRows = function (tableName, conditionSql, variable_binding, callback) {
		module.connect(function (conn, next) {
			module.ndeleteRows(conn, tableName, conditionSql, variable_binding, next);
			conn.release();
		}, callback);
	};
};

