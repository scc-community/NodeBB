<div class="row manage-manualrewards">
	<div class="col-lg-12">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-user"></i> [[admin/scc-reward/manual-reward:manual-reward]]</div>
			<div class="panel-body">
				<div class="clearfix">
					<button id="createManualReward" class="btn btn-primary pull-right">[[admin/scc-reward/manual-reward:menu.new-reward]]</button>
				</div>
				<div class="table-responsive">
					<table class="table table-striped manualrewards-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>[[admin/scc-reward/manual-reward:title.username]]</th>
								<th class="text-right">[[admin/scc-reward/manual-reward:title.reward-scc]]</th>
								<th>[[admin/scc-reward/manual-reward:title.reward-type]]</th>
								<th>[[admin/scc-reward/manual-reward:title.reward-content]]</th>
								<th>[[admin/scc-reward/manual-reward:title.reward-memo]]</th>
								<th>[[admin/scc-reward/manual-reward:title.issue-time]]</th>
							</tr>
						</thead>
						<tbody>
							<!-- BEGIN manualrewards -->
							<tr class="manualreward-row">
								<td>{manualrewards.id}</td>
								<td><a href="{config.relative_path}/user/{manualrewards.userslug}">{manualrewards.username}</td>
								<td class="text-right"><a href="{config.relative_path}/user/{manualrewards.userslug}/scc?memo=true">{manualrewards.scc_setted}</td>
								<td>{manualrewards.rewardtype_content}</td>
								<td>{manualrewards.content}</td>
								<td>{manualrewards.memo}</td>
								<td><span class="timeago" title="{manualrewards.date_issued}"></span></td>
							</tr>
							<!-- END manualrewards -->
						</tbody>
					</table>
				</div>

				<!-- IMPORT partials/paginator.tpl -->
			</div>
		</div>
	</div>
</div>
