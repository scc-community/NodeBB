'use strict';

var mysql = require('../database/mysql');

var Base = require('./base');
var util = require('util');

var User = function () {
	this.tableName = 'users';
};
util.inherits(User, Base);
var user = new User();

User.prototype.deleteRowById = function (conn, uid, callback) {
	this.deleteRows(conn, 'WHERE uid = ?', uid, callback);
};

module.exports = user;
