'use strict';

var redis = require('redis');
var async = require('async');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.hgetall('scc:invition:token', next);
	},
	function (results, next) {
		var arr1 = [];
		var arr2 = [];
		var arr3 = [];
		var index = 0;
		for (var key in results) {
			if (results.hasOwnProperty(key)) {
				arr1.push(key);
				arr2.push(results[key]);
				arr3.push(index);
				index += 1;
			}
		}
		async.eachSeries(arr3, function (index, next) {
			var key = arr1[index];
			var value = arr2[index];
			checkInviteToken(key, value, next);
		}, next);
	},
], function (err) {
	client.end(true);
	if (err) {
		console.error(err);
		throw err;
	} else {
		console.info('1 finish');
	}
});

var count = 0;
function checkInviteToken(key, value, cb) {
	async.waterfall([
		function (next) {
			client.exists('user:' + value, next);
		},
		function (exist, next) {
			if (exist) {
				count += 1;
				console.log('user:' + value + ':' + 'invitationcode' + ':' + key + ':' + count);
				client.hset('user:' + value, 'invitationcode', key, next);
			} else {
				next(null, 0);
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('1 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('1 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			next();
		},
	], cb);
}
