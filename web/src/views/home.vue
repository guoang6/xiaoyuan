<template>
  <div class="home">
    <div v-title data-title="昌航通 | 首页"></div>

    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <!-- Basic Home Page Template -->
            <help />
            <oldstuff />
            <news />
          </div>
          <!-- end of page content -->
          <!-- start of sidebar -->
          <aside class="span4 page-sidebar">
            <section class="widget">
              <carousel/>
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
import carousel from "@/components/carousel.vue";
import activity from "@/components/activity.vue";
import news from "@/components/news.vue";
import help from "@/components/help.vue";
import oldstuff from "@/components/oldstuff.vue";
import job from "@/components/job.vue";

export default {
  name: "home",
  components: {
    news,
    oldstuff,
    job,
    activity,
    carousel,
    help
  }
};
</script>
<style>
.guomore {
  float: right;
}
</style>