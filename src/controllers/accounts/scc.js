'use strict';

var async = require('async');

var db = require('../../database');
var user = require('../../user');
var meta = require('../../meta');
var plugins = require('../../plugins');
var helpers = require('../helpers');
var groups = require('../../groups');
var accountHelpers = require('./helpers');
var privileges = require('../../privileges');
var file = require('../../file');

var sccController = module.exports;

sccController.get = function (req, res, callback) {
    console.log('sccController.get');
    var userData;
    res.render('account/scc', userData);
};
