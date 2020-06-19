<template>
  <div class="hoothelp">
      <section class="widget">
        <div style="position:relative;cursor:pointer">
           <h3 class="title">公司</h3>
            <el-pagination
            style="position: absolute;right: 100px;top: 4px;"
          @current-change="handleCurrentChange"
          layout="prev, next"
          :total="pagelistquery.total"
        ></el-pagination>
        </div>
       
        <ul>
          <li v-for="(item,id) in tableData" :key="id">
            <router-link :to="'/companycontent/'+item.company_id">{{item.company_name}}</router-link>
          </li>
        </ul>
        
      </section>
  </div>
</template>

<script>
export default {
  name: "company",
  data() {
    return {
      pagelistquery: {
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
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getjoblist();
      console.log(`当前页: ${val}`);
    },
    async getjoblist() {
      let res = await this.$axios.post(
        "/web/webgetcompanylist",
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
    this.getjoblist();
  }
};
</script>
<style>
</style>