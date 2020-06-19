<template>
  <div class="help">
    <div v-title data-title="昌航通 | 招聘"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <div >
              <h3>
                岗位
                <small>{{smallttle}}</small>
              </h3>
            </div>
            <!-- Basic Home Page Template -->
            <ul class="tabs-nav">
              <li
                :class="pagelistquery.lable===''&&pagelistquery.tag===''?'active':''"
                @click="changelable('')"
              >
                <a>全部</a>
              </li>
              <li
                v-for="(lable,id) in lables"
                :key="id"
                :class="pagelistquery.lable===lable?'active':''"
                @click="changelable(lable)"
              >
                <a>{{lable}}</a>
              </li>
              <li v-if="pagelistquery.tag!=''" class="active" @click="changelable('')">
                <a>{{this.pagelistquery.tag}}</a>
              </li>
            </ul>
            <section class="widget" >
              <ul class="articles" style="min-height:730px">
                <li
                  class="article-entry standard"
                  v-for="(item,id) in tableData"
                  :key="id"
                  style="position:relative"
                >
                  <h4>
                    <router-link :to="'/jobcontent/'+item.job_id">{{item.job_name}}</router-link>
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
                    >&#xe679;</a>
                    {{item.company_name}}
                  </span>
                </li>
              </ul>
            </section>
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :total="pagelistquery.total"
            ></el-pagination>
          </div>
          <!-- end of page content -->
          <!-- start of sidebar -->
          <aside class="span4 page-sidebar">
            <section class="widget"> 
               <carousel />
              <company />
            
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
import carousel from "@/components/carousel.vue";
import company from "@/components/company.vue";
export default {
  name: "help",
  components: {
    company,
    carousel
  },
  data() {
    return {
      smallttle: "",
      lables: [],
      pagelistquery: {
        lable: "",
        tag: "",
        total: 0,
        pagesize: 10,
        page: 1
      },
      tableData: {}
    };
  },
  props: {
    tag: {}
  },
  methods: {
    changelable(lable) {
      this.pagelistquery.lable = lable;
      this.smallttle = this.pagelistquery.lable;
      this.pagelistquery.tag = "";
      this.getjoblist();
    },
    changetag() {
      this.pagelistquery.tag = this.tag;
      this.smallttle = this.tag;
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getjoblist();
      console.log(`当前页: ${val}`);
    },
    async getjoblist() {
      let res = await this.$axios.post(
        "/web/webgetjoblist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
        this.pagelistquery.total = res.data.count;
      }
    },
      async lablelist() { 
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name:'招聘分类' })
      );
      if (res.data.state.type === "SUCCESS") {
        // this.lable = res.data.data
          this.lables = JSON.parse(res.data.data[0].lable);
        console.log("分类列表");
        console.log(this.lables);
      }
    }
  },
  created() {
    this.tag && this.changetag();
    this.getjoblist();
    this.lablelist()
  }
};
</script>
<style>
.help {
  min-height: 200px;
}
</style>