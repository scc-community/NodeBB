'use strict';

var mysql = require('../database/mysql');

var Vpcm = module.exports;

Vpcm.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('v_pcm', sqlCondition, variable_binding, callback);
};

Vpcm.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM v_pcm', null, callback);
};
