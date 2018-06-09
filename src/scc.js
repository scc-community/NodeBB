'use strict';

var async = require('async');

var Scc = module.exports;

Scc.rewardType = require('./scc/reward-type');
Scc.user = require('./scc/user');
Scc.manualReward = require('./scc/manual-reward');
Scc.topicReward = require('./scc/topic-reward');
Scc.tx = require('./scc/tx');
Scc.txLog = require('./scc/tx-log');

Scc.taskCategoryItem = require('./scc/task-category-item');
Scc.projectArchitect = require('./scc/project-architect');
Scc.project = require('./scc/project');
Scc.codeModule = require('./scc/code-module');
Scc.projectCodeModule = require('./scc/project-code-module');
Scc.vpcm = require('./scc/v-pcm');

Scc.init = function (callback) {
	var me = this;
	async.parallel([
		async.apply(me.rewardType.init),
	], function (err) {
		callback(err);
	});
};
