<template>
  <div class="help">
        <aside class="span4 page-sidebar">
        <section class="widget">
          <div class="row">
             <router-link to="/oldstuff" tag="div"  class="page-header" style="position:relative;cursor:pointer">
          <h3 >二手交易</h3>
          <h4 style="  position: absolute;right: 15px;top: 4px;">更多></h4>
        </router-link>
            <div
              style="margin :3%;width: 44%;"
              class="col-sm-6 col-md-4"
              v-for="(oldstuff,id) in tableData"
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
                    <p>{{oldstuff.oldstuff_name}}</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </section>
        </aside>
      </div>
</template>


<script>
export default {
  data() {
    return {
      pagelistquery: {
        lable: "",
        total: 0,
        pagesize: 4,
        page: 1
      },
      tableData: {}
    };
  },
  methods: {
    async getoldstufflist() {
      let res = await this.$axios.post(
        "/web/webgetweboldstufflist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
      }
    }
  },
  created() {
    this.getoldstufflist();
  }
};
</script>
<style>

</style>