'use strict';

var scc = require('../../scc');

var TopicReward = module.exports;

TopicReward.getUnvested = function (socket, filters, callback) {
	scc.topicReward.getUnvestedRewards(filters.topicType, filters.modType, filters.sortType, filters.pageNo, filters.pageSize, callback);
};

TopicReward.releaseSCC = function (socket, data, callback) {
	scc.topicReward.releaseSCC(data, callback);
};

TopicReward.modifySCCNum = function (socket, data, callback) {
	scc.topicReward.modifySCCNum(data, callback);
};

TopicReward.rejectSCC = function (socket, data, callback) {
	scc.topicReward.rejectSCC(data, callback);
};

TopicReward.restoreSCC = function (socket, id, callback) {
	scc.topicReward.restoreSCC(id, callback);
};
