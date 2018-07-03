
'use strict';

define('autocomplete', function () {
	var module = {};
	var zIndex = 200000;

	module.app = function (input, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: onselect,
				source: function (request, response) {
					socket.emit('tasks.module.getApps', null, function (err, result) {
						if (err) {
							return app.alertError(err.message);
						}
						if (result && result.apps) {
							var names = result.apps.map(function (app) {
								var appTitle = $('<div/>').html(app.text).text();
								return app && {
									label: appTitle,
									value: appTitle,
									app: {
										text: app.text,
										value: app.value,
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			}).focus(function () {
				$(this).autocomplete('search');
				return false;
			});
		});
	};

	module.devLanguage = function (input, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				autoFocus: false,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: onselect,
				source: function (request, response) {
					socket.emit('tasks.module.getDevLanguages', null, function (err, result) {
						if (err) {
							return app.alertError(err.message);
						}
						if (result && result.devLanguages) {
							var names = result.devLanguages.map(function (devLanguage) {
								var devLanguageValue = $('<div/>').html(devLanguage.text).text();
								return devLanguage && {
									label: devLanguageValue,
									value: devLanguageValue,
									devLanguage: {
										text: devLanguage.text,
										value: devLanguage.value,
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			}).focus(function () {
				$(this).autocomplete('search');
				// return false;
			});
		});
	};

	module.codeModule = function (input, excludeIds, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: onselect,
				source: function (request, response) {
					socket.emit('tasks.project.getCodeModules', { query: request.term, excludeIds: excludeIds }, function (err, result) {
						if (err) {
							return app.alertError(err.message);
						}

						if (result && result.codeModules) {
							var names = result.codeModules.map(function (codeModule) {
								var codeModuleTitle = $('<div/>').html(codeModule.title).text();
								return codeModule && {
									label: codeModuleTitle,
									value: codeModuleTitle,
									codeModule: {
										id: codeModule.id,
										title: codeModule.title,
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			});
		});
	};

	module.moduleAcceptUser = function (input, onselect) {
		var uid = $(input).attr('data-uid');
		var userslug = $(input).val();
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: onselect,
				source: function (request, response) {
					socket.emit('user.search', { query: request.term }, function (err, result) {
						if (err) {
							return app.alertError(err.message);
						}
						if (result && result.users) {
							var names = result.users.map(function (user) {
								var username = $('<div/>').html(user.username).text();
								return user && {
									label: username,
									value: username,
									user: {
										uid: user.uid,
										name: user.username,
										slug: user.userslug,
										username: user.username,
										userslug: user.userslug,
										picture: user.picture,
										'icon:text': user['icon:text'],
										'icon:bgColor': user['icon:bgColor'],
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			}).blur(function () {
				var selected = $('#codemodule-acceptuid').attr('data-selected');
				if (selected !== '1') {
					$(input).attr('data-uid', uid);
					$(input).val(userslug);
				}
				$('#codemodule-acceptuid').attr('data-selected', '0');
			}).focus(function () {
				uid = $(input).attr('data-uid');
				userslug = $(input).val();
			});
		});
	};

	module.user = function (input, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: onselect,
				source: function (request, response) {
					socket.emit('user.search', { query: request.term }, function (err, result) {
						if (err) {
							return app.alertError(err.message);
						}

						if (result && result.users) {
							var names = result.users.map(function (user) {
								var username = $('<div/>').html(user.username).text();
								return user && {
									label: username,
									value: username,
									user: {
										uid: user.uid,
										name: user.username,
										slug: user.userslug,
										username: user.username,
										userslug: user.userslug,
										picture: user.picture,
										'icon:text': user['icon:text'],
										'icon:bgColor': user['icon:bgColor'],
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			});
		});
	};

	module.group = function (input, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 200,
				select: onselect,
				source: function (request, response) {
					socket.emit('groups.search', {
						query: request.term,
					}, function (err, results) {
						if (err) {
							return app.alertError(err.message);
						}

						if (results && results.length) {
							var names = results.map(function (group) {
								return group && {
									label: group.name,
									value: group.name,
									group: {
										name: group.name,
										slug: group.slug,
									},
								};
							});
							response(names);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			});
		});
	};

	module.tag = function (input, onselect) {
		app.loadJQueryUI(function () {
			input.autocomplete({
				delay: 100,
				open: function () {
					zIndex += 1;
					$(this).autocomplete('widget').css('z-index', zIndex);
				},
				select: function (event, ui) {
					onselect = onselect || function () {};
					var e = jQuery.Event('keypress');
					e.which = 13;
					e.keyCode = 13;
					setTimeout(function () {
						input.trigger(e);
					}, 100);
					onselect(event, ui);
				},
				source: function (request, response) {
					socket.emit('topics.autocompleteTags', {
						query: request.term,
						cid: ajaxify.data.cid || 0,
					}, function (err, tags) {
						if (err) {
							return app.alertError(err.message);
						}
						if (tags) {
							response(tags);
						}
						$('.ui-autocomplete a').attr('data-ajaxify', 'false');
					});
				},
			});
		});
	};

	return module;
});
