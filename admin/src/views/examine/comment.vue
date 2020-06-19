<template>
  <div class="comment">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>审核中心</el-breadcrumb-item>
          <el-breadcrumb-item>评论审核</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="search">
          <el-form :inline="true" :model="pagelistquery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="pagelistquery.admin" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="pagelistquery.state" placeholder="状态">
                <el-option label="全部" value></el-option>
                <el-option label="待审核" value="0"></el-option>
                <el-option label="审核通过" value="1"></el-option>

                <el-option label="审核未通过" value="-1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="getcommentlist">查询</el-button>
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
          <!-- @expand-change="getreply" -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.child" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="createtime" label="创建日期">
                  <template slot-scope="scope">{{ scope.row.comment_createtime | dataFormat }}</template>
                </el-table-column>
                <el-table-column label="回复者" prop="nickname"></el-table-column>
                <el-table-column label="被回复者" prop="tousernickname"></el-table-column>
                <el-table-column label="状态" prop="comment_ispublic">
                  <template slot-scope="scope">
                    <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
                    <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
                    <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column label="回复内容" prop="desc">
                  <template slot-scope="scope">
                    <el-popover placement="right" width="400" trigger="hover">
                      <span v-html="scope.row.reply_content"></span>
                      <el-button type="text" slot="reference">回复类容</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="审核人" prop="admin"></el-table-column>

                <el-table-column fixed="right" label="操作" width="250">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      v-if="scope.row.ispublic==1"
                      @click="changestate('reply',-1,scope.row.reply_id)"
                    >不通过审核</el-button>
                    <el-button
                      type="text"
                      size="small"
                      v-if="scope.row.ispublic==0"
                      @click="changestate('reply',1,scope.row.reply_id)"
                    >通过审核</el-button>
                    <el-button
                      type="text"
                      size="small"
                      v-if="scope.row.ispublic==0"
                      @click="changestate('reply',-1,scope.row.reply_id)"
                    >不通过审核</el-button>
                    <el-button
                      type="text"
                      size="small"
                      v-if="scope.row.ispublic==-1"
                      @click="changestate('reply',1,scope.row.reply_id)"
                    >通过审核</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="del(scope.row.reply_id,'reply')"
                      :disabled="uinfo.username !== 'guoang'"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" label="创建日期">
            <template slot-scope="scope">{{ scope.row.comment_createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column label="评论者" prop="nickname"></el-table-column>
          <el-table-column label="状态" prop="comment_ispublic">
            <template slot-scope="scope">
              <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
              <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
              <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
            </template>
          </el-table-column>
          <el-table-column label="评论内容" prop="desc">
            <template slot-scope="scope">
              <el-popover placement="right" width="400" trigger="hover">
                <span v-html="scope.row.comment_content"></span>
                <el-button type="text" slot="reference">评论类容</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="审核人" prop="admin"></el-table-column>

          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.ispublic==1"
                @click="changestate('comment',-1,scope.row.comment_id)"
              >不通过审核</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.ispublic==0"
                @click="changestate('comment',1,scope.row.comment_id)"
              >通过审核</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.ispublic==0"
                @click="changestate('comment',-1,scope.row.comment_id)"
              >不通过审核</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.ispublic==-1"
                @click="changestate('comment',1,scope.row.comment_id)"
              >通过审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.comment_id,'comment')"
                :disabled="uinfo.username !== 'guoang'"
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
import { mapState, mapActions } from "vuex";

export default {
  name: "comment",
  computed: {
    ...mapState({
      uinfo: state => state.user.uinfo
    })
  },
  data() {
    return {
      loading: false,

      pagelistquery: {
        admin: "",
        state: "",
        total: 0,
        page: 1,
        pagesize: 10
      },
      tableData: []
    };
  },
  methods: {
    async getreply() {
      for (let index = 0; index < this.tableData.length; index++) {
        let res = await this.$axios.post(
          "/admin/getreply",
          this.qs.stringify({ comment_id: this.tableData[index].comment_id })
        );
        if (res.data.state.type === "SUCCESS") {
          console.log(res.data.data);
          this.tableData[index].child = res.data.data;
        }
      }
    },
    async changestate(type, state, id) {
      let data = {
        id: id,
        type: type,
        state: state
      };
      let res = await this.$axios.post(
        "/admin/changecontentstate",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("操作成功");
        this.getcommentlist();
        this.dialog = false;
      }
    },
    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.getcommentlist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getcommentlist();
      console.log(`当前页: ${val}`);
    },
    async del(id, type) {
      let data = {
        id: id,
        type: type
      };
      let res = await this.$axios.post(
        "/admin/admindelete",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.getcommentlist();
      }
    },
    async getcommentlist() {
      this.loading = true;
      let res = await this.$axios.post(
        "/admin/getcomment",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data.data);
        this.pagelistquery.total = res.data.count;
        this.getreply();
      }
      this.loading = false;
    }
  },
  created() {
    this.getcommentlist();
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
.comment {
  position: relative;
  width: 100%;
}
.main {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
}
</style>