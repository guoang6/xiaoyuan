<template>
  <div class="useruser">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>管理员用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="search">
          <el-form :inline="true" :model="pagelistquery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="pagelistquery.user" placeholder="账号模糊查找"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="pagelistquery.state" placeholder="账号状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getadminlist">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogFormVisibleadd=true">添加账号</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog title="添加新的账号" :visible.sync="dialogFormVisibleadd" width="500px">
          <el-form :model="form">
            <el-form-item label="账号" label-width="100px">
              <el-input v-model="user.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px">
              <el-input type="password" v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="100px">
              <el-input type="password" v-model="user.password1" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
            <el-button type="primary" @click="registered">确 定</el-button>
          </div>
        </el-dialog>

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

        <el-table
          :data="tableData"
          border
          style="width: 100%;min-height:500px"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="nickname" label="审核中心">
            <template slot-scope="scope">
              <el-switch
                @click.native.prevent="changestate(scope.row)"
                v-model="scope.row.issh"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="nickname" label="用户管理">
            <template slot-scope="scope">
              <el-switch
                @click.native.prevent="changestate(scope.row)"
                v-model="scope.row.isyh"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="nickname" label="网站管理中心">
            <template slot-scope="scope">
              <el-switch
                @click.native.prevent="changestate(scope.row)"
                v-model="scope.row.isgl"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="nickname" label="反馈中心">
            <template slot-scope="scope">
              <el-switch
                @click.native.prevent="changestate(scope.row)"
                v-model="scope.row.isfk"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="nickname" label="账号状态">
            <template slot-scope="scope">
              <el-switch
                @click.native.prevent="changestate(scope.row)"
                v-model="scope.row.user_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="nickname" fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.username == 'guoang'"
                @click="deleteuser(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                :disabled="scope.row.username == 'guoang'"
                size="small"
                @click="changepw(scope.row)"
              >修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>

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
export default {
  name: "admin",
  data() {
    return {
      changepassword: {},
      dialogpw: false, //密码框
      loading: false,
      dialogFormVisibleadd: false, //添加弹框
      form: {},
      user: {
        username: "",
        password: "",
        password1: ""
      },
      pagelistquery: {
        total: 0,
        page: 1,
        pagesize: 10,
        user: "",
        state: ""
      },
      tableData: [] //列表信息
    };
  },
  methods: {
    registered() {
      const userReg = /^[1-9a-zA-Z]{1}[0-9a-zA-Z]{5,9}$/; //6-10位字母数字
      const pwdReg = /^[a-zA-Z]\w{5,17}$/; //6-18位字母数字下划线 字母开头
      if (!userReg.test(this.user.username)) {
        this.$message.error("账号为6-10位字母数字字母");
        return;
      }
      if (!pwdReg.test(this.user.password)) {
        this.$message.error("密码为6-18位字母数字或下划线 字母开头");
        return;
      }
      if (this.user.password !== this.user.password1) {
        this.$message.error("两次密码不相等");
        return;
      }
      this.$axios({
        url: "/admin/registered",
        method: "POST",
        data: this.qs.stringify(this.user)
      })
        .then(res => {
          let data = res.data;
          if (data.state.type !== "SUCCESS") {
            if (data.state.type == "ERROR_PARAMS_EXIST") {
              this.$message.error("账户名重复");
            } else {
              this.$message.error("账号添加失败失败");
            }
            return;
          }
          this.$message.success("账号添加成功");
          this.dialogFormVisibleadd = false;
          this.getadminlist();
        })
        .catch(e => {
          this.$message.error(e);
        });
    },
    async changestate(row) {
      console.log(row);
      let res = await this.$axios.post(
        "/admin/changeadminstate",
        this.qs.stringify(row)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("更改授权成功");
      }
    },
    changepw(row) {
      this.dialogpw = true;
      this.changepassword = row;
    },
    //修改密码
    async change() {
      this.changepassword.type = "adminadmin";
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
        usertype: "admin"
      };
      let res = await this.$axios.post(
        "/admin/deleteuser",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.getadminlist();
      }
    },
    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.getadminlist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getadminlist();
      console.log(`当前页: ${val}`);
    },
    async getadminlist() {
      this.loading = true;
      let res = await this.$axios.post(
        "/admin/getadminlist",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data.data);
        this.pagelistquery.total = res.data.count;
      }
      this.loading = false;
    }
  },
  created() {
    this.getadminlist();
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