'use strict';

var redis = require('redis');
var async = require('async');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.del('scc:invition:token', function (err) {
			if (err) {
				console.log(err);
			}
			console.log('delete scc:invition:token');
			next();
		});
	},
	function (next) {
		client.del('invitationcode:uid', function (err) {
			if (err) {
				console.log(err);
			}
			console.log('delete invitationcode:uid');
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
	client.end(true);
	if (err) {
		console.error(err);
		throw err;
	} else {
		console.info('3 finish');
	}
});

var count = 0;
function checkInviteToken(dbKey) {
	var vuid;
	async.waterfall([
		function (next) {
			client.hget(dbKey, 'uid', next);
		},
		function (uid, next) {
			vuid = uid;
			// console.log(uid);
			next();
		},
		function (next) {
			client.hget(dbKey, 'invitationcode', next);
		},
		function (invitationcode, next) {
			if (!vuid) {
				return next();
			}
			client.hset('invitationcode:uid', invitationcode, vuid, function (err) {
				if (err) {
					console.log(err);
				}
				count += 1;
				console.log(dbKey, vuid, invitationcode, count);
				next();
			});
		},
	]);
}
