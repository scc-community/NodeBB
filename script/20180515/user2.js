'use strict';

var redis = require('redis');
var async = require('async');

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
			var item1 = item.split(':', 3);
			if (item1.length === 2) {
				var item2 = item1.join(':');
				arr1.push(item2);
			}
		});
		async.eachSeries(arr1, function (item, next) {
			checkInviteToken(item, next);
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

var count = 0;
function checkInviteToken(dbKey, cb) {
	async.waterfall([
		function (next) {
			if (typeof next !== 'function') {
				console.log('1 next is not function!');
			}
			client.hgetall(dbKey, next);
		},
		function (data, next) {
			if (typeof next !== 'function') {
				console.log('2 next is not function!');
			}
			if (data.token && data['email:confirmed'] === '1') {
				client.hset(dbKey, 'scctoken', data.token, next);
			} else {
				client.hset(dbKey, 'scctoken', 0, next);
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				console.log('3 next is not function!');
			}
			if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'token', next);
		},
		function (token, next) {
			if (typeof next !== 'function') {
				console.log('4 next is not function!');
			}
			if (token) {
				client.hdel(dbKey, 'token', next);
			} else {
				next();
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('7 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('5 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'sccInvitationNumber', next);
		},
		function (sccInvitationNumber, next) {
			if (typeof next !== 'function') {
				console.log('6 next is not function!');
			}
			if (sccInvitationNumber) {
				client.hset(dbKey, 'invitationcount', sccInvitationNumber, next);
			} else {
				client.hset(dbKey, 'invitationcount', 0, next);
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('7 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('7 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'sccInvitationNumber', next);
		},
		function (sccInvitationNumber, next) {
			if (typeof next !== 'function') {
				console.log('8 next is not function!');
			}
			if (sccInvitationNumber) {
				client.hdel(dbKey, 'sccInvitationNumber', next);
			} else {
				next();
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('9 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('9 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'sccInviteToken', next);
		},
		function (sccInviteToken, next) {
			if (typeof next !== 'function') {
				console.log('10 next is not function!');
			}
			if (sccInviteToken) {
				client.hset(dbKey, 'invitedcode', sccInviteToken, next);
			} else {
				next();
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('9 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('11 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'sccInviteToken', next);
		},
		function (sccInviteToken, next) {
			if (typeof next !== 'function') {
				console.log('12 next is not function!');
			}
			if (sccInviteToken !== null) {
				client.hdel(dbKey, 'sccInviteToken', next);
			} else {
				next();
			}
		},
		function (err, next) {
			if (typeof next !== 'function') {
				// console.log('9 next is not function!');
				if (next) {
					console.log(next);
				}
				next = err;
				if (typeof next !== 'function') {
					console.log('13 next is not function!');
				}
			} else if (err) {
				console.log(err);
			}
			client.hget(dbKey, 'invitationcode', next);
		},
		function (invitationcode, next) {
			console.log(dbKey + ':' + count + ':invitationcode:' + invitationcode);
			if (typeof next !== 'function') {
				console.log('14 next is not function!');
			}
			if (invitationcode) {
				count += 1;
				console.log(dbKey + ':' + count);
				next();
			} else {
				client.hset(dbKey, 'invitationcode', utils.generateUUID(), function (err) {
					if (err) {
						console.log(err);
					}
					count += 1;
					console.log(dbKey + ':' + count);
					next();
				});
			}
		},
	], cb);
}
