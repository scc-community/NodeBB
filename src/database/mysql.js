'use strict';

var winston = require('winston');
var nconf = require('nconf');
var mysql = require('./mysql/lib/node-mysql');
var schema = require('./mysql/schema');

var mysqlModule = module.exports;

mysqlModule.init = function (callback) {
	var conf = nconf.get('mysql');
	mysqlModule.client = new mysql.DB(conf);
	schema.init(mysqlModule.client);
	require('./mysql/db')(mysqlModule.client, mysqlModule);
	require('./mysql/table')(mysqlModule.client, mysqlModule);
	require('./mysql/row')(mysqlModule.client, mysqlModule);
	mysqlModule.client.connect(function (_, next) {	next(); }, function (err) {
		if (err) {
			winston.error('NodeBB could not connect to your mysql database. mysql returned the following error', err);
		}
		callback(err);
	});
};

mysqlModule.close = function () {
	mysqlModule.client.end();
};
