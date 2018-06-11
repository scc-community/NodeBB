'use strict';

var async = require('async');
var mysql = require('../database/mysql');
var utils = require('../utils');
var scc = require('../scc');
var user = require('../user');

var Base = require('./base');
var util = require('util');

var TopicReward = function () {
	this.tableName = 'topic_rewards';
};
util.inherits(TopicReward, Base);
var topicReward = new TopicReward();

TopicReward.newRows = function (datas, callback) {
	var fieldNames = ['uid', 'reward_type', 'topic_id', 'topic_category', 'topic_title',
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed', 'scc_setted', 'scc_issued', 'publish_uid',
	];
	mysql.batchInsert(this.tableName, fieldNames, datas, null, callback);
};

TopicReward.updateWithTxs = function (topicRewardData, txData, callback) {
	if (!txData.uid) {
		return callback(new Error('txs.uid is null'));
	}
	var data = {
		event: 'TopicReward.updateWithTxs',
		group_id: utils.generateUUID(),
		parameters: {
			topicReward: topicRewardData,
			tx: txData,
			oldSccToken: null,
			newSccToken: null,
			txs_id: null,
			err: null,
		},
		result: {},
	};

	async.waterfall([
		function (next) {
			scc.txLog.begin(data, next);
		},
		function (next) {
			mysql.transaction(function (conn, next) {
				async.waterfall([
					function (next) {
						mysql.nfindById(this.tableName, conn, topicRewardData.id, next);
					},
					function (row, next) {
						mysql.nupdateRow(row, conn, topicRewardData, next);
					},
					function (result, next) {
						data.result.topicReward = result;
						mysql.nnewRow('txs', conn, txData, next);
					},
					function (row, next) {
						data.result.tx = row._data;
						data.txs_id = row._data.id;
						next();
					},
				], function (err) {
					if (err) {
						conn.rollback();
					} else {
						conn.commit();
					}
					conn.release();
					next(err);
				}, next);
			}, next);
		},
		function (next) {
			scc.txLog.record(data, next);
		},
		function (next) {
			user.getSccToken(txData.uid, next);
		},
		function (scctoken, next) {
			data.oldSccToken = scctoken;
			user.incrSccToken(txData.uid, txData.scc, next);
		},
		function (scctoken, next) {
			data.newSccToken = scctoken;
			scc.txLog.record(data, next);
		},
	], function (err) {
		if (err) {
			data.err = {
				message: err.message,
				stack: err.stack,
			};
		}
		scc.txLog.end(data, callback);
	});
};

module.exports = topicReward;
