'use strict';

var mysql = require('../database/mysql');

var Project = module.exports;

Project.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('projects', sqlCondition, variable_binding, callback);
};

Project.newRow = function (data, callback) {
	mysql.newRow('projects', data, callback);
};

Project.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM projects', null, callback);
};
