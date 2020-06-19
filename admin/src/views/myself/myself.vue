<template>
  <div class="myself">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="user-info clearfix">
          <h4>账号信息</h4>
          <el-divider></el-divider>
          <ul class="first-userInfo">
            <li class="user-li">
              账号 :
              <span class="user-name" title="726647774@qq.com">{{tableData.username}}</span>
            </li>
            <li>
              昵称 :
              <span>{{tableData.nickname}}</span>
              <el-button type="text" size="small" @click="name=true">修改昵称</el-button>
              <el-input
                style
                v-if="name"
                v-model="tableData.nickname"
                @keyup.enter.native="changeadminuser()"
              ></el-input>
            </li>
            <li>
              账号创建时间 :
              <span>{{tableData.user_createtime | dataFormat }}</span>
            </li>
          </ul>
          <ul>
            <li>
              账号状态 :
              <span v-if="tableData.user_state=='1'">启用</span>
              <span v-else>停用</span>
            </li>
            <li>
              身份 :
              <span style="margin-left:20px" v-if="tableData.username=='guoang'">超级管理员</span>
              <span style="margin-left:20px" v-else>普通管理员管理员</span>
            </li>
            <li>
              权限 :
              <span
                style="margin-left:20px"
                v-if="tableData.issh=='1'&&tableData.username!=='guoang'"
              >审核中心</span>
              <span
                style="margin-left:20px"
                v-if="tableData.isyh=='1'&&tableData.username!=='guoang'"
              >用户中心</span>
              <span
                style="margin-left:20px"
                v-if="tableData.isgl=='1'&&tableData.username!=='guoang'"
              >平台管理中心</span>
              <span
                style="margin-left:20px"
                v-if="tableData.isfk=='1'&&tableData.username!=='guoang'"
              >反馈中心</span>
              <span style="margin-left:20px" v-if="tableData.username=='guoang'">超级管理员拥有最高权限</span>
            </li>
          </ul>
          <ul>
            <li>
              密码 :
              <el-button type="text" size="small" @click="password=true">修改密码</el-button>
              <el-input
                style
                v-if="password"
                v-model="tableData.newpassword"
                @keyup.enter.native="changeadminuser()"
              ></el-input>
            </li>
          </ul>
          <div style="clear:both"></div>
          <!--占位-->
        </div>
        <div class="renwu">
          <h4>职责</h4>
          <el-divider></el-divider>
          <div v-if="uinfo.jurisdiction.issh =='1'|| uinfo.username == 'guoang'">
            <span>网站内容的审核，用户评论的审核</span>
            <el-divider></el-divider>
          </div>
          <div v-if="uinfo.jurisdiction.isyh =='1'|| uinfo.username == 'guoang'">
            <span>用户的学生认证，公司认证，用户账号状态的管理</span>
            <el-divider></el-divider>
          </div>
          <div v-if="uinfo.jurisdiction.isgl=='1'|| uinfo.username == 'guoang'">
            <span>网站轮播图的管理，各模块分类的管理</span>
            <el-divider></el-divider>
          </div>
          <div v-if="uinfo.jurisdiction.isfk =='1'|| uinfo.username == 'guoang'">
            <span>用户反馈信息的管理，用户举报信息的管理</span>
            <el-divider></el-divider>
          </div>
          <div v-if="uinfo.username == 'guoang'">
            <span>管理员账号的管理，网站内容的删除</span>
            <el-divider></el-divider>
          </div>
          <div v-if="uinfo.user_state == '0'">
            <span>你的账号现在是停用状态</span>
            <el-divider></el-divider>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "myself",
  data() {
    return {
      name: false,
      password: false,
      formInline: {
        user: "",
        region: ""
      },
      pagelistquery: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      tableData: [] //列表信息
    };
  },
  computed: {
    ...mapState({
      uinfo: state => state.user.uinfo
    })
  },
  methods: {
    async changeadminuser() {
      let res = await this.$axios.post(
        "/admin/changeadminuser",
        this.qs.stringify(this.tableData)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("操作成功");
        this.getadmin();
        this.name = false;
        this.password = false;
      }
    },

    async getadmin() {
      let res = await this.$axios.post("/admin/getadmin");
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
      }
    }
  },
  created() {
    this.getadmin();
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
.myself {
  position: relative;
  width: 100%;
}
.main {
  margin-top: 40px;
  padding: 2px 20px 20px 20px;
  background-color: #fff;
}
.first-userInfo {
  padding-left: 20px;
}
.user-info ul {
  float: left;
  width: 30%;
  margin-top: -10px;
}
.user-info li {
  margin-top: 10px;
}
</style>