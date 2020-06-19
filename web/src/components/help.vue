<template>
  <div class="hoothelp">
    <section class="widget">
      <router-link to="/help" tag="div"  class="page-header" style="position:relative;cursor:pointer">
          <h3 >讨论/问答</h3>
          <h4 style="  position: absolute;right: 100px;top: 4px;">更多></h4>
        </router-link>
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
                    <span class="like-count">
                      <a class="iconfont" style="color:red">&#xe647;</a>{{item.help_read_num}}
                    </span>
                  </span>
                </li>
              </ul>
      </section>
  </div>
</template>

<script>
export default {
  name: "hoothelp",
  data (){
    return { pagelistquery: {
        lable: "",
        tag: "",
        pagesize: 5,
        page: 1
      },
      tableData: {}
    }
  },
  props: {
    
  },
  methods:{
      async gethelplist() {
        console.log(this.pagelistquery)
      let res = await this.$axios.post(
        "/web/webgetwebhelplist",
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
 this.gethelplist();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
