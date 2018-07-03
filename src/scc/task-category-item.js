'use strict';

var CacheItem = require('./cache-item');
var util = require('util');

var cache = {};

function TaskCategoryItem() {
	this.tableName = 'task_category_items';
	this.cache = cache;
}

util.inherits(TaskCategoryItem, CacheItem);
var taskCategoryItem = new TaskCategoryItem();

TaskCategoryItem.prototype.getCodeModuleStatuses = function (status) {
	var item = this.find('id', status).item;
	var result = {};
	result.draft = item === 'draft';
	result.published = item === 'published';
	result.developing = item === 'developing';
	result.submited = item === 'submited';
	result.balanced = item === 'balanced';
	result.closed = item === 'closed';
	return result;
};

module.exports = taskCategoryItem;
