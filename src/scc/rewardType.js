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

RewardType.getRewardTypeKey = function (category, item) {
	return category + ':' + item;
};

RewardType.getRewardType = function (category, item) {
	var key = this.getRewardTypeKey(category, item);
	return this.rewardTypes[key].id;
};

RewardType.getScc = function (category, item, params) {
	var rewardTypeKey = this.getRewardTypeKey(category, item);
	var result;
	switch (rewardTypeKey) {
	case 'register:register':
		result = function () { return 300; };
		break;
	case 'register:register_invited':
		result = function () { return 30; };
		break;
	case 'register:invite_friend':
		result = function () { return 90; };
		break;
	case 'post:orinial':
		result = this.getOrinialPostScc;
		break;
	case 'post:translation':
		result = this.getTranslationPostScc;
		break;
	case 'post:reprint':
		result = this.getReprintPostScc;
		break;
	case 'other:other':
		result = this.getRegisterScc;
		break;
	default:
		result = this.getOrinialPostScc;
	}
	return result(params);
};

RewardType.getContentTemplate = function (category, item) {
	var rewardTypeKey = this.getRewardTypeKey(category, item);
	switch (rewardTypeKey) {
	case 'register:register':
		return '[[rewardType:register]]';
	case 'register:register_invited':
		return '[[rewardType:register_invited]]';
	case 'register:invite_friend':
		return '[[rewardType:invited_friend]]';
	case 'post:orinial':
		return '[[rewardType:orinial]]';
	case 'post:translation':
		return '[[rewardType:translation]]';
	case 'post:reprint':
		return '[[rewardType:reprint]]';
	case 'other:other':
		return '[[rewardType:other]]';
	}
	return '';
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

