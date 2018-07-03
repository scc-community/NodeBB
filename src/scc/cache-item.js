'use strict';

var Base = require('./base');
var util = require('util');

function CacheItem() {
}

util.inherits(CacheItem, Base);

CacheItem.prototype.init = function (callback) {
	this.load(callback);
};

CacheItem.prototype.get = function (category, item) {
	var key = this.getKey(category, item);
	return this.cache[key];
};

CacheItem.prototype.load = function (callback) {
	callback = callback || function () {};
	var me = this;
	this.getRows(null, null, null, function (err, result) {
		if (err) {
			return callback(err);
		}
		result.forEach(function (element) {
			var key = me.getKey(element._data.category, element._data.item);
			me.cache[key] = element._data;
		});
		callback(err, result);
	});
};

CacheItem.prototype.getKey = function (category, item) {
	return category + ':' + item;
};

CacheItem.prototype.find = function (findKey, findValue) {
	for (var key in this.cache) {
		if (this.cache.hasOwnProperty(key)) {
			var element = this.cache[key];
			if (element[findKey] === findValue) {
				return element;
			}
		}
	}
};

CacheItem.prototype.getOptions = function (category, firstOption, selectedItem, includeItems) {
	function recursive(cacheData, items) {
		var item = {};
		if (!category || category === cacheData.category) {
			item.value = cacheData.id;
			item.text = cacheData.content;
			if (selectedItem) {
				if ((!selectedItem.category || selectedItem.category === cacheData.category) && selectedItem.item === cacheData.item) {
					item.selected = true;
				}
			}
			if (includeItems && includeItems.length > 0) {
				for (var index = 0; index < includeItems.length; index++) {
					var element = includeItems[index];
					if ((!element.category || element.category === cacheData.category) && element.item === cacheData.item) {
						items.push(item);
						return;
					}
				}
			}
			items.push(item);
		}
	}

	var options = [];
	if (firstOption) {
		options.push({
			value: firstOption.value ? firstOption.value : null,
			text: firstOption.text ? firstOption.text : '[[admin/scc-reward/topic-reward:option-all]]',
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

module.exports = CacheItem;
