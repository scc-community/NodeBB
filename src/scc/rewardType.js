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
	var invitedExtra = function (invitationcount) {
		var factor = 90;
		var percent = 1;
		var scctoken = 0;

		if (invitationcount >= 70) {
			scctoken += factor;
		} else if (invitationcount === 60) {
			percent = 9;
			scctoken += factor * percent;
		} else if (invitationcount === 50) {
			percent = 8;
			scctoken += factor * percent;
		} else if (invitationcount === 40) {
			percent = 7;
			scctoken += factor * percent;
		} else if (invitationcount === 30) {
			percent = 6;
			scctoken += factor * percent;
		} else if (invitationcount === 20) {
			percent = 5;
			scctoken += factor * percent;
		} else if (invitationcount === 10) {
			percent = 4;
			scctoken += factor * percent;
		}
		return scctoken;
	};

	var rewardTypeKey = RewardType.getRewardTypeKey(category, item);
	var result = function () { return 0; };
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
	case 'register:invite_extra':
		result = invitedExtra;
		break;
	case 'topic:original':
		result = function (wordCount) { return Math.ceil(wordCount / 500) * 60; };
		break;
	case 'topic:reprint':
		result = function () { return 30; };
		break;
	case 'topic:translation':
		result = function (wordCount) { return Math.ceil(wordCount / 500) * 60; };
		break;
	case 'other:other':
		result = function () { return 0; };
		break;
	}
	return result(params);
};

RewardType.getContentTemplate = function (category, item) {
	var rewardTypeKey = this.getRewardTypeKey(category, item);
	var result;
	var rewardTypeItem = RewardType.rewardTypes[rewardTypeKey];
	if (item) {
		result = rewardTypeItem.content;
	}
	return result;
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

