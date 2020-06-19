<template>
  <div class="contentexamine">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据中心</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <div class="main card">
          <p>内容(条)</p>
          <h2 style="margin-top:-7px">{{contentcount}}</h2>
        </div>
        <div class="card" style="width:2% ;height:20px"></div>
        <div class="main card">
          <p>评论(条)</p>
          <h2 style="margin-top:-7px">{{commentcount}}</h2>
        </div>
        <div class="card" style="width:2% ;height:20px"></div>
        <div class="main card">
          <p>用户(个)</p>
          <h2 style="margin-top:-7px">{{usercount}}</h2>
        </div>
        <div style="clear:both"></div>
      </div>

      <div class="main tags">
        <el-tabs value="first" @tab-click="handleClick">
          <el-tab-pane label="用户新增趋势" name="first">
            <chart ref="chart1" style="width:100%" :options="orgOptionsuser" :auto-resize="true"></chart>
          </el-tab-pane>
          <el-tab-pane label="内容数据" name="second">
            <div v-if="tabname=='second'">
              <div style="float:left;width:55%">
                <chart :options="optioncontentshadow" :auto-resize="true"></chart>
              </div>
              <div style="float:left;width:40%">
                <chart :options="optioncontentpie" :auto-resize="true"></chart>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="交流活跃趋势" name="third">
            <chart
              v-if="tabname=='third'"
              ref="chart1"
              style="width:100%"
              :options="orgOptionscomment"
              :auto-resize="true"
            ></chart>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "numbering",
  data() {
    return {
      commentcount: 0,
      contentcount: 0,
      usercount: 0,
      count: [],
      tabname: "",
      data: {},
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
      },
      optioncontentpie: {
        title: {
          text: "某站点用户访问来源",
          subtext: "纯属虚构",
          left: "center"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      orgOptionsuser: {
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line"
          }
        ]
      },
      orgOptionscomment: {
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line"
          }
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      this.tabname = tab.name;
    },
    async numbering() {
      let res = await this.$axios.post("/admin/numbering");
      if (res.data.state.type === "SUCCESS") {
        this.data = res.data.data;
        console.log(this.data);
        this.data.user.forEach(element => {
          this.orgOptionsuser.series[0].data.push(element.num);
          this.orgOptionsuser.xAxis.data.push(element.time);
        });
        this.data.comment.forEach(element => {
          this.orgOptionscomment.series[0].data.push(element.num);
          this.orgOptionscomment.xAxis.data.push(element.time);
        });
        this.data.count.forEach(element => {
          if (element.table_name == "help") {
            this.count.push({ name: "交流/问答", value: element.table_rows });
            this.contentcount = this.contentcount + element.table_rows;
          }
          if (element.table_name == "activity") {
            this.count.push({ name: "活动", value: element.table_rows });
            this.contentcount = this.contentcount + element.table_rows;
          }
          if (element.table_name == "oldstuff") {
            this.count.push({ name: "二手", value: element.table_rows });
            this.contentcount = this.contentcount + element.table_rows;
          }
          if (element.table_name == "job") {
            this.count.push({ name: "工作", value: element.table_rows });
          }
          if (element.table_name == "article") {
            this.count.push({ name: "文章新闻", value: element.table_rows });
            this.contentcount = this.contentcount + element.table_rows;
          }
          if (element.table_name == "comment") {
            this.commentcount = this.commentcount + element.table_rows;
          }
          if (element.table_name == "reply") {
            this.commentcount = this.commentcount + element.table_rows;
          }
          if (element.table_name == "user") {
            this.usercount = this.usercount + element.table_rows;
          }
        });

        this.count.forEach(element => {
          this.optioncontentshadow.series[0].data.push(element.value);
          this.optioncontentpie.series[0].data.push(element);
          this.optioncontentshadow.xAxis[0].data.push(element.name);
        });
      }
    }
  },
  created() {
    this.numbering();
  }
};
</script>
<style  scoped>
.top {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 35px);
  padding: 12px 16px;
  background-color: #fff;
}
.contentexamine {
  position: relative;
  width: 100%;
}
.main {
  margin-top: 40px;
  padding: 5px 40px 20px 40px;
  background-color: #fff;
}
.card {
  width: 25%;

  /* padding: 5px 20px 5px 20px; */
  float: left;
  /* margin: 1%; */
  /* margin-top: 40px; */
}
/* .tags {
  padding: 5px 20px 5px 20px;
  margin: 30px;
  margin-top: 0px;
} */
</style>