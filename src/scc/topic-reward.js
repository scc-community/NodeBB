'use strict';

var async = require('async');
var mysql = require('../database/mysql');

var TopicReward = module.exports;

TopicReward.getTopicRewards = function (where, orderby, limit, callback) {
	mysql.pageQuery('topic_rewards', where, orderby, limit, callback);
};

TopicReward.createTopicReward = function (data, callback) {
	mysql.newRow('topic_rewards', data, callback);
};

TopicReward.bcreateTopicReward = function (data, callback) {
	var fieldNames = ['uid', 'reward_type', 'topic_id', 'topic_category', 'topic_title',
		'topic_words_count', 'topic_upvotes_count', 'date_posted', 'scc_autoed', 'scc_setted', 'scc_issued', 'publish_uid',
	];
	mysql.batchInsert('topic_rewards', fieldNames, data, null, callback);
};

TopicReward.updateTopicRewardsWithTxs = function (topicRewardData, txData, callback) {
	mysql.transaction(function (conn, next) {
		async.waterfall([
			function (next) {
				mysql.nfindById('topic_rewards', conn, topicRewardData.id, next);
			},
			function (row, next) {
				mysql.nupdateRow(row, conn, topicRewardData, next);
			},
			function (row, next) {
				mysql.nnewRow('txs', conn, txData, next);
			},
		],
		function (err) {
			if (err) {
				conn.rollback();
			} else {
				conn.commit();
			}
			conn.release();
			next(err);
		});
	}, callback);
};

TopicReward.getCount = function (callback) {
	mysql.query('SELECT COUNT(*) AS count FROM topic_rewards', null, callback);
};

TopicReward.getUnvestedRewards = function(postType, modType, sortType, pageNo, pageSize ,callback) {
	var sqlstr = "SELECT r.id as id, " +
				"r.uid as uid, " +
				"t.content as topic_category, " +
				"r.topic_id as topic_id, " +
				"r.topic_title as topic_title, " +
				"r.topic_words_count as topic_words_count, " +
				"r.topic_upvotes_count as topic_upvotes_count," +
				"r.date_posted as data_posted, " +
				"r.scc_autoed as scc_autoed," +
				"r.scc_setted as scc_setted," +
				"r.scc_autoed - ifnull(r.scc_setted, r.scc_autoed) != 0 as is_modified, " +
				"r.scc_issued as scc_issued " +
				"FROM topic_rewards r, reward_types t WHERE r.status=1 AND t.id=r.reward_type ";

	//tainted check, in case SQL injection, we should validate every input
	//check postType
	if(!/^\w{2,20}$/.test(postType)){
		callback(new Error("Invalid postType"), null);
	}
	if(postType !== "all") {
		sqlstr += " AND t.item='" + postType + "'";
	}

	//check modType
	if(!isNum(modType) || !isNum(sortType)) {
		callback(new Error("Invalid modType or pageNo"), null);
	}

	switch(modType){
		case 1:
			break;
		case 2:
			sqlstr += " AND r.scc_autoed - ifnull(r.scc_setted, r.scc_autoed) != 0 ";
			break;
		case 3:
			sqlstr += " AND r.scc_autoed - ifnull(r.scc_setted, r.scc_autoed) = 0 ";
			break;
	}
	//check sortType
	if(sortType == 1) {
		sqlstr += " ORDER BY scc_setted, scc_autoed DESC ";
	} else {
		sqlstr += " ORDER BY scc_setted, scc_autoed ASC ";
	}

	//Check pageSize
	if(!isNum(pageNo) || !isNum(pageSize)) {
		pageNo = 1;
		pageSize = 30;
	}

	pageNo = pageNo > 0 ? pageNo : 1;
	var startRecord = (pageNo - 1) * pageSize;

	sqlstr += " LIMIT " + startRecord + "," + pageSize;

	//winston.info(sqlstr);
	async.waterfall([
		function(next) {
			mysql.query(sqlstr, null, next);
		},
		function(records, next) {
			if(!records || !Array.isArray(records) || records.length < 1) {
				return callback(null, null);
			}
			//We need to read user name from redis for each user, this may cause performance issue
			//It's better to move user name to users table as well, so that we can get it via SQL directly
			async.each(records, function(item, next) {
				async.waterfall([
					function (next) {
						db.getObjectField('user:' + item.uid, 'username', next);
					},
					function (username, next) {
						item.author =  username;
						next();
					},
				], next);
			}, function(err) {
				callback(err, records);
			});
		}
	  ], callback
	);

};

TopicReward.getRejectedRewards = function(callback) {
	//TODO
	callback(null, null);
};


TopicReward.releaseSCC = function(data, callback) {
	var _ret = {};

	//data.records structure [{id:xx, uid:xxx, scc:xxx}]
	//TODO: update from DB
	_ret.code = 0;
	_ret.message = "Released " + data.totalSCC + " to users.";

	callback(null, _ret);
};

TopicReward.modifySCCNum = function(data, callback) {
	//TODO: data structure {Id: rewardsId, sccNum: NewNum, sccComment: Comment}, write to DB
	var _retScc = {code: 0, message: "Successfully."};

	callback(null, _retScc);
};

TopicReward.rejectSCC = function(data, callback) {
	//TODO: data schema: {Id: rewardId, reason: reasonId[0,1,2,3]
	// 0, poor quality, 1, copy, 2 unqualified 3, other
	var _retRej = {code: 0, message: "Succeed"};
	callback(null, _retRej);
};

TopicReward.restoreSCC = function(id, callback) {
	//TODO: restore rewardId, write to DB
	var _retRes = {code: 0, message: "Succeed."};

	callback(null, _retRes);
};

function isNum(input) {
	if(input == null) return false;
	return /^\d+$/.test(input);
}

