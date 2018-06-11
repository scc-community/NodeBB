'use strict';

var Base = require('./base');
var util = require('util');

var ProjectArchitect = function () {
	this.tableName = 'project_architects';
};
util.inherits(ProjectArchitect, Base);
var projectArchitect = new ProjectArchitect();

module.exports = projectArchitect;
