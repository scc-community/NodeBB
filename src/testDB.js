'use strict'

var redis = require('redis');
var async = require('async');
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
		client.get('scc:invition:uid:7', next);
	},
	function(res, next) {
		console.log(res);
		client.hget('scc:invition:token', res, next);
	},
	function(res, next) {
		console.log(res);
		next();
	}
]);

// client.select('0', function(error){
// 	if(error) {
// 		console.log("123 " + error);
// 	} else {
// 		// set
// 		client.get('scc:invition:uid:7', function(error, res) {
// 				console.log(res);
// 				client.hset('scc:invition:token', res, 7, function (error, res) {
// 					console.log(res);
// 					client.end();
// 				});
// 		});
// 	}
// });
