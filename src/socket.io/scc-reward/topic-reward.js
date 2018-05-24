'use strict';

var async = require('async');
var utils = require('../../utils');
var db = require('../../database');
var scc = require('../../scc');

var TopicReward = module.exports;

var standardMemberKey = ['转载', '原创', '翻译'];

var checkAllowReward = function (cid, callback) {
	async.waterfall([
		function (next) {
			db.getObjectFields('category:' + cid, ['parentCid', 'isAllowReward'], next);
		},
		function (data, next) {
			if ((data.isAllowReward && data.isAllowReward === '1') || (!data.parentCid || data.parentCid === '0')) {
				return callback(null, data.isAllowReward && data.isAllowReward === '1');
			}
			checkAllowReward(data.parentCid, next);
		},
	], callback);
};

var getAvailableTopics = function (topicsRewards, callback) {
	var results = [];
	async.each(topicsRewards, function (topicReward, next) {
		var data = JSON.parse(topicReward);
		var key = 'topic:' + data.tid + ':tags';
		async.parallel({
			isAllowReward: async.apply(checkAllowReward, data.cid),
			isExistTag: async.apply(db.exists, key),
		}, function (err, receiveData) {
			if (receiveData.isAllowReward && receiveData.isExistTag) {
				async.waterfall([
					function (next) {
						db.isSetMembers(key, standardMemberKey, next);
					},
					function (exists, next) {
						if (exists[0] === true || exists[1] === true || exists[2] === true) {
							results.push(data);
						}
						next();
					},
				], next);
			} else {
				next(err);
			}
		}, next);
	}, function (err) {
		callback(err, results);
	});
};

function calcTopicWordCount(content) {
	var length = 0;
	var start = false;
	for (var index = 0; index < content.length; index++) {
		var code = content.charCodeAt(index);
		if (code <= 128 && code !== 32 && !start) {
			start = true;
		} else if (code === 32 && start) {
			length += 1;
			start = false;
		} else if (code > 128) {
			length += 1;
			start = false;
		}
	}
	return length;
}

var calcTopicReward = function (publishuid, topicsRewards, callback) {
	var results = [];
	async.each(topicsRewards, function (topicReward, next) {
		async.waterfall([
			function (next) {
				async.parallel({
					rewardtype: function (next) {
						var key = 'topic:' + topicReward.tid + ':tags';
						async.waterfall([
							function (next) {
								db.isSetMembers(key, standardMemberKey, next);
							},
							function (exists, next) {
								var rewardTypeResult = {};
								if (exists[0] === true) {
									rewardTypeResult = {
										id: scc.rewardType.rewardTypes['topic:reprint'].id,
										item: scc.rewardType.rewardTypes['topic:reprint'].item,
									};
								} else if (exists[1] === true) {
									rewardTypeResult = {
										id: scc.rewardType.rewardTypes['topic:original'].id,
										item: scc.rewardType.rewardTypes['topic:original'].item,
									};
								} else if (exists[2] === true) {
									rewardTypeResult = {
										id: scc.rewardType.rewardTypes['topic:translation'].id,
										item: scc.rewardType.rewardTypes['topic:translation'].item,
									};
								}
								next(null, rewardTypeResult);
							},
						], next);
					},
					postData: async.apply(db.getObjectFields, 'post:' + topicReward.pid, ['timestamp', 'upvotes', 'content']),
					topicData: async.apply(db.getObjectFields, 'topic:' + topicReward.tid, ['title']),
				}, function (err, receiveData) {
					var upvotes = parseInt(receiveData.postData.upvotes, 10) || 0;
					var postdate = new Date(parseInt(receiveData.postData.timestamp, 10)).toLocaleString();
					var autoscc = scc.rewardType.getScc('topic', receiveData.rewardtype.item, receiveData.postData.content.length) + upvotes;
					var data = [
						topicReward.uid,
						receiveData.rewardtype.id,
						topicReward.tid,
						topicReward.cid,
						receiveData.topicData.title,
						calcTopicWordCount(receiveData.postData.content),
						upvotes,
						postdate,
						autoscc,
						null,
						autoscc,
						publishuid,
					];
					next(err, data);
				});
			},
			function (data, next) {
				results.push(data);
				next(null);
			},
		], next);
	}, function (err) {
		callback(err, results);
	});
};

var cleanTopicRewards = function (topicsRewards, callback) {
	var items = [];
	for (var index = 0; index < topicsRewards.length; index++) {
		items.push(topicsRewards[index][2]);
	}
	db.deleteObjectFields('topics:rewardscheck', items, callback);
};

