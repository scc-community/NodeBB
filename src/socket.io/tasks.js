'use strict';

var async = require('async');

var topics = require('../topics');
var posts = require('../posts');
var websockets = require('./index');
var user = require('../user');
var apiController = require('../controllers/api');
var socketHelpers = require('./helpers');

var SocketTasks = module.exports;

require('./tasks/project')(SocketTasks);
require('./tasks/module')(SocketTasks);

// SocketTasks.post = function (socket, data, callback) {
// 	callback();
// };
