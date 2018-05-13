<!-- IMPORT admin/partials/sccmanage/post_rewards_main.tpl -->

<table class="table table-striped table-responsive">
    <thead>
        <tr>
            <th>[[admin/sccmanage/postrewards:title]]</th>
            <th>[[admin/sccmanage/postrewards:author]]</th>
            <th>[[admin/sccmanage/postrewards:type]]</th>
            <th>[[admin/sccmanage/postrewards:date]]</th>
            <th>[[admin/sccmanage/postrewards:words_and_likes]]</th>
            <th>[[admin/sccmanage/postrewards:qty]]</th>
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
              <td>{records.scc_setted} <!-- IF records.is_modified -->([[admin/sccmanage/postrewards:updated]])<!-- ENDIF records.is_modified --></td>
        </tr>
      <!-- END Data.records -->
    </tbody>
</table>