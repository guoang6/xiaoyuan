<template>
  <div class="useruser">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>普通用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="search">
          <el-form :inline="true" :model="pagelistquery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="pagelistquery.user" placeholder="账号查找"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="pagelistquery.realstate" placeholder="实名认证状态">
                <el-option label="全部" value></el-option>
                <el-option label="未认证" value="1"></el-option>
                <el-option label="待认证" value="2"></el-option>
                <el-option label="认证通过" value="3"></el-option>
                <el-option label="认证失败" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="pagelistquery.companystate" placeholder="公司认证状态">
                <el-option label="全部" value></el-option>
                <el-option label="未认证" value="1"></el-option>
                <el-option label="待认证" value="2"></el-option>
                <el-option label="认证通过" value="3"></el-option>
                <el-option label="认证失败" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getuserlist">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          border
          style="width: 100%;min-height:500px"
        >
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="realstate" label="实名认证状态">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="changerealstatedialog(scope.row)"
              >{{ scope.row.realstate |userstatefilter}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="companystate" label="公司认证状态">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="changecompanystatedialog(scope.row)"
              >{{ scope.row.companystate |userstatefilter}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="activationdate" label="启用时间">
            <template slot-scope="scope">{{ scope.row.activationdate | dataFormat }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="uinfo.username !== 'guoang'"
                @click="activationdate(scope.row)"
              >封禁解封</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="uinfo.username !== 'guoang'"
                @click="deleteuser(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.username== 'guoang'||uinfo.username !== 'guoang'"
                @click="changepw(scope.row)"
              >修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--密码框-->
        <el-dialog title="输入新的密码" :visible.sync="dialogpw" width="500px">
          <el-form :model="changepassword">
            <el-form-item label="账号" label-width="100px">{{changepassword.username}}</el-form-item>
            <el-form-item label="新密码" label-width="100px">
              <el-input v-model="changepassword.newpassword" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogpw = false">取 消</el-button>
            <el-button type="primary" @click="change">确 定</el-button>
          </div>
        </el-dialog>
        <!--公司信息认证-->
        <el-dialog title="公司信息认证" :visible.sync="dialogcompany">
          <div v-if="changecompanystateuser.companystate===1">
            <img src="../../assets/img/noinfo.png" width="100%" alt />
            <div style="width:100%;text-align:center">该用户还没有添加公司认证信息</div>
          </div>
          <el-form v-else>
            <el-form-item label="公司名称">{{changecompanystateuser.companyname}}</el-form-item>
            <el-form-item label="相关信息图片">
              <img
                v-for="(img,id) in changecompanystateuser.companyimg"
                style="width:40% ;margin:20px"
                :key="id"
                :src="img.url"
                alt
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="changecompanystateuser.companystate===1">
            <el-button @click="dialogcompany = false">取消</el-button>
          </div>
          <div slot="footer" v-else class="dialog-footer">
            <el-button
              type="primary"
              v-if="changecompanystateuser.companystate!==3"
              @click="changestate('companystate',3,changecompanystateuser.user_id,changecompanystateuser.companyname)"
            >通过认证</el-button>
            <el-button
              type="danger"
              @click="changestate('companystate',0,changecompanystateuser.user_id)"
            >不通过认证</el-button>
            <el-button @click="dialogcompany = false">取消</el-button>
          </div>
        </el-dialog>
        <!--用户信息认证-->
        <el-dialog title="用户认证信息" :visible.sync="dialogstudent">
          <div v-if="changerealstateuser.realstate===1">
            <img src="../../assets/img/noinfo.png" width="100%" alt />
            <div style="width:100%;text-align:center">该用户还没有添加认证信息</div>
          </div>
          <el-form v-else>
            <el-form-item label="学号">{{changerealstateuser.realname}}</el-form-item>
            <el-form-item label="姓名">{{changerealstateuser.studentid}}</el-form-item>
            <el-form-item label="学生证">
              <img
                v-for="(img,id) in changerealstateuser.studentcard"
                style="width:40% ;margin:20px"
                :key="id"
                :src="img.url"
                alt
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="changerealstateuser.realstate===1">
            <el-button @click="dialogstudent = false">取消</el-button>
          </div>
          <div slot="footer" v-else class="dialog-footer">
            <el-button
              type="primary"
              v-if="changerealstateuser.realstate!==3"
              @click="changestate('realstate',3,changerealstateuser.user_id)"
            >通过认证</el-button>
            <el-button
              type="danger"
              @click="changestate('realstate',0,changerealstateuser.user_id)"
            >不通过认证</el-button>
            <el-button @click="dialogstudent = false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="封禁时间(天)" :visible.sync="activationttime.dialog" width="500px">
          <el-form :model="activationttime">
            <el-form-item label>
              <el-input v-model="activationttime.time"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="activationttime.dialog = false">取 消</el-button>
            <el-button type="primary" @click="changeactivationdate">确 定</el-button>
          </div>
        </el-dialog>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagelistquery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagelistquery.total"
          style="margin-top: 20px;"
        ></el-pagination>
      </div>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "useruser",
  data() {
    return {
      changepassword: {}, //修改密码弹窗数据
      changerealstateuser: {}, //正在审核的用户信息
      changecompanystateuser: {}, //公司认证信息
      dialogstudent: false,
      dialogcompany: false,
      dialogpw: false, //密码框
      loading: false,
      pagelistquery: {
        realstate: "",
        companystate: "",
        total: 0,
        page: 1,
        pagesize: 10,
        user: "",

      },
      tableData: [], //列表信息

      activationttime: {
        time: 0,
        userid: "",
        jubao_id: "",
        dialog: false //密码框
      }
    };
  },
  computed: {
    ...mapState({
      uinfo: state => state.user.uinfo
    })
  },
  filters: {
    userstatefilter(state) {
      if (state == 3) {
        return "认证成功";
      }
      if (state == 2) {
        return "待审核";
      }
      if (state == 1) {
        return "未认证";
      }
      if (state == 0) {
        return "认证失败";
      }
    }
  },
  methods: {
    activationdate(row) {
      this.activationttime.userid = row.user_id;
      this.activationttime.dialog = true;
    },
    //修改账号封禁时间
    async changeactivationdate() {
      this.changepassword.type = "adminuser";
      let res = await this.$axios.post(
        "/admin/changeactivationdate",
        this.qs.stringify(this.activationttime)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("操作成功");
        this.getuserlist();
        this.activationttime.dialog = false;
      }
    },
    async changestate(type, state, userid, companyname) {
      let data = {
        type: type,
        state: state,
        user_id: userid,
        company_name: companyname
      };
      let res = await this.$axios.post(
        "/admin/changeuserstate",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("操作成功成功");
        this.getuserlist();
        this.dialogstudent = false;
        this.dialogcompany = false;
      }
    },
    changepw(row) {
      console.log(111);
      this.dialogpw = true;
      this.changepassword = row;
    },
    //修改密码
    async change() {
      this.changepassword.type = "adminuser";
      let res = await this.$axios.post(
        "/admin/changepassword",
        this.qs.stringify(this.changepassword)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("修改成功");
        this.dialogpw = false;
      }
    },
    //删除用户

    async deleteuser(row) {
      let data = {
        user_id: row.user_id,
        usertype: "user"
      };
      let res = await this.$axios.post(
        "/admin/deleteuser",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.dialogpw = false;
        this.getuserlist();
      }
    },
    //用户状态修改
    async changeuseruserstate(row) {
      console.log(row);
      let res = await this.$axios.post(
        "/admin/changeuseruserstate",
        this.qs.stringify(row)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("状态修改成功");
      }
    },
    //公司认证信息
    changecompanystatedialog(user) {
      this.changecompanystateuser = JSON.stringify(user);
      this.changecompanystateuser = JSON.parse(this.changecompanystateuser);
      this.changecompanystateuser.companyimg = JSON.parse(
        this.changecompanystateuser.companyimg
      );
      this.dialogcompany = true;
    },
    //学生认证信息
    changerealstatedialog(user) {
      this.changerealstateuser = JSON.stringify(user);
      this.changerealstateuser = JSON.parse(this.changerealstateuser);
      this.changerealstateuser.studentcard = JSON.parse(
        this.changerealstateuser.studentcard
      );
      this.dialogstudent = true;
    },

    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.getuserlist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getuserlist();
      console.log(`当前页: ${val}`);
    },
    async getuserlist() {
      console.log(this.pagelistquery)
      this.loading = true;
      let res = await this.$axios.post(
        "/admin/getuserlist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
        this.pagelistquery.total = res.data.count;
        this.loading = false;
      }
    },
    jubao() {
      console.log(1)
      this.pagelistquery.user = this.$route.query.user;
      this.activationttime.jubao_id = this.$route.query.jubao_id;
    }
  },
  created() {
    this.$route.query .user&& this.jubao();
    this.getuserlist();
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
.useruser {
  position: relative;
  width: 100%;
}
.main {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
}
</style>