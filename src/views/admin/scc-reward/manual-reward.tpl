<div class="row manage-manualrewards">
	<div class="col-lg-12">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-user"></i> 手动奖励</div>
			<div class="panel-body">

				<div class="clearfix">
					<button id="createManualReward" class="btn btn-primary pull-right">新奖励</button>
				</div>
				<div class="table-responsive">
					<table class="table table-striped manualrewards-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>用户</th>
								<th class="text-right">奖励数量</th>
								<th>类型</th>
								<th>内容</th>
								<th>备注</th>
								<th>发放时间</th>
							</tr>
						</thead>
						<tbody>
							<!-- BEGIN manualrewards -->
							<tr class="manualreward-row">
								<td>{manualrewards.id}</td>
								<td>{manualrewards.username}</td>
								<td class="text-right">{manualrewards.scc_setted}</td>
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
