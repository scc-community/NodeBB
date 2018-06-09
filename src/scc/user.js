'use strict';

var mysql = require('../database/mysql');

var User = module.exports;

User.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('users', sqlCondition, variable_binding, callback);
};

User.newRow = function (data, callback) {
	var user = { uid: data.uid };
	mysql.newRow('users', user, callback);
};

User.deleteRow = function (uid, callback) {
	mysql.deleteRows('users', 'WHERE uid = ' + uid, callback);
};

User.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM users', null, callback);
};
