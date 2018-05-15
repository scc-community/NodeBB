'use strict';

var redis = require('redis');
var async = require('async');
var utils = require('../src/utils');
var mysql = require('../src/database/mysql');

var client = redis.createClient('6379', '127.0.0.1');

async.waterfall([
	function (next) {
		startMysql(next);
	},
	function (next) {
		client.select(0, next);
	},
	function (status, next) {
		client.keys('user:*', next);
	},
	function (results, next) {
		async.each(results, function (item, next) {
			async.waterfall([
				function (next) {
					client.hgetall(item, next);
				},
				function (data, next) {
					var txData = {
						uid: data.uid,
						date_issued: new Date().toLocaleString(),
						transaction_uid: 0,
						memo: 'update scc token for new function',
						publish_uid: 0,
						transaction_type: '1',
						tx_no: utils.generateUUID(),
						reward_type: 999,
						content: 'set scc token for last scc token',
						scc: data.scctoken || 0,
					};
					mysql.newRow('txs', txData, next);
				},
			], next);
		}, next);
	},
], function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('finish');
	}
});

function startMysql(cb) {
	var path = require('path');
	var nconf = require('nconf');
	var configFile = path.resolve('', 'config.json');
	nconf.file({
		file: configFile,
	});

	async.waterfall([
		function (next) {
			mysql.init(next);
		},
	], cb);
}
