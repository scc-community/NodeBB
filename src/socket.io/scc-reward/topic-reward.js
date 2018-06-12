'use strict';

var async = require('async');
var utils = require('../../utils');
var db = require('../../database');
var scc = require('../../scc');

var TopicReward = module.exports;

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
				var standardMatchKey = {
					match: ['reprint', '转载', 'original', '原创', 'translation', '翻译'],
					order: ['reprint', 'original', 'translation'],
					reprint: {
						match: [0, 1],
					},
					original: {
						match: [2, 3],
					},
					translation: {
						match: [4, 5],
					},
				};
				async.waterfall([
					function (next) {
						db.isSetMembers(key, standardMatchKey.match, next);
					},
					function (exists, next) {
						for (var i = 0; i < standardMatchKey.order.length; i++) {
							var matchKey = standardMatchKey.order[i];
							var matchItems = standardMatchKey[matchKey].match;
							for (var j = 0; j < matchItems.length; j++) {
								var matchIndex = matchItems[j];
								if (exists[matchIndex]) {
									var rewardType = scc.rewardType.get('topic', matchKey);
									data.rewardType = {
										id: rewardType.id,
										item: rewardType.item,
									};
									results.push(data);
									return next();
								}
							}
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
					postData: async.apply(db.getObjectFields, 'post:' + topicReward.pid, ['timestamp', 'upvotes', 'content']),
					topicData: async.apply(db.getObjectFields, 'topic:' + topicReward.tid, ['title']),
				}, function (err, receiveData) {
					var upvotes = parseInt(receiveData.postData.upvotes, 10) || 0;
					var postdate = new Date(parseInt(receiveData.postData.timestamp, 10)).toLocaleString();
					var wordCount = calcTopicWordCount(receiveData.postData.content);
					var autoscc = scc.rewardType.getScc('topic', topicReward.rewardType.item, { wordCount: wordCount }) + upvotes;
					var data = [
						topicReward.uid,
						topicReward.rewardType.id,
						topicReward.tid,
						topicReward.cid,
						receiveData.topicData.title,
						wordCount,
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
				scc.topicReward.newRows(topicsRewards, function (err) {
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
		scc.topicReward.updateWithTxs(topicRewardData, txData, next);
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

		scc.topicReward.updateRow(null, topicRewardData, next);
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
		scc.topicReward.updateRow(null, topicRewardData, next);
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

		scc.topicReward.updateRow(null, topicRewardData, next);
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
