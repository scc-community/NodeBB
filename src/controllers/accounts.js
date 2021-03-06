'use strict';

var accountsController = {
	profile: require('./accounts/profile'),
	invitation: require('./accounts/invitation'),
	edit: require('./accounts/edit'),
	info: require('./accounts/info'),
	settings: require('./accounts/settings'),
	groups: require('./accounts/groups'),
	follow: require('./accounts/follow'),
	posts: require('./accounts/posts'),
	notifications: require('./accounts/notifications'),
	chats: require('./accounts/chats'),
	session: require('./accounts/session'),
	scc: require('./accounts/scc'),
};

module.exports = accountsController;
