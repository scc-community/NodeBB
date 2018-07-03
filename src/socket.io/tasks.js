'use strict';

var SocketTasks = module.exports;

require('./tasks/project')(SocketTasks);
require('./tasks/module')(SocketTasks);

// SocketTasks.post = function (socket, data, callback) {
// 	callback();
// };
