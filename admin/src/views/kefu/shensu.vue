<template>
  <div class="fankui">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>客服中心</el-breadcrumb-item>
          <el-breadcrumb-item>账号申诉</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="search">
          <el-form :inline="true" :model="pagelistquery" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="pagelistquery.state" placeholder="账号状态">
                <el-option label="已处理" value="1"></el-option>
                <el-option label="未处理" value="0"></el-option>
                <el-option label="标记" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="kefulist">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table
          :data="tableData"
          border
          style="width: 100%;min-height:500px"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column prop="createtime" label="创建日期">
            <template slot-scope="scope">{{ scope.row.shensu_createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="shensu_user" label="申诉账号"></el-table-column>
          <el-table-column prop="shensu_content" label="申诉内容"></el-table-column>
          <el-table-column prop="shensu_jubao_id"  label="被封禁原因" >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="tojubao(scope.row)">查看被封禁原因</el-button>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="jubao_state">
            <template slot-scope="scope">
              <span style="color:#409eff" v-if="scope.row.shensu_state==0">未处理</span>
              <span style="color:#6cbb7a" v-if="scope.row.shensu_state==1">已处理</span>
              <span style="color:#f60c6c" v-if="scope.row.shensu_state==2">标记</span>
            </template>
          </el-table-column>
          <el-table-column prop="admin" label="管理员"></el-table-column>
          <el-table-column prop="nickname" fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="touser(scope.row)">去处理</el-button>
              <el-button type="text" size="small" @click="changestate(scope.row,2)">标记</el-button>
              <el-button type="text" size="small" @click="changestate(scope.row,1)">已处理</el-button>

              <el-button
                type="text"
                size="small"
                :disabled="scope.row.username == 'guoang'"
                @click="deletkefu(scope.row)"
              >删除</el-button>
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
      result: "",
      changepassword: {},
      dialog: false, //结果框
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
        kefu_type: "shensu",
        state: "0",
        id:''
      },
      row: {},
      tableData: [] //列表信息
    };
  },
  methods: {
  

    async changestate(row, state) {
      let data = {
        kefu_id: row.shensu_id,
        kefu_state: state,
        type: "shensu"
      };
      let res = await this.$axios.post(
        "/admin/changkefustate",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("状态更改成功");
        this.kefulist();
      }
    },
    touser(row) {
      this.$router.push({
        path: "/useruser",
        query: { user: row.shensu_user, jubao_id: "" }
      });
    },
        tojubao(row) {
      this.$router.push({
        path: "/jubao",
        query: { jubao_id: row.shensu_jubao_id}
      });
    },
    //删除
    async deletkefu(row) {
      let res = await this.$axios.post(
        "/admin/deletekefu",
               this.qs.stringify({ id: row.shensu_id,type:'shensu' })

      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.kefulist();
      }
    },
    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.kefulist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.kefulist();
      console.log(`当前页: ${val}`);
    },
    async kefulist() {
      this.loading = true;
      let res = await this.$axios.post(
        "/admin/kefullist",
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
    this.kefulist();
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
.fankui {
  position: relative;
  width: 100%;
}
.main {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
}
</style>