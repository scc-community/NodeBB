<div class="row manage-topicrewards">
	<div class="panel panel-default">
		<div class="panel-heading"><i class="fa fa-cc"></i> [[admin/scc-reward/topic-reward:topic-reward]]</div>
		<div class="panel-body">
			<div class="clearfix">
				<div class="btn-group pull-left statuses">
					<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown" data-value="{condition.filterByStatus}" type="button">{conditionTitle.filterByStatus} <span class="caret"></span></button>
					<ul class="dropdown-menu">
						<!-- BEGIN statuses -->
						<li> <a href="#" class="dropdown-item" data-value="{statuses.value}">{statuses.text} </a></li>
						<!-- END statuses -->
					</ul>
				</div>
				<div class="btn-group pull-left rewardtype">
					<button class="btn <!-- IF condition.filterByRewardType -->btn-primary<!-- ELSE -->btn-default<!-- ENDIF condition.filterByRewardType --> dropdown-toggle" data-toggle="dropdown" data-value="{condition.filterByRewardType}" type="button">{conditionTitle.filterByRewardType} <span class="caret"></span></button>
					<ul class="dropdown-menu">
						<!-- BEGIN rewardtypes -->
						<li> <a href="#" class="dropdown-item" data-value="{rewardtypes.value}">{rewardtypes.text} </a></li>
						<!-- END rewardtypes -->
					</ul>
				</div>
				<div class="btn-group pull-left modifystatus">
					<button class="btn <!-- IF condition.filterByModifyStatus -->btn-primary<!-- ELSE -->btn-default<!-- ENDIF condition.filterByRewardType --> dropdown-toggle" data-toggle="dropdown" data-value="{condition.filterByModifyStatus}" type="button">{conditionTitle.filterByModifyStatus} <span class="caret"></span></button>
					<ul class="dropdown-menu">
						<!-- BEGIN modifystatuses -->
						<li> <a href="#" class="dropdown-item" data-value="{modifystatuses.value}">{modifystatuses.text} </a></li>
						<!-- END modifystatuses -->
					</ul>
				</div>
				<div class="btn-group pull-left rewardorder">
					<button class="btn <!-- IF condition.orderByIssueScc -->btn-primary<!-- ELSE -->btn-default<!-- ENDIF condition.filterByRewardType --> dropdown-toggle" data-toggle="dropdown" data-value="{condition.orderByIssueScc}" type="button">{conditionTitle.orderByIssueScc} <span class="caret"></span></button>
					<ul class="dropdown-menu">
						<!-- BEGIN rewardorderitems -->
						<li> <a href="#" class="dropdown-item" data-value="{rewardorderitems.value}">{rewardorderitems.text} </a></li>
						<!-- END rewardorderitems -->
					</ul>
				</div>
				<!-- IF filterbyNoissueStatus -->
				<div class="btn-group pull-right">
					<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">[[admin/scc-reward/topic-reward:menu-action]] <span class="caret"></span></button>
					
					<ul class="dropdown-menu">
						<li><a href="#" class="modify-reward"><i class="fa fa-fw fa-edit"></i> [[admin/scc-reward/topic-reward:menu-modify-reward]]</a></li>
						<li><a href="#" class="restore-reward"><i class="fa fa-fw fa-undo"></i> [[admin/scc-reward/topic-reward:menu-restore-reward]]</a></li>
						<li><a href="#" class="remove-reward"><i class="fa fa-fw fa-trash-o"></i> [[admin/scc-reward/topic-reward:menu-remove-reward]]</a></li>
						<li class="divider"></li>
						<li><a href="#" class="send-reward"><i class="fa fa-fw fa-send"></i> [[admin/scc-reward/topic-reward:menu-send-reward]]</a></li>
					</ul>
				</div>
				<button class="btn btn-primary pull-right calc-reward"> [[admin/scc-reward/topic-reward:menu-calc-reward]] </button>
				<!-- ENDIF filterbyNoissueStatus -->
			</div>
			<br />

			<div class="table-responsive">
				<table class="table table-striped topicrewards-table">
					<thead>
						<tr>
							<th><input component="topicreward/select/all" type="checkbox"/></th>
							<th>ID</th>
							<th>[[admin/scc-reward/topic-reward:title-user-name]]</th>
							<th>[[admin/scc-reward/topic-reward:title-topic-title]]</th>
							<th>[[admin/scc-reward/topic-reward:title-post-time]]</th>
							<th class="text-right">[[admin/scc-reward/topic-reward:title-word-and-upvote]]</th>
							<th>[[admin/scc-reward/topic-reward:title-issue-time]]</th>
							<th class="text-right">[[admin/scc-reward/topic-reward:title-reward]]</th>
							<th>[[admin/scc-reward/topic-reward:title-memo]]</th>
						</tr>
					</thead>
					<tbody>
						<!-- BEGIN topicrewards -->
						<tr class="topicreward-row">
							<td><input component="topicreward/select/single" data-value='{topicrewards.jsonData}' type="checkbox"/></td>
							<td>{topicrewards.id}</td>
							<td><a href="{config.relative_path}/user/{topicrewards.userslug}"> {topicrewards.username}</a></td>
							<td class="topic-id"><a href="{config.relative_path}/topic/{topicrewards.topic_id}">{topicrewards.rewardtype_content}|{topicrewards.topic_title}</a></td>
							<td><span class="timeago" title="{topicrewards.date_posted}"></span></td>
							<td class="text-right">{topicrewards.topic_words_count}|{topicrewards.topic_upvotes_count}</td>
							<td><span <!-- IF topicrewards.date_issued -->class="timeago" title="{topicrewards.date_issued}<!-- ENDIF topicrewards.date_issued -->"></span></td>
							<td class="text-right"><a href="{config.relative_path}/user/{topicrewards.userslug}/scc?memo=true"><i class="modify fa fa-edit text-danger <!-- IF !topicrewards.scc_setted -->hidden<!-- ENDIF !topicrewards.scc_setted -->"></i> {topicrewards.scc_issued}</td>
							<td>{topicrewards.memo}</td>
						</tr>
						<!-- END topicrewards -->
						
					</tbody>
				</table>
			</div>

			<!-- IMPORT partials/paginator.tpl -->
		</div>
	</div>
</div>