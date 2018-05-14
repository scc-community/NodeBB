'use strict';

var async = require('async');
var winston = require('winston');
var nconf = require('nconf');
var semver = require('semver');
var mysql = require('node-mysql');
var schema = require('./mysql/schema');

var mysqlModule = module.exports;

mysqlModule.init = function (next) {
	var conf = nconf.get('mysql');
	mysqlModule.client = new mysql.DB(conf);
	mysqlModule.client.connect(function () {
		schema.init(mysqlModule.client);
		require('./mysql/db')(mysqlModule.client, mysqlModule);
		require('./mysql/table')(mysqlModule.client, mysqlModule);
		require('./mysql/row')(mysqlModule.client, mysqlModule);
		return next();
	}, function (err) {
		winston.error('NodeBB could not connect to your mysql database. mysql returned the following error', err);
		return next(err);
	});
};

mysqlModule.checkCompatibility = function (next) {
	async.waterfall([
		function (next) {
			mysqlModule.info(mysqlModule.client, next);
		},
		function (info, next) {
			mysqlModule.checkCompatibilityVersion(info.mysql_version, next);
		},
	], next);
};

mysqlModule.checkCompatibilityVersion = function (version, next) {
	if (semver.lt(version, '5.7.0')) {
		return next(new Error('Your mysql version is not new enough to support NodeBB, please upgrade mysql to v2.8.9 or higher.'));
	}
	if (typeof next === 'function') {
		next();
	}
};

mysqlModule.close = function () {
	mysqlModule.client.end();
};

mysqlModule.info = function (cxn, next) {
	if (!cxn) {
		return next();
	}
	cxn.connect(function (conn) {
		conn.query('select version() as mysql_version', function (_, res) {
			next(null, res[0]);
		});
	});
};

mysqlModule.handleError = function (err, res, startTime) {
	try {
		if (global.env === 'development' && typeof startTime === 'object') {
			winston.log('time spent: ', new Date() - startTime);
		}
		if (err) {
			winston.error(err);
		} else if (global.env === 'development') {
			winston.info(res);
		}
	} catch (e) {
		winston.error(e.stack);
	} finally {
		mysqlModule.client.end();
	}
};

mysqlModule.helpers = mysqlModule.helpers || {};
