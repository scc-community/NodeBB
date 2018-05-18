'use strict';

var redis = require('redis');
var async = require('async');
var mysql = require('../src/database/mysql');

var client = redis.createClient('6379', '127.0.0.1');

var userData = {};
var count = 0;

async.waterfall([
	function (next) {
		startMysql(next);
	},
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		mysql.deleteRows('users', null, null, next);
	},
	function (result, err, next) {
		client.keys('user:*', next);
	},
	function (res, next) {
		var arr1 = [];
		res.forEach(function (item) {
			var item1 = item.split(':', 3);
			if (item1.length === 2) {
				var item2 = item1.join(':');
				arr1.push(item2);
			}
		});
		console.log(arr1.length);
		async.eachSeries(arr1, function (item, next) {
			async.waterfall([
				function (next) {
					client.hgetall(item, next);
				},
				function (data, next) {
					userData = {
						uid: data.uid || 0,
					};
					mysql.newRow('users', userData, next);
				},
				function (row, next) {
					count += 1;
					console.log(count, row._data.uid);
					next();
				},
			], next);
		}, next);
	},
], function (err) {
	if (err) {
		console.log(err);
		process.exit(-1);
	} else {
		console.log('finish!');
		process.exit(0);
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
