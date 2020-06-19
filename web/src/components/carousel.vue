<template>
  <div class="hello">
    <!-- start of sidebar -->
    <section class="widget">
      <!-- <div class="support-widget">
      </div>-->
      <el-carousel height="250px">
        <el-carousel-item v-for="(carousel,id) in carousel" :key="id">
          <div style="height:250px;position:relative">
            <a :href="carousel.carousel_url" target="_blank">
              <div class="carouseltitle">
               {{carousel.carousel_title}}
              </div>
              <img :src="carousel.carousel_img" alt class="carouselimg" />
            </a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
    <!-- end of sidebar -->
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      carousel: []
    };
  },
  methods: {
    async carousellist() {
      console.log("轮播图");

      let res = await this.$axios.post(
        "/admin/carousellist",
        this.qs.stringify({ lable_name: "" })
      );
      if (res.data.state.type === "SUCCESS") {
        this.carousel = res.data.data;
        console.log("轮播数据");
        console.log(this.carousel);
      }
    }
  },
  created() {
    this.carousellist();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carouselimg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carouseltitle {
  position: absolute;
  left: 0px;
  bottom: 4px;
  width: 100%;
  height: 30px;
 background-color: aliceblue;
 font-size: 20px;
 opacity:0.4;
 font-weight:800;
 color: black;
 line-height: 30px;
}
</style>