TopicReward.buildTopicsReward = function (socket, data, callback) {
	if (data && data.publish_uid) {
		async.waterfall([
			function (next) {
				db.getObject('topics:rewardscheck', next);
			},
			function (topicsRewards, next) {
				getAvailableTopics(topicsRewards, next);
			},
			function (topicsRewards, next) {
				calcTopicReward(data.publish_uid, topicsRewards, next);
			},
			function (topicsRewards, next) {
				if (topicsRewards.length === 0) {
					return next(new Error('[[admin/scc-reward/topic-reward:errors.empty-topic-reward]]'));
				}
				scc.topicReward.bcreateTopicReward(topicsRewards, function (err) {
					next(err, topicsRewards);
				});
			},
			function (topicsRewards, next) {
				cleanTopicRewards(topicsRewards, next);
			},
		], function (err) {
			callback = callback || function () {};
			if (err) {
				console.log(err);
			}
			callback(err);
		});
	} else {
		callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-uid]]'));
	}
};

TopicReward.sendReward = function (socket, data, callback) {
	if (!data || data.length === 0) {
		return callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-data]]'));
	}

	if (!data.publish_uid) {
		return callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-uid]]'));
	}

	if (data.memo && data.memo.trim.length > 40) {
		return callback(new Error('[[admin/scc-reward/topic-reward:alerts.memo.explanation, 40]]'));
	}

	if (data.memo) {
		data.memo = data.memo.trim();
	}
	var errStatusItem = [];
	async.eachSeries(data.topicRewards, function (item, next) {
		if (item.status !== '1') {
			errStatusItem.push(item);
			return next();
		}
		var topicRewardData = {
			id: item.id,
			status: '2',
			date_issued: new Date().toLocaleString(),
			memo: data.memo,
		};
		var txData = {
			uid: item.uid,
			transaction_uid: 0,
			publish_uid: data.publish_uid,
			transaction_type: '1',
			tx_no: utils.generateUUID(),
			reward_type: item.reward_type,
			date_issued: topicRewardData.date_issued,
			scc: item.scc_issued,
			content: item.content,
			memo: topicRewardData.memo,
		};
		scc.topicReward.updateTopicRewardsWithTxs(topicRewardData, txData, next);
	}, function (err) {
		if (err) {
			return callback(err);
		}
		// if (errStatusItem.length > 0) {
		// 	return callback(new Error('your issue some reward that it is not issued status:' + JSON.stringify(errStatusItem)));
		// }
		callback();
	});
};

TopicReward.removeReward = function (socket, data, callback) {
	if (!data || data.length === 0) {
		return callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-data]]'));
	}

	if (data.memo && data.memo.trim.length > 40) {
		return callback(new Error('[[admin/scc-reward/topic-reward:alerts.memo.explanation, 40]]'));
	}

	if (data.memo) {
		data.memo = data.memo.trim();
	}
	var errStatusItem = [];
	async.eachSeries(data.topicRewards, function (item, next) {
		if (item.status !== '1') {
			errStatusItem.push(item);
			return next();
		}
		var topicRewardData = {
			id: item.id,
			status: '3',
			memo: data.memo,
		};

		scc.topicReward.updateTopicRewards(topicRewardData, next);
	}, function (err) {
		if (err) {
			return callback(err);
		}
		// if (errStatusItem.length > 0) {
		// 	return callback(new Error('your issue some reward that it is not issued status:' + JSON.stringify(errStatusItem)));
		// }
		callback();
	});
};

TopicReward.restoreReward = function (socket, data, callback) {
	if (!data || data.length === 0) {
		return callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-data]]'));
	}
	var errStatusItem = [];
	async.eachSeries(data.topicRewards, function (item, next) {
		if (item.status !== '1') {
			errStatusItem.push(item);
			return next();
		}
		var topicRewardData = {
			id: item.id,
			status: '1',
			scc_setted: null,
			scc_issued: item.scc_autoed,
		};
		scc.topicReward.updateTopicRewards(topicRewardData, next);
	}, function (err) {
		if (err) {
			return callback(err);
		}
		// if (errStatusItem.length > 0) {
		// 	return callback(new Error('your issue some reward that it is not issued status:' + JSON.stringify(errStatusItem)));
		// }
		callback();
	});
};

TopicReward.modifyReward = function (socket, data, callback) {
	if (!data || data.length === 0) {
		return callback(new Error('[[admin/scc-reward/topic-reward:errors.invalid-data]]'));
	}

	if (!data.scc || parseInt(data.scc, 10) < 0) {
		return callback(new Error('scc can not less zero.'));
	}

	if (data.memo && data.memo.trim.length > 40) {
		return callback(new Error('[[admin/scc-reward/topic-reward:alerts.memo.explanation, 40]]'));
	}

	if (data.memo) {
		data.memo = data.memo.trim();
	}
	var errStatusItem = [];
	async.eachSeries(data.topicRewards, function (item, next) {
		if (item.status !== '1') {
			errStatusItem.push(item);
			return next();
		}
		var topicRewardData = {
			id: item.id,
			scc_setted: data.scc,
			scc_issued: data.scc,
			memo: data.memo,
		};

		scc.topicReward.updateTopicRewards(topicRewardData, next);
	}, function (err) {
		if (err) {
			return callback(err);
		}
		// if (errStatusItem.length > 0) {
		// 	return callback(new Error('your issue some reward that it is not issued status:' + JSON.stringify(errStatusItem)));
		// }
		callback();
	});
};
