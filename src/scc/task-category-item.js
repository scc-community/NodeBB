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

module.exports = taskCategoryItem;
