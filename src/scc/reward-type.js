'use strict';

var mysql = require('../database/mysql');

var RewardType = module.exports;

RewardType.getRows = function (sqlCondition, variable_binding, callback) {
	mysql.baseQuery('reward_types', sqlCondition, variable_binding, callback);
};

RewardType.init = function (callback) {
	RewardType.load(callback);
};

RewardType.get = function (category, item) {
	var key = this.getKey(category, item);
	return this.cache[key];
};

RewardType.load = function (callback) {
	this.cache = {};
	callback = callback || function () {};
	this.getRows(null, null, function (err, result) {
		if (err) {
			return callback(err);
		}
		result.forEach(function (element) {
			RewardType.cache[element._data.category + ':' + element._data.item] = element._data;
		});
		callback(err, result);
	});
};

RewardType.getKey = function (category, item) {
	return category + ':' + item;
};

RewardType.find = function (findKey, findValue) {
	for (var key in this.cache) {
		if (this.cache.hasOwnProperty(key)) {
			var element = this.cache[key];
			if (element[findKey] === findValue) {
				return element;
			}
		}
	}
};

RewardType.getOptions = function (category, withAll, selectedItem) {
	function recursive(rewardtype, datas) {
		var data = {};
		if ((category && rewardtype.category === category) || (!category)) {
			data.value = rewardtype.id;
			data.text = rewardtype.content;
			if (selectedItem && selectedItem.category === rewardtype.category && selectedItem.item === rewardtype.item) {
				data.selected = true;
			}
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

	for (var key in this.cache) {
		if (this.cache.hasOwnProperty(key)) {
			var rewardType = this.cache[key];
			recursive(rewardType, options);
		}
	}
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

	var result = function () { return 0; };
	switch (this.getKey(category, item)) {
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

