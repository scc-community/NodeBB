'use strict'

var redis = require('redis');
var async = require('async');
var utils = require('../src/utils');

// var oriClient = redis.createClient('6379', '127.0.0.1');
// var dstClient = redis.createClient('8001', '172.24.178.114');


async.waterfall([
	function (next) {
		next();
	},
], function (err) {
	if (err) {
		console.log(err);
	}else {
		console.log("finish");
	}
});

