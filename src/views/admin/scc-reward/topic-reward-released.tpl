<!-- IMPORT admin/partials/scc-reward/topic_reward_main.tpl -->

<table class="table table-striped table-responsive">
    <thead>
        <tr>
            <th>[[admin/scc-reward/topic-reward:title]]</th>
            <th>[[admin/scc-reward/topic-reward:author]]</th>
            <th>[[admin/scc-reward/topic-reward:type]]</th>
            <th>[[admin/scc-reward/topic-reward:date]]</th>
            <th>[[admin/scc-reward/topic-reward:words_and_likes]]</th>
            <th>[[admin/scc-reward/topic-reward:qty]]</th>
        </tr>
    </thead>
        <tbody>
        <!-- BEGIN Data.records -->
        <tr>
              <td><a href="/topic/{records.topic_category}/{records.topic_title}">{records.topic_title}</a></td>
              <td><a href="/user/{records.author}">{records.author}</a></td>
              <td>{records.topic_category}</td>
              <td>{records.date_posted}</td>
              <td>{records.topic_words_count}/{records.topic_upvotes_count}</td>
              <td>{records.scc_setted} <!-- IF records.is_modified -->([[admin/scc-reward/topic-reward:updated]])<!-- ENDIF records.is_modified --></td>
        </tr>
      <!-- END Data.records -->
    </tbody>
</table>