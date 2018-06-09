'use strict';

var tableModels = [
	{
		name: 'users',
		idFieldName: 'id',
	},
	{
		name: 'reward_types',
		idFieldName: 'id',
	},
	{
		name: 'topic_rewards',
		idFieldName: 'id',
	},
	{
		name: 'manual_rewards',
		idFieldName: 'id',
	},
	{
		name: 'txs',
		idFieldName: 'id',
	},
	{
		name: 'tx_log',
		idFieldName: 'id',
	},
	{
		name: 'projects',
		idFieldName: 'id',
	},
	{
		name: 'project_architects',
		idFieldName: 'id',
	},
	{
		name: 'projects_code_modules',
		idFieldName: 'id',
	},
	{
		name: 'code_modules',
		idFieldName: 'id',
	},
	{
		name: 'task_category_items',
		idFieldName: 'id',
	},
	{
		name: 'v_pcm',
		idFieldName: 'id',
	},
];
var schema = module.exports;

schema.init = function (mysqlClient) {
	schema.initModel(mysqlClient);
};

schema.initModel = function (mysqlClient) {
	tableModels.forEach(function (model) {
		mysqlClient.add(model);
	});
};

