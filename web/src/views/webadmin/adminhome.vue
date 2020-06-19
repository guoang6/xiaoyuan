<template>
  <div class="adminhome">
    <div class="left">
      <li class="comment even thread-odd thread-alt depth-1" id="li-comment-4">
        <article id="comment-4">
          <img :src="form.avatar" class="avatar touxiang avatar-60 photo" height="60" width="60" />

          <div class="comment-meta">
            <h5 class="author">{{form.nickname}}</h5>

            <p class="date" v-if="form.realstate==3">认证用户</p>
            <p class="date" v-else>未认证用户</p>
          </div>
          <div @click="$router.push('/admin/myself') ">编辑信息</div>
        </article>
      </li>
      <div class="xinxi">
        <p style="  color: #000;">邮箱：</p>
        <p>{{form.mail}}</p>
      </div>
      <div class="xinxi">
        <p style="  color: #000;">QQ：</p>
        <p>{{form.qq}}</p>
      </div>
      <div class="xinxi">
        <p style="  color: #000;">个人简介：</p>
        <p>{{form.synopsis}}</p>
      </div>
    </div>
    <div class="right" style=" width: 70%;">
      <chart style=" width: 100%;" :options="optioncontentshadow" :auto-resize="true"></chart>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      optioncontentshadow: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      }
    };
  },
  methods: {
    //获取用户信息

    async getuser() {
      let res = await this.$axios.post("/webadmin/getuser");
      this.form = res.data.data;
      console.log(this.form);
      console.log(res);
    },
    async getusernumbering() {
      let res = await this.$axios.post("/webadmin/getusernumbering");
      this.optioncontentshadow.series[0].data.push(res.data.data.help,res.data.data.activity,res.data.data.article,res.data.data.job,res.data.data.oldstuff)
      this.optioncontentshadow.xAxis[0].data = ['问答交流','校内活动','文章新闻','岗位','二手'];
      console.log(res.data.data);
    }
  },
  created() {
    this.getuser();
    this.getusernumbering();
  }
};
</script>
<style scoped>

.left {
  width: 30%;
  float: left;

}
.right {
  width: 60%;
  float: left;
}

</style>
<style >
.xinxi p {
  display: inline;
}
.xinxi {
  margin-top: 30px;
  margin-left: 30px;
}
li {list-style-type:none;}
</style>