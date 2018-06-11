'use strict';

var Base = require('./base');
var util = require('util');

var ProjectCodeModule = function () {
	this.tableName = 'projects_code_modules';
};
util.inherits(ProjectCodeModule, Base);
var projectCodeModule = new ProjectCodeModule();

module.exports = projectCodeModule;
