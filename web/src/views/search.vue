<template>
  <div class="home">
    <div v-title data-title="昌航通 | 搜索"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <h3>
              有关
              <span style="color:#1890ff">{{search}}</span>
              的搜素结果
            </h3>
            <div
              v-if="tableData.help==''&&tableData.activity==''&&tableData.job==''&&tableData.company==''&&tableData.article==''&&tableData.oldstuff==''"
            >
              <img src="../assets/images/noinfo.png" width="100%" alt />
              <div style="width:100%;text-align:center">
                没有找到有关
                <span style="color:#1890ff">{{search}}</span> 的搜素结果
              </div>
            </div>
            <!--starthelp-->
            <section class="widget" v-if="tableData.help.length!==0">
              <div class="row">
                <ul class="articles">
                  <li class="article-entry standard" v-for="(item,id) in tableData.help" :key="id">
                    <h4>
                      <router-link :to="'/helpcontent/'+item.help_id" v-html="item.titlewraper"></router-link>
                    </h4>
                    <span class="article-meta">
                      <a class="iconfont">&#xe619;</a>
                      {{item.createtime| dataFormat}}
                      <a
                        class="iconfont"
                        style="margin-left:50px"
                      >&#xe688;</a>哈哈哈哈
                    </span>
                    <span class="like-count">
                      <span class="like-count">
                        <a class="iconfont">&#xe61c;</a>55
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </section>
            <!--end help-->
            <!--start oldstuff-->
            <section class="widget" v-if="tableData.oldstuff.length!==0">
              <div class="row">
                <div
                  style="margin :1%"
                  class="col-sm-6 col-md-4"
                  v-for="(oldstuff,id) in tableData.oldstuff"
                  :key="id"
                >
                  <router-link :to="'/oldstuffcontent/'+oldstuff.oldstuff_id">
                    <div class="thumbnail">
                      <img
                        data-src="holder.js/100%x200"
                        alt="100%x200"
                        :src="oldstuff.oldstuff_img"
                        data-holder-rendered="true"
                        style="height: 200px; object-fit: cover;width: 100%; display: block;"
                      />
                      <div class="caption">
                        <h3 style="color:red">￥{{oldstuff.oldstuff_price}}</h3>
                        <p v-html="oldstuff.namewraper"></p>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </section>
            <!--end oldstuff-->
            <!--activity-->
            <section class="widget" v-if="tableData.activity.length!==0">
              <div class="row">
                <ul class="articles">
                  <li
                    class="article-entry standard"
                    v-for="(activity,id) in tableData.activity"
                    :key="id"
                  >
                    <h4>
                      <router-link
                        :to="'/activitycontent/'+activity.activity_id"
                        v-html="activity.titlewraper"
                      ></router-link>
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
                      <a class="iconfont">&#xe61c;</a>
                      {{activity.activity_num}}
                    </span>
                  </li>
                </ul>
              </div>
            </section>
            <!--article-->
            <section class="widget" v-if="tableData.article.length!==0">
              <div class="row">
                <article
                  class="format-standard type-post hentry clearfix"
                  v-for="(item,id) in tableData.article"
                  :key="id"
                >
                  <header class="clearfix">
                    <h3 class="post-title">
                      <router-link :to="'/newscontent/'+item.article_id" v-html="item.titlewraper"></router-link>
                    </h3>

                    <div class="post-meta clearfix">
                      <span class="date">{{ item.article_createtime| dataFormat}}</span>
                      <span class="category">
                        <a
                          href="#"
                          title="View all posts in Server &amp; Database"
                        >{{item.nickname}}</a>
                      </span>
                      <span class="comments">
                        <a
                          href="#"
                          title="Comment on Integrating WordPress with Your Website"
                        >3 Comments</a>
                      </span>
                      <span class="like-count">66</span>
                    </div>
                    <!-- end of post meta -->
                  </header>
                  <p v-html="item.introductionwraper">
                    <router-link :to="'/newscontent/'+item.article_id" class="readmore-link">...查看更多</router-link>
                  </p>
                </article>
              </div>
            </section>
            <!--job-->
            <section class="widget" v-if="tableData.job.length!==0">
              <div class="row">
                <ul class="articles">
                  <li
                    class="article-entry standard"
                    v-for="(item,id) in tableData.job"
                    :key="id"
                    style="position:relative"
                  >
                    <h4>
                      <router-link :to="'/jobcontent/'+item.job_id" v-html="item.namewraper"></router-link>
                    </h4>
                    <h4
                      style="  position: absolute;right: 40px; top: 2px; color:red"
                    >{{item.job_salary}}</h4>
                    <span class="article-meta">
                      <a class="iconfont">&#xe619;</a>
                      {{item.job_createtime| dataFormat}}
                      <a
                        class="iconfont"
                        style="margin-left:50px"
                      >&#xe688;</a>
                      {{item.company_name}}
                    </span>
                  </li>
                </ul>
              </div>
            </section>
            <!--company-->
            <section class="widget" v-if="tableData.company.length!==0">
              <div class="row">
                <ul>
                  <li v-for="(item,id) in tableData.company" :key="id">
                    <router-link :to="'/companycontent/'+item.company_id" v-html="item.namewraper"></router-link>
                  </li>
                </ul>
              </div>
            </section>
            <!-- Basic Home Page Template -->
          </div>
          <!-- end of page content -->
          <!-- start of sidebar -->
          <aside class="span4 page-sidebar">
            <section class="widget">
              <div class="support-widget">
                <h3 class="title">搜索功能</h3>
                <p class="intro">该功能会搜索含有关键字的所有信息，该模块只能进行简单的搜索</p>
              </div>
              <activity />
              <job />
            </section>
          </aside>
          <!-- end of sidebar -->
        </div>
      </div>
    </div>
    <!-- End of Page Container -->
  </div>
