<template>
  <div  class="help">
<div v-title data-title="昌航通 | 问答"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <div >
              <h1>
                问答区
                <small>{{smallttle}}</small>
              </h1>
            </div>
            <!-- Basic Home Page Template -->
            <ul class="tabs-nav">
              <li :class="pagelistquery.lable===''&&pagelistquery.tag===''?'active':''" @click="changelable('')">
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
               <li v-if="pagelistquery.tag!=''"  class="active" @click="changelable('')">
                <a>{{this.pagelistquery.tag}}</a>
              </li>
            </ul>
            <section class="widget">
              <ul class="articles">
                <li class="article-entry standard" v-for="(item,id) in tableData" :key="id">
                  <h4>
                    <router-link :to="'/helpcontent/'+item.help_id">{{item.help_title}}</router-link>
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
                      <a class="iconfont">&#xe61c;</a>{{item.help_read_num}}
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
             <carousel />
             <oldstuffhot />
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
import oldstuffhot from "@/components/oldstuffhot.vue";
export default {
  name:'help',
  components: {
    carousel,
    oldstuffhot,
  },
  data() {
    return {
      smallttle:'',
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
    tag:{}
  },
  methods: {
    changelable(lable) {
      this.pagelistquery.lable = lable;
      this.smallttle=this.pagelistquery.lable
      this.pagelistquery.tag = "";
      this.gethelplist();
    },
    changetag() {
      this.pagelistquery.tag = this.tag;
      this.smallttle=this.tag
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.gethelplist();
      console.log(`当前页: ${val}`);
    },
    async gethelplist() {
      let res = await this.$axios.post(
        "/web/webgetwebhelplist",
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
        this.qs.stringify({ lable_name:'问答分类' })
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
    this.gethelplist();
    this.lablelist()
  }
};
</script>
<style>
.help {
  min-height: 200px;
}
</style>