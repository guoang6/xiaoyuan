<template>
  <div class="job">
    <section class="widget">
         <router-link to="/job" tag="div" class="page-header" style="position:relative;cursor:pointer">
          <h3 >岗位</h3>
          <h4 style="  position: absolute;right: 100px;top: 4px;">更多></h4>
        </router-link>
      <ul>
        <li v-for="(job,id) in job " :key="id">
          <router-link :to="'/jobcontent/'+job.job_id">{{job.job_name}}</router-link>
        </li>
      </ul>
    </section>
    <section class="widget">
          <router-link to="/job" tag="div" class="page-header" style="position:relative;cursor:pointer">
          <h3 >公司</h3>
          <h4 style="  position: absolute;right: 100px;top: 4px;">更多></h4>
        </router-link>
      <ul id="recentcomments">
        <li class="recentcomments"  v-for="(company,id) in company " :key="id">
           <router-link :to="'/companycontent/'+company.company_id">{{company.company_name}}</router-link>
        </li>
        
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "job",
  data() {
    return {
      pagelistquery: {
        lable: "",
        tag: "",
        total: 0,
        pagesize: 5,
        page: 1
      },
      job: [],
      company: []
    };
  },
  props: {
    tag: {}
  },
  methods: {
    async getcompanylist() {
      let res = await this.$axios.post(
        "/web/webgetcompanylist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.company = res.data.data;
      }
    },
    async getjoblist() {
      let res = await this.$axios.post(
        "/web/webgetjoblist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.job = res.data.data;
      }
    }
  },
  created() {
    this.getcompanylist();
    this.getjoblist();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
