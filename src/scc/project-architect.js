'use strict';

var mysql = require('../database/mysql');

var ProjectArchitect = module.exports;

ProjectArchitect.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('project_architects', sqlCondition, variable_binding, callback);
};

ProjectArchitect.newRow = function (data, callback) {
	mysql.newRow('project_architects', data, callback);
};
