'use strict';

var redis = require('redis');
var async = require('async');
var mysql = require('../src/database/mysql');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		startMysql(next);
	},
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.zrange('username:uid', 0, -1, 'WITHSCORES', next);
	},
	function (results, next) {
		var data = [];
		for (var index = 0; index < results.length / 2; index++) {
			var item = [];
			item[0] = results[(index * 2) + 1];
			data[index] = item;
		}
		mysql.batchInsert('users', ['uid'], data, 'uid', next);
	},
], function (err) {
	if (err) {
		console.log(err);
		throw err;
	} else {
		console.log('finish');
	}
});

function startMysql(cb) {
	var path = require('path');
	var nconf = require('nconf');
	var configFile = path.resolve('', 'config.json');
	nconf.file({
		file: configFile,
	});

	async.waterfall([
		function (next) {
			mysql.init(next);
		},
	], cb);
}
