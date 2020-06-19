<template>
  <div class="help">
<div v-title data-title="昌航通  |  二手信息"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <div>
              <h3 class="title">二手交易中心</h3>
            </div>
            <!-- Basic Home Page Template -->
            <ul class="tabs-nav">
              <li :class="pagelistquery.lable===''?'active':''" @click="changelable('')">
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
            </ul>
            <section class="widget">
              <div class="row">
                <div
                  style="margin :1%"
                  class="col-sm-6 col-md-4"
                  v-for="(oldstuff,id) in tableData"
                  :key="id"
                >
                 <router-link 
                  :to="'/oldstuffcontent/'+oldstuff.oldstuff_id">
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
                      <p>{{oldstuff.oldstuff_name}}</p>
                    </div>
                  </div>
                </router-link>
              </div>
              </div>
            </section>
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :total="pagelistquery.total"
              :page-size="pagelistquery.pagesize"
            ></el-pagination>
          </div>
          <!-- end of page content -->
          <!-- start of sidebar -->
           <aside class="span4 page-sidebar">
              <carousel /> 
              <activity/>
                <news/>
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
import activity from "@/components/activity.vue";
import news from "@/components/news.vue";


export default {
  components: {
    carousel,
    activity,
    news
  },
  data() {
    return {
      lables: [],
      pagelistquery: {
        lable: "",
        total: 0,
        pagesize: 12,
        page: 1
      },
      tableData: {}
    };
  },
  methods: {
    changelable(lable) {
      this.pagelistquery.lable = lable;
      this.smallttle = this.pagelistquery.lable;
      this.getoldstufflist();
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getoldstufflist();
      console.log(`当前页: ${val}`);
    },
      async lablelist() {
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name: "二手分类" })
      );
      if (res.data.state.type === "SUCCESS") {
        // this.lable = res.data.data
        this.lables = JSON.parse(res.data.data[0].lable);
        console.log("分类列表");
        console.log(this.lables);
      }
    },
    async getoldstufflist() {
      let res = await this.$axios.post(
        "/web/webgetweboldstufflist",
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
    this.getoldstufflist();
    this.lablelist()
  }
};
</script>
<style>
.col-sm-6 {
  float: left;
}
.help {
  min-height: 200px;
}
.row {
  margin-top: 20px;
}
@media (min-width: 768px) {
  .col-sm-6 {
    width: 27.33333%;
  }
}
@media (max-width: 768px) {
  .col-sm-6 {
    width: 48%;
  }
}
</style>