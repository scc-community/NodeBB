'use strict';

var Base = require('./base');
var util = require('util');

var Project = function () {
	this.tableName = 'projects';
};
util.inherits(Project, Base);
var project = new Project();

module.exports = project;

