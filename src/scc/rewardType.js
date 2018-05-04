'use strict';

var mysql = require('../database/mysql');

var RewardType = module.exports;
RewardType.rewardTypes = {};

RewardType.init = function (callback) {
	RewardType.loadRewardTypes(callback);
};

RewardType.loadRewardTypes = function (callback) {
	callback = callback || function () {};
	var me = this;
	me.getRewardTypes(null, null, function (err, result) {
		if (err) {
			return callback(err);
		}
		result.forEach(function (element) {
			me.rewardTypes[element._data.category + ':' + element._data.item] = element._data;
		});
		callback(err, result);
	});
};

RewardType.getSccFunction = function (category, item, callback) {
	callback = callback || function () { };
	var me = this;

	var data = me.rewardTypes[category + ':' + item];
	if (!item || !item.scc) {
		return callback(new Error('item || item.scc is error'));
	}

	var funcDefine = JSON.parse(data.scc);
	var sccFunction = new (Function.prototype.bind.apply(Function, [null].concat(funcDefine.slice())))();
	callback(null, sccFunction);
};

RewardType.getRewardTypes = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('reward_types', sqlCondition, variable_binding, callback);
};

RewardType.createRewardType = function (data, callback) {
	mysql.newRow('reward_types', data, callback);
};

RewardType.updateRewardType = function (row, data, callback) {
	mysql.updateRow(row, data, callback);
};
