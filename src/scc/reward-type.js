'use strict';

var CacheItem = require('./cache-item');
var util = require('util');

var cache = {};

function RewardType() {
	this.tableName = 'reward_types';
	this.cache = cache;
}

util.inherits(RewardType, CacheItem);
var rewardType = new RewardType();

RewardType.prototype.getScc = function (category, item, params) {
	var me = this;
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
	switch (me.getKey(category, item)) {
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

module.exports = rewardType;
