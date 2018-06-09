'use strict';

var mysql = require('../database/mysql');

var RewardType = module.exports;
RewardType.rewardTypes = {};
RewardType.rewardTypeList = [];

RewardType.init = function (callback) {
	RewardType.load(callback);
};

RewardType.load = function (callback) {
	RewardType.rewardTypes = {};
	RewardType.rewardTypeList = [];
	callback = callback || function () {};
	var me = this;
	me.getRows(null, null, function (err, result) {
		if (err) {
			return callback(err);
		}
		result.forEach(function (element) {
			me.rewardTypes[element._data.category + ':' + element._data.item] = element._data;
			me.rewardTypeList.push(element._data);
		});
		callback(err, result);
	});
};

RewardType.getText = function (rewardTypeId) {
	for (var index = 0; index < RewardType.rewardTypeList.length; index++) {
		var rewardType = RewardType.rewardTypeList[index];
		if (rewardType.id === rewardTypeId) {
			return rewardType.content;
		}
	}
};

RewardType.getKey = function (category, item) {
	return category + ':' + item;
};

RewardType.getTypeId = function (category, item) {
	var key = this.getKey(category, item);
	return this.rewardTypes[key].id;
};

RewardType.getOptions = function (category, withAll) {
	function recursive(rewardtype, datas) {
		var data = {};
		if (rewardtype.category === category) {
			data.value = rewardtype.id;
			data.text = rewardtype.content;
			datas.push(data);
		}
	}

	var options = [];
	if (withAll) {
		options.push({
			value: null,
			text: '[[admin/scc-reward/topic-reward:option-all]]',
		});
	}

	this.rewardTypeList.forEach(function (rewardtype) {
		recursive(rewardtype, options);
	});
	return options;
};

RewardType.getScc = function (category, item, params) {
	var invitedExtra = function (sccParams) {
		var invitationcount = sccParams.invitationCount;
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

	var rewardTypeKey = RewardType.getKey(category, item);
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
		result = function (sccParams) { return Math.ceil(sccParams.wordCount / 500) * 60; };
		break;
	case 'topic:reprint':
		result = function () { return 30; };
		break;
	case 'topic:translation':
		result = function (sccParams) { return Math.ceil(sccParams.wordCount / 500) * 60; };
		break;
	case 'other:other':
		result = function () { return 0; };
		break;
	}
	return result(params);
};

RewardType.getContent = function (category, item) {
	var rewardTypeKey = this.getKey(category, item);
	var result;
	var rewardTypeItem = RewardType.rewardTypes[rewardTypeKey];
	if (item) {
		result = rewardTypeItem.content;
	}
	return result;
};

RewardType.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('reward_types', sqlCondition, variable_binding, callback);
};

RewardType.newRow = function (data, callback) {
	mysql.newRow('reward_types', data, callback);
};

RewardType.updateRow = function (row, data, callback) {
	mysql.updateRow(row, data, callback);
};

