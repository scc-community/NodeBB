<!-- IMPORT admin/partials/scc-reward/topic_reward_main.tpl -->


<table class="table table-striped table-responsive">
    <thead>
        <tr>
            <th>[[admin/scc-reward/topic-reward:title]]</th>
            <th>[[admin/scc-reward/topic-reward:author]]</th>
            <th>[[admin/scc-reward/topic-reward:reason]]</th>
        </tr>
    </thead>
        <tbody>
        <!-- BEGIN Data.records -->
        <tr>
              <td><a href="/topic/{records.topic_category}/{records.topic_title}">{records.topic_title}</a></td>
              <td><a href="/user/{records.author}">{records.author}</a></td>
              <td>{records.reason}</td>
        </tr>
      <!-- END Data.records -->
    </tbody>
</table>