'use strict';


define('forum/task/projectdetail', ['benchpress', 'autocomplete'], function (Benchpress, autocomplete) {
	var ProjectDetail = {};

	ProjectDetail.init = function () {
		function getProjectId() {
			return $('form[data-project-id]').attr('data-project-id');
		}

		function showArchitectDialog(action, templateData) {
			function checkArchitectData(data) {
				var err = null;
				if (data.architectUId === null || data.architectUId.trim() === '') {
					err = {
						message: '用户不存在',
					};
				} else if (data.workDesc === null || data.workDesc.trim() === '') {
					err = {
						message: '工作描述不能为空',
					};
				} else if (data.workDesc.trim().length > 256) {
					err = {
						message: '工作描述长度不能超过256',
					};
				}
				return err;
			}

			function saveArchitect() {
				var modal = this;
				var errorEl = $('#create-architect-modal-error');
				var data = {
					architectUId: document.getElementById('create-architect-uid').value,
					scc: document.getElementById('create-architect-scc').value,
					workDesc: document.getElementById('create-architect-workDesc').value,
					projectId: $('form[data-project-id]').attr('data-project-id'),
				};
				if (templateData) {
					data.projectArchitectId = templateData.projectArchitectId;
				}

				var err = checkArchitectData(data);
				if (err) {
					return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
				}
				socket.emit('tasks.project.' + action, data, function (err) {
					if (err) {
						return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
					}
					modal.modal('hide');
					modal.on('hidden.bs.modal', function () {
						ajaxify.refresh();
					});
					app.alertSuccess('架构师保存成功!');
				});
			}

			Benchpress.parse('task/create_architect_modal', templateData, function (html) {
				var dialog = bootbox.dialog({
					message: html,
					title: '添加架构师',
					onEscape: true,
					buttons: {
						cancel: {
							label: '[[admin/manage/users:alerts.button-cancel]]',
							className: 'btn-link',
						},
						create: {
							label: '确定',
							className: 'btn-primary',
							callback: function () {
								saveArchitect.call(this);
								return false;
							},
						},
					},
				});
				dialog.init(function () {
					autocomplete.user($('#create-architect-username'), function (ev, ui) {
						$('#create-architect-uid').val(ui.item.user.uid);
					});
				});
			});
		}

		app.loadJQueryUI(function () {
			$('#project-deliveryDeadline').datepicker({
				changeMonth: true,
				changeYear: true,
				dateFormat: 'yy-mm-dd',
			});
		});

		$('#return').on('click', function () {
			ajaxify.go('task/project');
		});

		$('#createCodeModule').on('click', function () {
			function checkCodeModuleData(data) {
				var err = null;
				if (data.codeModuleId === null || data.codeModuleId.trim() === '') {
					err = {
						message: '模块不存在',
					};
				}
				return err;
			}
			var action = $(this).attr('data-action');
			function saveCodeModule() {
				var modal = this;
				var errorEl = $('#find-codemodule-modal-error');
				var data = {
					codeModuleId: document.getElementById('find-codemodule-modal-id').value,
					projectId: $('form[data-project-id]').attr('data-project-id'),
				};

				var err = checkCodeModuleData(data);
				if (err) {
					return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
				}
				socket.emit('tasks.project.' + action, data, function (err) {
					if (err) {
						return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
					}
					modal.modal('hide');
					modal.on('hidden.bs.modal', function () {
						ajaxify.refresh();
					});
					app.alertSuccess('添加模块成功!');
				});
			}
			Benchpress.parse('task/find_codeModule_modal', null, function (html) {
				var dialog = bootbox.dialog({
					message: html,
					title: '添加模块',
					onEscape: true,
					buttons: {
						cancel: {
							label: '[[admin/manage/users:alerts.button-cancel]]',
							className: 'btn-link',
						},
						create: {
							label: '确定',
							className: 'btn-primary',
							callback: function () {
								saveCodeModule.call(this);
								return false;
							},
						},
					},
				});
				dialog.init(function () {
					var codeModuleIds = [];
					$('[component="codemodule"] [data-id]').each(function (index, el) {
						codeModuleIds.push($(el).children('td:eq(0)').text());
					});
					autocomplete.codeModule($('#find-codemodule-modal-title'), codeModuleIds, function (ev, ui) {
						$('#find-codemodule-modal-id').val(ui.item.codeModule.id);
					});
				});
			});
		});

		$('#createArchitect').on('click', function () {
			var action = $(this).attr('data-action');
			showArchitectDialog(action, null);
		});

		$('[component="buttons"]').on('click', '[data-action]', function () {
			function checkProjectData(data) {
				var err = null;
				if (data.publish_uid === null) {
					err = {
						message: '需要重新登录',
					};
				} else if (data.title === null || data.title.trim() === '') {
					err = {
						message: '标题不能为空',
					};
				} else if (data.delivery_deadline === null || data.delivery_deadline.trim() === '') {
					err = {
						message: '交付截止日期不能为空',
					};
				} else if (data.description === null || data.description.trim() === '') {
					err = {
						message: '描述不能为空',
					};
				} else if (data.title.trim().length > 80) {
					err = {
						message: '标题长度不能超过80',
					};
				} else if (data.description.trim().length > 80) {
					err = {
						message: '描述长度不能超过80',
					};
				}
				return err;
			}
			function getSccSum() {
				var sccSum = 0;
				$('[component="codemodule"] [data-id]').each(function (index, el) {
					sccSum += parseInt($(el).children('td:eq(2)').text(), 10);
				});
				$('[component="projectArchitect"] [data-id]').each(function (index, el) {
					sccSum += parseInt($(el).children('td:eq(4)').text(), 10);
				});
				return sccSum;
			}
			function cutoffProject(action, sccSum) {
				var modal = this;
				var errorEl = $('#project-detail-error');
				var data = {
					publishUId: app.user.uid,
					projectId: $('form[data-project-id]').attr('data-project-id'),
					status: $('#project-status option:selected').val(),
					sccSum: sccSum,
					projectTitle: $('#project-title').attr('value'),
				};
				socket.emit('tasks.project.' + action, data, function (err) {
					if (err) {
						errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.message + ']]').removeClass('hide');
						return false;
					}
					modal.modal('hide');
					modal.on('hidden.bs.modal', function () {
						ajaxify.refresh();
					});
					app.alertSuccess('项目结算成功!');
				});
			}

			var btnEl = $(this);
			var action = btnEl.attr('data-action');
			var eventPreName = 'tasks.project.';
			switch (action) {
			case 'newProject':
			case 'saveProject':
				var data = {
					projectId: getProjectId(),
					publish_uid: app.user.uid,
					title: $('#project-title').val(),
					description: $('#project-description').val(),
					status: $('#project-status option:selected').val(),
					delivery_deadline: $('#project-deliveryDeadline').val(),
				};
				var err = checkProjectData(data);
				if (err) {
					return app.alertError(err.message);
				}
				socket.emit(eventPreName + action, data, function (err) {
					if (err) {
						app.alertError(err.message);
						return false;
					}
					app.alertSuccess('保存成功');
				});
				break;
			case 'deleteProject':
				bootbox.confirm('删除该项目?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit(eventPreName + action, { projectId: $('form[data-project-id]').attr('data-project-id') }, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						ajaxify.go('task/project');
						app.alertSuccess('删除项目成功');
					});
				});
				break;
			case 'cutoffProject':
				var sccSum = getSccSum();
				var title = '此次奖励码力总数为' + sccSum + '，结算该项目?';
				bootbox.confirm(title, function (confirm) {
					if (!confirm) {
						return;
					}
					cutoffProject.call(this, action, sccSum);
				});
				break;
			case 'downloadFile':
				var url = RELATIVE_PATH + '/task/project/downloadcmp?pid=' + getProjectId();
				window.open(url);
				break;
			default:
				break;
			}
		});

		function setDataTitle(tag, componentName) {
			var element = $('[' + tag + ']');
			var title = $(element).attr(tag) + '(' + $('[component="' + componentName + '"] tbody tr').length + ')';
			$(element).text(title);
		}

		$('[component="codemodule"]').on('click', '[data-action]', function () {
			var btnEl = $(this);
			var row = btnEl.parents('[data-id]');
			var codeModuleId = $(row).children('td:eq(0)').text();
			var action = btnEl.attr('data-action');

			switch (action) {
			case 'deleteCodeModule':
				bootbox.confirm('删除该模块?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit('tasks.project.' + action, {
						codeModuleId: codeModuleId,
						projectId: $('form[data-project-id]').attr('data-project-id'),
					}, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						row.remove();
						setDataTitle('data-codemodule-title', 'codemodule');
					});
				});
				break;
			default:
				break;
			}
		});

		$('[component="projectArchitect"]').on('click', '[data-action]', function () {
			var btnEl = $(this);
			var row = btnEl.parents('[data-id]');
			var architectId = row.attr('data-id');
			var action = btnEl.attr('data-action');

			switch (action) {
			case 'deleteArchitect':
				bootbox.confirm('删除该架构师?', function (confirm) {
					if (!confirm) {
						return;
					}
					socket.emit('tasks.project.' + action, {
						architectId: architectId,
						projectId: $('form[data-project-id]').attr('data-project-id'),
					}, function (err) {
						if (err) {
							return app.alertError(err.message);
						}
						row.remove();
						setDataTitle('data-projectarchitect-title', 'projectarchitect');
					});
				});
				break;
			case 'saveArchitect':
				var data = {
					projectArchitectId: $(row).attr('data-id'),
					architectUId: row.children('td:eq(1)').text(),
					architectUserName: row.children('td:eq(2)').text(),
					architectWorkDesc: row.children('td:eq(3)').text(),
					architectScc: row.children('td:eq(4)').text(),
				};
				showArchitectDialog(action, data);
				break;
			default:
				break;
			}
		});
	};

	return ProjectDetail;
});
