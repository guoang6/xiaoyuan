<template>
  <div class="activitycontent">
    <div v-title data-title="昌航通 | 公司详情"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <el-page-header @back="$router.back(-1)" :content="content.company_name"></el-page-header>
            <article class="type-post format-standard hentry clearfix">
              <div>
                <div class="show_unit fl ativity">
                  <a class="iconfont ic">&#xe679;</a>
                  <a class="tagname">公司规模:</a>
                  {{content.company_scale}}
                </div>
                <div style="clear:both"></div>
                <!--占位-->
              </div>

              <h3>公司介绍</h3>
              <blockquote v-html="content.company_content"></blockquote>
              <h3>岗位列表</h3>
              <div v-for="(job,id) in joblist" :key="id" style="position:relative">
                <el-divider></el-divider>
                <router-link :to="'/jobcontent/'+job.job_id">
                  <h4>{{job.job_name}}</h4>
                </router-link>
                <h4 style="  position: absolute;right: 40px; top: 5px; color:red">{{job.job_salary}}</h4>
              </div>

              <el-divider></el-divider>
            </article>

            <div class="like-btn">
              <form id="like-it-form" action="#" method="post">
                <span class="like-it">66</span>
                <input type="hidden" name="post_id" value="99" />
                <input type="hidden" name="action" value="like_it" />
              </form>
            </div>

            <comment />
            <!-- end of comments -->
            <!-- end of page content -->
          </div>
          <aside class="span4 page-sidebar">
          
          
          <carousel />
          <company />
          </aside>

          <!-- end of sidebar -->
        </div>
      </div>
    </div>
    <!-- End of Page Container -->
  </div>
</template>


<script>
import company from "@/components/company.vue";
import comment from "@/components/comment.vue";
import carousel from "@/components/carousel.vue";

import { mapState, mapActions } from "vuex";

export default {
  components: {
      company,
    comment,
    carousel
  },
  computed: {
    ...mapState({
      contentuserid: state => state.contentuserid,
      commentnum: state => state.commentnum
    })
  },
  data() {
    return {
      // data: {
      //   type: "", //类型
      //   name: "", //  名称
      //   describe: "", //  描述
      //   content_id: "",
      //   activity_title: "",
      //   to_userid: ""
      // },
      dialogFormVisible: false, //弹框相关
      content: {},
      announcementlist: {},
      joblist: []
    };
  },
  props: {
    id: {}
  },
  methods: {
    ...mapActions(["setcontentid", "setcontentinfo"]),

    async getcompanycontent() {
      let data = {
        id: this.id
      };
      let res = await this.$axios.post(
        "/web/getcompanycontent",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.content = res.data.data.company;
        this.joblist = res.data.data.joblist;

        console.log("公司详情数据");
        console.log(this.content);
        this.setcontentinfo({
          contentname: res.data.data.company.company_name,
          contentuserid: res.data.data.company.user_id
        });
      }
    }
  },
    watch: {
    id: {
      handler(newVal) {
        this.getcompanycontent();
    this.setcontentid(this.id);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getcompanycontent();
    this.setcontentid(this.id);
  }
};
</script>
<style >
.activitycontent {
  min-height: 200px;
}
.tagname {
  margin-right: 16px;
  font-size: 18px;
}
</style>