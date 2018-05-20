'use strict';

var async = require('async');

var Scc = module.exports;

Scc.rewardType = require('./scc/reward-type');
Scc.user = require('./scc/user');
Scc.manualReward = require('./scc/manual-reward');
Scc.topicReward = require('./scc/topic-reward');
Scc.tx = require('./scc/tx');
Scc.txLog = require('./scc/tx-log');

Scc.init = function (callback) {
	var me = this;
	async.parallel([
		async.apply(me.rewardType.init),
	], function (err) {
		callback(err);
	});
};
