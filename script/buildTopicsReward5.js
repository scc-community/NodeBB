'use strict';

var redis = require('redis');
var async = require('async');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.del('topics:rewardscheck', function (err) {
			if (err) {
				console.log(err);
			}
			console.log('delete rewardscheck');
			next();
		});
	},
	function (next) {
		client.zrange('topics:tid', 0, -1, next);
	},
	function (results, next) {
		async.each(results, function (item, next) {
			async.waterfall([
				function (next) {
					client.hgetall('topic:' + item, next);
				},
				function (topicData, next) {
					var data = {
						pid: topicData.mainPid,
						uid: topicData.uid,
						cid: topicData.cid,
						tid: topicData.tid,
					};
					data = JSON.stringify(data);
					client.hset('topics:rewardscheck', item, data, next);
				},
			], next);
		}, next);
	},
], function (err) {
	client.end(true);
	if (err) {
		console.error(err);
		throw err;
	} else {
		console.info('finish');
	}
});
