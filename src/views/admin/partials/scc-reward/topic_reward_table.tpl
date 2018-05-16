<table class="table table-striped table-responsive">
    <thead>
        <tr>
            <th><input type="checkbox" id="scc-mgr-tbl-checkall"></th>
            <th>[[admin/scc-reward/topic-reward:title]]</th>
            <th>[[admin/scc-reward/topic-reward:author]]</th>
            <th>[[admin/scc-reward/topic-reward:type]]</th>
            <th>[[admin/scc-reward/topic-reward:date]]</th>
            <th>[[admin/scc-reward/topic-reward:words_and_likes]]</th>
            <th>[[admin/scc-reward/topic-reward:qty]]</th>
            <th>[[admin/scc-reward/topic-reward:operation]]</th>
        </tr>
    </thead>
        <tbody>
        <!-- BEGIN Data.records -->
        <tr>
              <td>
                <input type="checkbox" name="RewardId" value="{records.id}" />
                <input type="hidden" name="scc-count" value="{records.scc_setted}" />
                <input type="hidden" name="scc-uid" value="{records.uid}" />
              </td>
              <td><a href="/topic/{records.topic_id}/">{records.topic_title}</a></td>
              <td><a href="/user/{records.author}">{records.author}</a></td>
              <td>{records.topic_category}</td>
              <td>{records.date_posted}</td>
              <td>{records.topic_words_count}/{records.topic_upvotes_count}</td>
              <td>
              <!-- IF records.is_modified -->
                 {records.scc_setted}([[admin/scc-reward/topic-reward:updated]])
               <!-- ELSE -->
                    {records.scc_autoed}
              <!-- ENDIF records.is_modified --></td>

              <td>
                <a href="#" class="scc-mgr-op-action" data-value="mod" data-id="{records.id}">[[admin/scc-reward/topic-reward:modify]]</a>
                <!-- IF records.is_modified -->
                <a href="#" class="scc-mgr-op-action" data-value="restore" data-id="{records.id}">[[admin/scc-reward/topic-reward:restore]]</a>
                <!-- ENDIF records.is_modified -->
                <a href="#" class="scc-mgr-op-action" data-value="reject" data-id="{records.id}">[[admin/scc-reward/topic-reward:reject]]</a>
              </td>
        </tr>
      <!-- END Data.records -->
    </tbody>
</table>

<hr class="divider" />

<div class="row" style="text-align:center">
        <div class="pull-right">
           <button class="btn btn-primary" id="scc-mgr-btn-submit">[[admin/scc-reward/topic-reward:submit]]</button>
        </div>

<!--
        <nav aria-label="scc-mgr-page">
          <ul class="pagination">
            <li class="disabled">
              <span>
                <span aria-hidden="true">&laquo;</span>
              </span>
            </li>
            <li class="active">
              <span>1 <span class="sr-only">(current)</span></span>
            </li>
             <li>
               <span>2 </span>
             </li>
          </ul>
          <ul class="pagination">
            <li class="enabled">
              <span>
                <span aria-hidden="true">&raquo;</span>
              </span>
            </li>
           </ul>
         </nav>
 -->

</div>