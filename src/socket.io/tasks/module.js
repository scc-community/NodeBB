'use strict';

module.exports = function (SocketTasks) {
	SocketTasks.module = {};
	SocketTasks.module.saveTask = function (socket, data, callback) {
		callback();
	};

	SocketTasks.module.publishTask = function (socket, data, callback) {
		callback();
	};

	SocketTasks.module.deleteTask = function (socket, data, callback) {
		callback();
	};

	SocketTasks.module.endTask = function (socket, data, callback) {
		callback();
	};

	SocketTasks.module.unSubmitTask = function (socket, data, callback) {
		callback();
	};

	SocketTasks.module.cutoffTask = function (socket, data, callback) {
		callback();
	};
};