</template>
<script>
// @ is an alias to /src
// import job from "@/components/job.vue";
import activity from "@/components/activity.vue";
import job from "@/components/job.vue";

export default {
  name: "search",
  components: {
    job,
    activity
  },
  data() {
    return {
      tableData: [],
      search: ""
    };
  },

  methods: {
    wraperkeyword(k, v) {
      function highlight(value) {
        console.log(value);
        return `<span style="color:#1890ff">${value}</span>`;
      }
      return v.replace(new RegExp(this.search, "ig"), v => highlight(v));
    },
    async searchlist() {
      this.search = this.$route.query.search;
      let res = await this.$axios.post(
        "/web/search",
        this.qs.stringify({ search: this.search })
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        this.tableData.help.forEach(element => {
          element.titlewraper = this.wraperkeyword(
            "help_title",
            element.help_title
          );
        });
        this.tableData.activity.forEach(element => {
          element.titlewraper = this.wraperkeyword(
            "activity_title",
            element.activity_title
          );
        });
        this.tableData.oldstuff.forEach(element => {
          element.namewraper = this.wraperkeyword(
            "oldstuff_name",
            element.oldstuff_name
          );
        });
        this.tableData.article.forEach(element => {
          element.titlewraper = this.wraperkeyword(
            "article_title",
            element.article_title
          );
          element.introductionwraper = this.wraperkeyword(
            "article_introduction",
            element.article_introduction
          );
        });
        this.tableData.job.forEach(element => {
          element.namewraper = this.wraperkeyword("job_name", element.job_name);
        });
        this.tableData.company.forEach(element => {
          element.namewraper = this.wraperkeyword(
            "company_name",
            element.company_name
          );
        });
      }
    }
  },
  created() {
    this.searchlist();
  },
  watch: {
    $route(to, from) {
      this.searchlist();
    }
  }
};
</script>
<style>
.guomore {
  float: right;
}
</style>