'use strict';

var mysql = require('../database/mysql');

var CodeModule = module.exports;

CodeModule.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('code_modules', sqlCondition, variable_binding, callback);
};

CodeModule.newRow = function (data, callback) {
	mysql.newRow('code_modules', data, callback);
};
