<template>
  <div class="createoldstufflist">
    <h2>二手信息</h2>
    <el-tabs type="border-card">
      <!--发布二手信息-->
      <el-tab-pane label="发布二手">
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="$router.push('/admin/createoldstuff') "
        >发布二手信息</el-button>

        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="createtime" label="日期">
            <template slot-scope="scope">{{ scope.row.createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="oldstuff_name" label="名称"></el-table-column>
          <el-table-column prop="oldstuff_lable" label="分类"></el-table-column>
          <el-table-column prop="oldstuff_price" label="价格"></el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="$router.push(`/admin/updateoldstuff/${scope.row.oldstuff_id}`) "
                type="text"
                size="small"
              >编辑</el-button>
              <el-button type="text" size="small" @click="del(scope.row.oldstuff_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagelistquery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagelistquery.total"
        ></el-pagination>
      </el-tab-pane>

      <!--寻找二手信息-->
      <el-tab-pane label="我想要的">
        <el-table :data="jointableData" border style="width: 100%">
          <el-table-column fixed prop="createtime" label="添加日期">
            <template slot-scope="scope">{{ scope.row.joins_createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="oldstuff_name" label="名称"></el-table-column>
          <el-table-column prop="oldstuff_price" label="价格"></el-table-column>
          <el-table-column prop="name" label="我的报价"></el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small">
                <a
                  style="color:#409eff"
                  target="_blank"
                  :href="`${url}/#/oldstuffcontent/${scope.row.oldstuff_id}` "
                >查看</a>
              </el-button>
              <el-button type="text" size="small" @click="deljoin(scope.row.join_id)">取消意向</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pagelistquery: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      tableData: [],
      jointableData: []
    };
  },
  computed: {
    ...mapState({
      url: state => state.url
    })
  },
  methods: {
    async del(oldstuff_id) {
      console.log(oldstuff_id);
      let res = await this.$axios.post(
        "/webadmin/deleteoldstuff",
        this.qs.stringify({ oldstuff_id: oldstuff_id })
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.getoldstufflist();
      }
    },
    async deljoin(id) {
      let res = await this.$axios.post(
        "/webadmin/deletejoin",
        this.qs.stringify({ id: id })
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("取消成功");
        this.getoldstuffjoinlist();
      }
    },
    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.getoldstufflist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getoldstufflist();
      console.log(`当前页: ${val}`);
    },
    async getoldstufflist() {
      let data = {
        page: this.pagelistquery.page,
        pagesize: this.pagelistquery.pagesize
      };
      let res = await this.$axios.post(
        "/webadmin/getweboldstufflist",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
        this.pagelistquery.total = res.data.count;
      }
    },
    async getoldstuffjoinlist() {
      let res = await this.$axios.post(
        "/webadmin/joinslist",
        this.qs.stringify({ type: "oldstuffcontent" })
      );
      if (res.data.state.type === "SUCCESS") {
        this.jointableData = res.data.data;
        console.log("我参加的");
        console.log(res.data);
      }
    }
  },
  created() {
    this.getoldstufflist();
    this.getoldstuffjoinlist();
  }
};
</script>