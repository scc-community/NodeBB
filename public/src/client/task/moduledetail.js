'use strict';


define('forum/task/moduledetail', ['benchpress', 'autocomplete'], function (Benchpress, autocomplete) {
	var ModuleDetail = {};

	ModuleDetail.init = function () {
		app.loadJQueryUI(function () {
			$('#codemodule-deliverydeadline').datepicker({
				changeMonth: true,
				changeYear: true,
				dateFormat: 'yy-mm-dd',
			});
		});

		autocomplete.devLanguage($('#language-search'), function (ev, ui) {
			$('#language-search').blur();
			if ($('.language-area [data-text="' + ui.item.devLanguage.text + '"]').length) {
				return;
			}
			app.parseAndTranslate('task/moduledetail', 'codemodule.dev_language', { codemodule: { dev_language: [ui.item.devLanguage] } }, function (html) {
				$('.language-area').prepend(html);
			});
		});

		autocomplete.app($('#app-search'), function (ev, ui) {
			$('#app-search').blur();
			if ($('.app-area [data-text="' + ui.item.app.text + '"]').length) {
				return;
			}
			app.parseAndTranslate('task/moduledetail', 'codemodule.app', { codemodule: { app: [ui.item.app] } }, function (html) {
				$('.app-area').prepend(html);
			});
		});

		autocomplete.moduleAcceptUser($('#codemodule-acceptuid'), function (ev, ui) {
			$('#codemodule-acceptuid').val(ui.item.user.userslug);
			$('#codemodule-acceptuid').attr('data-uid', ui.item.user.uid);
			$('#codemodule-acceptuid').attr('data-selected', '1');
		});

		$('.language-area').on('click', '.remove-icon', function () {
			var card = $(this).parents('[data-text]');
			card.remove();
		});

		$('.app-area').on('click', '.remove-icon', function () {
			var card = $(this).parents('[data-text]');
			card.remove();
		});

		function getCodemoduleId() {
			return $('form[data-codemodule-id]').attr('data-codemodule-id');
		}

		$('#return').on('click', function () {
			ajaxify.go('task/module');
		});

		$('[component="buttons"]').on('click', '[data-action]', function () {
			var btnEl = $(this);
			var action = btnEl.attr('data-action');
			var eventPreName = 'tasks.module.';
			function getCodemoduleData() {
				var data = {
					status: parseInt($('#codemodule-status').attr('data-status'), 10),
					url: $('#codemodule-status').attr('data-url'),
					codemoduleId: getCodemoduleId(),
					publish_uid: app.user.uid,
					accept_uid: $('#codemodule-acceptuid').attr('data-uid'),
					title: $('#codemodule-title').val(),
					scc: $('#codemodule-scc').val(),
					requirement_desc: $('#codemodule-requirementdesc').val(),
					delivery_deadline: $('#codemodule-deliverydeadline').val(),
					dev_language: '',
					publish: btnEl.attr('publish'),
					app: '',
					memo: $('#codemodule-memo').val(),
				};
				$('.language-area [data-text]').each(function (index, el) {
					data.dev_language += $(el).attr('data-text') + ',';
				});
				if (data.dev_language.length > 0) {
					data.dev_language = data.dev_language.substring(0, data.dev_language.length - 1);
				}
				$('.app-area [data-text]').each(function (index, el) {
					data.app += $(el).attr('data-text') + ',';
				});
				if (data.app.length > 0) {
					data.app = data.app.substring(0, data.app.length - 1);
				}
				return data;
			}
			function checkCodemoduleData(data) {
				var err = null;
				if (data.publish_uid === null) {
					err = {
						message: '需要重新登录',
					};
				} else if (data.accept_uid === null || data.accept_uid.trim() === '') {
					err = {
						message: '领取人不能为空',
					};
				} else if (data.dev_language === null || data.dev_language.trim() === '') {
					err = {
						message: '开发语言不能为空',
					};
				} else if (data.app === null || data.app.trim() === '') {
					err = {
						message: '对象不能为空',
					};
				} else if (data.title === null || data.title.trim() === '') {
					err = {
						message: '标题不能为空',
					};
				} else if (data.delivery_deadline === null || data.delivery_deadline.trim() === '') {
					err = {
						message: '交付截止日期不能为空',
					};
				} else if (data.requirement_desc === null || data.requirement_desc.trim() === '') {
					err = {
						message: '描述不能为空',
					};
				} else if (data.title.trim().length > 80) {
					err = {
						message: '模块名称长度不能超过80',
					};
				} else if (data.requirement_desc.trim().length > 256) {
					err = {
						message: '模块要求描述长度不能超过256',
					};
				}
				return err;
			}
			var data = getCodemoduleData();
			var err;
			var title;
			switch (action) {
			case 'newModuleTask':
				err = checkCodemoduleData(data);
				if (err) {
					return app.alertError(err.message);
				}
				title = data.publish ? '直接发布该模块?' : '保存该模块?';
				bootbox.confirm(title, function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							app.alertError(err.message);
							return false;
						}
						ajaxify.go('task/module/detail?cmid=' + data.codemoduleId);
						app.alertSuccess('保存成功');
					});
				});
				break;
			case 'publishModuleTask':
				bootbox.confirm('发布该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.refresh();
						app.alertSuccess('发布成功');
					});
				});
				break;
			case 'saveModuleTask':
				err = checkCodemoduleData(data);
				if (err) {
					return app.alertError(err.message);
				}
				bootbox.confirm('保存该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							app.alertError(err.message);
							return false;
						}
						ajaxify.refresh();
						app.alertSuccess('保存成功');
					});
				});
				break;
			case 'deleteModuleTask':
				bootbox.confirm('删除该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.go('task/module');
						app.alertSuccess('删除成功');
					});
				});
				break;
			case 'unSubmitModuleTask':
				bootbox.confirm('撤消该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.refresh();
						app.alertSuccess('撤消成功');
					});
				});
				break;
			case 'endModuleTask':
				bootbox.confirm('结束该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.refresh();
						app.alertSuccess('结束成功');
					});
				});
				break;
			case 'cutoffModuleTask':
				title = '奖励码力' + data.scc + '，结算该模块?';
				bootbox.confirm(title, function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, data, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.refresh();
						app.alertSuccess('结算成功');
					});
				});
				break;
			case 'downloadFile':
				var url = RELATIVE_PATH + btnEl.attr('data-url');
				window.open(url);
				break;
			default:
				break;
			}
		});
	};

	return ModuleDetail;
});
