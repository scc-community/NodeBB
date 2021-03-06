'use strict';

var redis = require('redis');
var async = require('async');

var client = redis.createClient('6379', '127.0.0.1');
client.on('error', function (error) {
	console.log(error);
});

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.hset('user:0', 'username', '[[user:forum.username]]', next);
	},
	function (_, next) {
		client.del('scc:invition:uid', function (err) {
			if (err) {
				console.log(err);
			}
			console.log('delete scc:invition:uid');
			next();
		});
	},
	function (next) {
		client.keys('user:*', next);
	},
	function (res, next) {
		var arr1 = [];
		res.forEach(function (item) {
			var item1 = item.split(':', 2);
			if (item1[1].length > 20) {
				var item2 = item1.join(':');
				arr1.push(item2);
			}
		});
		async.eachSeries(arr1, function (item, next) {
			client.del(item, function (err) {
				if (err) {
					console.error(err);
				} else {
					console.info('delete long item');
				}
				next(err);
			});
		}, next);
	},
], function (err) {
	client.end(true);
	if (err) {
		console.error(err);
		throw err;
	} else {
		console.info('0 finish');
	}
});
