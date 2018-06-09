'use strict';

var mysql = require('../database/mysql');

var Vpcm = module.exports;

Vpcm.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('task_category_items', sqlCondition, variable_binding, callback);
};

