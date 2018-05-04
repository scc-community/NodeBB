'use strict';

var async = require('async');

var Scc = module.exports;

Scc.rewardType = require('./scc/rewardType');
Scc.user = require('./scc/user');
Scc.manualReward = require('./scc/manualReward');
Scc.postReward = require('./scc/postReward');
Scc.tx = require('./scc/tx');

Scc.init = function (callback) {
	var me = this;
	async.parallel([
		async.apply(me.rewardType.init),
	], function (err) {
		callback(err);
	});
};
