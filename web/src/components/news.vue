 
<template>
  <div class="help">
    <!-- start of page content -->
    <div>
      <router-link
        to="/news"
        tag="div"
        class="page-header"
        style="position:relative;cursor:pointer"
      >
        <h3>新闻/文章</h3>
        <h4 style="  position: absolute;right: 100px;top: 4px;">更多></h4>
      </router-link>
      <article
        class="format-standard type-post hentry clearfix"
        v-for="(item,id) in tableData"
        :key="id"
      >
        <header class="clearfix">
          <h3 class="post-title">
                  <router-link :to="'/newscontent/'+item.article_id">{{item.article_title}}</router-link>
                </h3>

          <div class="post-meta clearfix">
            <span class="date">{{ item.article_createtime| dataFormat}}</span>
            <span class="category">
              <a href="#" title="View all posts in Server &amp; Database">{{item.nickname}}</a>
            </span>
            <span class="comments">
              <a href="#" title="Comment on Integrating WordPress with Your Website">3 Comments</a>
            </span>
            <span class="like-count">
              <a class="iconfont" style="color:red">&#xe647;</a>
              {{item.article_read_num}}
            </span>
          </div>
          <!-- end of post meta -->
        </header>

        <p>
          {{item.article_introduction}}
          <router-link :to="'/newscontent/'+item.article_id" class="readmore-link">...查看更多</router-link>
        </p>
      </article>
    </div>
  </div>
</template>


<script>
export default {
  name: "help",
  data() {
    return {
      smallttle: "",
      pagelistquery: {
        lable: "",
        tag: "",
        total: 0,
        pagesize: 3,
        page: 1
      },
      tableData: {}
    };
  },

  methods: {
    async getarticlelist() {
      let res = await this.$axios.post(
        "/web/getarticlelist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
        this.pagelistquery.total = res.data.count;
      }
    }
  },
  created() {
    this.getarticlelist();
  }
};
</script>
<style>
.help {
  min-height: 200px;
}
</style>