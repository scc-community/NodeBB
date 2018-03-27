'use strict'

var redis = require('redis');
var async = require('async');
var utils = require('../src/utils');

var client = redis.createClient('6379', '127.0.0.1');
client.on('error', function(error) {
	console.log(error);
})

async.waterfall([
	function(next) {
		client.select(0, next);
	},
	function (error,next) {
		console.log(error);
		client.keys('user:*', next);
	},
	function(res, next) {
		res.forEach(function (item, index) {
			checkInviteToken(item);
		});
		next();
	},
]);

function checkInviteToken(dbKey) {
	var userId;
	async.waterfall([
		function (next) {
			client.hget(dbKey, 'uid', next);
		},
		function (uid, next) {
			userId = uid;
			client.hget('scc:invition:uid', uid, next);
		},
		function (token, next) {
			if(!token) {
				createInviteToken(userId, next);
			}else {
				next(null, token);
			}
		},
		function (results, next) {
			if(!results) {
				console.log('USER:' + userId + ' TOKEN:' + results);
			}
			// next();
		}
	]);
}

function createInviteToken(uid, callback) {
	var token = utils.generateUUID();
	async.waterfall([
		function (next) {
			console.log(uid + ':' + token);
			client.hset('scc:invition:uid', uid, token, next);
		},
		function (results, next) {
			client.hset('scc:invition:token', token, uid, next);
		}
	], callback);
}