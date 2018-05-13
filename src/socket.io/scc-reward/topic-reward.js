'use strict';

var scc = require('../../scc');

var TopicReward = module.exports;

TopicReward.getUnvested = function (socket, filters, callback) {
	scc.TopicReward.getUnvestedRewards(filters.postType, filters.modType, filters.sortType, callback);
};

TopicReward.releaseSCC = function (socket, data, callback) {
	scc.TopicReward.releaseSCC(data, callback);
};

TopicReward.modifySCCNum = function (socket, data, callback) {
	scc.TopicReward.modifySCCNum(data, callback);
};

TopicReward.rejectSCC = function (socket, data, callback) {
	scc.TopicReward.rejectSCC(data, callback);
};

TopicReward.restoreSCC = function (socket, id, callback) {
	scc.TopicReward.restoreSCC(id, callback);
};
