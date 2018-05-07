'use strict';

var redis = require('redis');
var async = require('async');
var utils = require('../src/utils');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.keys('user:*', next);
	},
	function (res, next) {
		var arr1 = [];
		res.forEach(function (item) {
			var item1 = item.split(':', 2);
			if (item1[1].length < 20) {
				var item2 = item1.join(':');
				arr1.push(item2);
			}
		});
		console.log(arr1.length);
		arr1.forEach(function (item) {
			checkInviteToken(item);
		});
		next();
	},
], function (err) {
	if (err) {
		console.log(err);
	}
});

var count0 = 0;
var count1 = 0;
var count2 = 0;
var count3 = 0;
var count4 = 0;

function checkInviteToken(dbKey) {
	async.waterfall([
		function (next) {
			if (typeof next !== 'function') {
				console.log('1 next is not function!');
			}
			client.hget(dbKey, 'scctoken', next);
		},
		function (scctoken, next) {
			if (typeof next !== 'function') {
				console.log('2 next is not function!');
			}
			if (scctoken === 0) {
				count0 += 1;
				console.log(dbKey, scctoken, count0);
			} else if (scctoken > 0 && scctoken <= 10) {
				async.apply(client.hset, dbKey, 'scctoken', 300);
				async.apply(client.hset, dbKey, 'invitationcount', 0);
				count1 += 1;
				console.log(dbKey, scctoken, count1);
			} else if (scctoken > 10 && scctoken <= 100) {
				count2 += 1;
				console.log(dbKey, scctoken, count2);
			} else if (scctoken > 100 && scctoken <= 330) {
				count3 += 1;
				console.log(dbKey, scctoken, count3);
			} else if (scctoken > 330) {
				count4 += 1;
				console.log(dbKey, scctoken, count4);
			}
		},
	]);
}
