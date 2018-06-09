'use strict';

var mysql = require('../database/mysql');

var ProjectCodeModule = module.exports;

ProjectCodeModule.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('projects_code_modules', sqlCondition, variable_binding, callback);
};

ProjectCodeModule.newRow = function (data, callback) {
	mysql.newRow('projects_code_modules', data, callback);
};
