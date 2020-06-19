<template>
  <div class="activity">
    <div class="row-fluid top-cats">
      <section class="widget">
        <router-link
          to="/activity"
          tag="div"
          class="page-header"
          style="position:relative;cursor:pointer"
        >
          <h3>校内活动</h3>
          <h4 style="  position: absolute;right: 10px;top: 4px;">更多></h4>
        </router-link>
          <ul class="articles">
            <li class="article-entry standard" v-for="(activity,id) in tableData" :key="id">
              <h4>
                <router-link
                  :to="'/activitycontent/'+activity.activity_id"
                >{{activity.activity_title}}</router-link>
              </h4>
              <span class="article-meta">
                <a class="iconfont">&#xe619;</a>
                {{activity.createtime|dataFormat}}
                <a
                  class="iconfont"
                  style="margin-left:50px"
                >&#xe609;</a>
                {{activity.activity_locale}}
              </span>
              <span class="like-count">
                <a class="iconfont" style="color:red">&#xe647;</a>
                {{activity.activity_read_num}}
              </span>
            </li>
          </ul>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      smallttle: "",
      pagelistquery: {
        lable: "",
        total: 0,
        pagesize: 5,
        page: 1
      },
      tableData: {}
    };
  },
  methods: {
    async getactivitylist() {
      let res = await this.$axios.post(
        "/web/webgetwebactivitylist",
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
    this.getactivitylist();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
