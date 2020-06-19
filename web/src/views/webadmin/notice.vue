<template>
  <div class="notice">
    <h3>未读消息：{{unread}}/{{num}}</h3>
    <div style="position:relative ;height:30px">
      <div class="del">
        <el-button
          type="text"
          icon="el-icon-view"
          v-if="unread!==0"
          @click="changenotice('changeall','a') "
        >全部已读</el-button>
        <el-button
          type="text"
          v-if="num!==0"
          icon="el-icon-delete"
          @click="changenotice('deleteall','a')"
        >全部删除</el-button>
      </div>
    </div>

    <el-divider></el-divider>
    <div v-if="num==0">
      <img src="../../assets/images/noinfo.png" width="100%" alt />
      <div style="width:100%;text-align:center">暂无消息通知</div>
    </div>
    <div style="position:relative" v-for="(notice,id) in tableData" :key="id">
      <div
        style="width:10px;height:10px;border-radius:50%;display:inline-block"
        :class="`state${notice.state}`"
      ></div>
      <span style="margin-left:20px">{{notice.createtime| dataFormat}}</span>
      <span style="margin-left:20px">{{notice.nickname}}</span>
      <span style="margin-left:20px">{{notice.action}}</span>
      <span style="margin-left:20px">
        来自 {{notice.router| platename}}
        <a
          style="font-size:20px"
          @click="changenotice('change',notice.notice_id)"
          :href="`${url}/#/${notice.router}/${notice.content_id}`"
          target="_blank"
        >{{notice.content_name}}</a>
      </span>
      <i class="el-icon-delete del" @click="changenotice('delete',notice.notice_id)"></i>
      <el-divider></el-divider>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "notice",
  data() {
    return {
      tableData: "",
      num: 0
    };
  },
  filters: {
    platename(router) {
      if (router == "helpcontent") {
        return "问答";
      }
      if (router == "oldstuffcontent") {
        return "二手交易";
      }
    }
  },
  computed: {
    ...mapState({
      unread: state => state.user.unread,
      url: state => state.url
    })
  },
  methods: {
    ...mapActions("user", ["setunread"]),
    async getnoticelist() {
      let res = await this.$axios.post(
        "/web/getnotice",
        this.qs.stringify({ num: "" })
      );
      if (res.data.state.type === "SUCCESS") {
        this.setunread(res.data.data.count);
        this.tableData = res.data.data.list;
        this.num = res.data.data.num;
        console.log("消息列表");
        console.log((this.tableData = res.data.data.list));
        // this.pagelistquery.total = res.data.count;
      }
    },
    async changenotice(change, notice_id) {
      let res = await this.$axios.post(
        "/web/changenotice",
        this.qs.stringify({ change: change, notice_id: notice_id })
      );
      if (res.data.state.type === "SUCCESS") {
        this.getnoticelist();
      }
    }
  },
  created() {
    this.getnoticelist();
  }
};
</script>
<style  scoped>
.del {
  position: absolute;
  right: 40px;
  top: 4px;
}
.state0 {
  background-color: red;
}
</style>