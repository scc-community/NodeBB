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

TaskCategoryItem.prototype.getCodeModuleStatusText = function (scene, status) {
	var comment = this.find('id', status).comment;
	if (!comment) {
		return '';
	}
	var statusTexts = comment.split('::');
	if (statusTexts.length !== 2) {
		return comment;
	}
	switch (scene) {
	case 'client':
		return statusTexts[0];
	case 'background':
		return statusTexts[1];
	default:
		return statusTexts[0];
	}
};

module.exports = taskCategoryItem;
