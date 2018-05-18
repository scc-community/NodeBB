'use strict';

var redis = require('redis');
var async = require('async');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		// 获取用户uid
		client.zrange('username:uid', 0, -1, 'WITHSCORES', next);
	},
	function (results, next) {
		var data = [];
		for (var index = 0; index < results.length / 2; index++) {
			var item = [];
			item[0] = results[(index * 2) + 1];
			data[index] = item[0];
			console.log('item[0]', item[0]);
		}

		async.each(data, function iteratee(item) {
			async.waterfall([
				function (next) {
					console.log('item:' + item);
					client.hget('user:' + item, 'scctoken', next);
				},
				function (currentToken) {
					console.log('currentToken:' + currentToken);
					if ((currentToken != null || currentToken !== undefined) && (item != null || item !== undefined)) {
						// 根据SCC排序功能，score是用户scc个数，value是用户uid
						client.zadd('users:scctoken', currentToken, item);
					}
				},
			], next);
		});
	},
], function (err) {
	if (err) {
		console.log(err);
		throw err;
	} else {
		console.log('finish');
	}
});
