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
		for (var key in results) {
			if (results.hasOwnProperty(key)) {
				checkInviteToken(key, results[key]);
			}
		}
		next();
	},
], function (err) {
	if (err) {
		console.log(err);
		process.exit(-1);
	}else {
		console.log("finish!");
		process.exit(0);
	}
});

var count = 0;
function checkInviteToken(key, value) {
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
	]);
}
