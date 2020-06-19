<template>
  <div id="contentexamine" class="contentexamine">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>审核中心</el-breadcrumb-item>
          <el-breadcrumb-item>内容审核</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main">
        <div class="search">
          <el-form :inline="true" :model="pagelistquery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="pagelistquery.user" placeholder="用户"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="pagelistquery.admin" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="pagelistquery.search" placeholder="关键字"></el-input>
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
              <el-select v-model="pagelistquery.type" placeholder="模块">
                <el-option label="问答交流" value="help"></el-option>
                <el-option label="校园活动" value="activity"></el-option>
                <el-option label="二手信息" value="oldstuff"></el-option>
                <el-option label="招聘信息" value="job"></el-option>
                <el-option label="文章新闻" value="article"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getcontentlist">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 弹框-->
        <el-dialog title="详情" :visible.sync="dialog">
          <el-form v-if="this.pagelistquery.type=='help'">
            <el-form-item label="标题">{{content.help_title}}</el-form-item>
            <el-form-item label="分类">{{content.help_lable}}</el-form-item>
            <el-form-item label="内容">
              <span v-html="content.help_content"></span>
            </el-form-item>
          </el-form>

          <el-form v-if="this.pagelistquery.type=='activity'">
            <el-form-item label="标题">{{content.activity_title}}</el-form-item>
            <el-form-item label="分类">{{content.activity_lable}}</el-form-item>
            <el-form-item label="地点">{{content.activity_locale}}</el-form-item>
            <el-form-item
              label="时间"
            >{{content.activity_statetime| dataFormat }}——{{content.activity_endtime| dataFormat }}</el-form-item>
            <el-form-item label="内容">
              <span v-html="content.activity_content"></span>
            </el-form-item>
          </el-form>

          <el-form v-if="this.pagelistquery.type=='job'">
            <el-form-item label="岗位">{{content.job_name}}</el-form-item>
            <el-form-item label="薪资">{{content.job_salary}}</el-form-item>
            <el-form-item label="人数">{{content.job_num}}</el-form-item>
            <el-form-item label="分类">{{content.job_lable}}</el-form-item>
            <el-form-item label="内容">
              <span v-html="content.job_content"></span>
            </el-form-item>
          </el-form>

          <el-form v-if="this.pagelistquery.type=='article'">
            <el-form-item label="标题">{{content.article_title}}</el-form-item>
            <el-form-item label="分类">{{content.article_lable}}</el-form-item>
            <el-form-item label="分类">{{content.article_introduction}}</el-form-item>
            <el-form-item label="内容">
              <span v-html="content.article_content"></span>
            </el-form-item>
          </el-form>

          <el-form v-if="this.pagelistquery.type=='oldstuff'">
            <el-form-item label="实物">
              <img :src="content.oldstuff_img" alt width="300px" />
            </el-form-item>
            <el-form-item label="名称">{{content.oldstuff_name}}</el-form-item>
            <el-form-item label="价格">{{content.oldstuff_price}}</el-form-item>
            <el-form-item label="分类">{{content.oldstuff_lable}}</el-form-item>
            <el-form-item label="描述">
              <span v-html="content.oldstuff_content"></span>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changestate(1)">通过审核</el-button>
            <el-button type="danger" @click="changestate(-1)">不通过审核</el-button>
            <el-button @click="dialog = false">取消</el-button>
          </div>
        </el-dialog>
        <!--help-->
        <el-table
          :data="tableData"
          border
          style="width: 100%;min-height:500px"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          v-if="type=='help'"
        >
          <el-table-column fixed prop="createtime" label="创建日期">
            <template slot-scope="scope">{{ scope.row.createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="作者"></el-table-column>
          <el-table-column prop="help_title" label="标题">
            <template slot-scope="scope">{{scope.row.help_title}}</template>
          </el-table-column>
          <el-table-column prop="help_lable" label="分类"></el-table-column>
          <el-table-column prop="ispublic" label="状态">
            <template slot-scope="scope">
              <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
              <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
              <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="admin" label="审核人"></el-table-column>
          <el-table-column fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button @click=" shenhe(scope.row)" type="text" size="small">审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.help_id)"
                :disabled="uinfo.username !== 'guoang'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--activity-->
        <div v-if="type=='activity'">
          <el-table
            :data="tableData"
            border
            style="width: 100%;min-height:500px"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column fixed prop="createtime" label="创建日期">
              <template slot-scope="scope">{{ scope.row.activity_statetime | dataFormat }}</template>
            </el-table-column>
            <el-table-column prop="nickname" label="作者"></el-table-column>
            <el-table-column prop="activity_title" label="活动名称">
              <template slot-scope="scope">{{scope.row.activity_title}}</template>
            </el-table-column>
            <el-table-column prop="activity_locale" label="地点"></el-table-column>
            <el-table-column prop="activity_lable" label="分类"></el-table-column>
            <el-table-column prop="ispublic" label="状态">
              <template slot-scope="scope">
                <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
                <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
                <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="admin" label="审核人"></el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <el-button @click=" shenhe(scope.row)" type="text" size="small">审核</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="del(scope.row.activity_id)"
                  :disabled="uinfo.username !== 'guoang'"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--oldstuff-->
        <div v-if="type=='oldstuff'">
          <el-table
            :data="tableData"
            border
            style="width: 100%;min-height:500px"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column fixed prop="createtime" label="创建日期">
              <template slot-scope="scope">{{ scope.row.createtime | dataFormat }}</template>
            </el-table-column>
            <el-table-column prop="nickname" label="作者"></el-table-column>
            <el-table-column prop="nickname" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.oldstuff_img" alt="图片地址错误" height="100px" />
              </template>
            </el-table-column>
            <el-table-column prop="oldstuff_name" label="名称"></el-table-column>
            <el-table-column prop="oldstuff_lable" label="分类"></el-table-column>
            <el-table-column prop="ispublic" label="状态">
              <template slot-scope="scope">
                <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
                <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
                <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="admin" label="审核人"></el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <el-button @click=" shenhe(scope.row)" type="text" size="small">审核</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="del(scope.row.oldstuff_id)"
                  :disabled="uinfo.username !== 'guoang'"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--job-->
        <div v-if="type=='job'">
          <el-table
            :data="tableData"
            border
            style="width: 100%;min-height:500px"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column fixed prop="createtime" label="创建日期">
              <template slot-scope="scope">{{ scope.row.createtime | dataFormat }}</template>
            </el-table-column>
            <el-table-column prop="nickname" label="作者"></el-table-column>
            <el-table-column prop="job_name" label="岗位名称">
              <template slot-scope="scope">{{scope.row.job_name}}</template>
            </el-table-column>
            <el-table-column prop="job_salary" label="薪资"></el-table-column>
            <el-table-column prop="job_lable" label="分类"></el-table-column>
            <el-table-column prop="ispublic" label="状态">
              <template slot-scope="scope">
                <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
                <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
                <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="admin" label="审核人"></el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <el-button @click=" shenhe(scope.row)" type="text" size="small">审核</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="del(scope.row.job_id)"
                  :disabled="uinfo.username !== 'guoang'"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--article-->
        <div v-if="type=='article'">
          <el-table
            :data="tableData"
            border
            style="width: 100%;min-height:500px"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column fixed prop="createtime" label="创建日期">
              <template slot-scope="scope">{{ scope.row.article_createtime | dataFormat }}</template>
            </el-table-column>
            <el-table-column prop="nickname" label="作者"></el-table-column>
            <el-table-column prop="help_title" label="标题">
              <template slot-scope="scope">{{scope.row.article_title}}</template>
            </el-table-column>
            <el-table-column prop="article_lable" label="分类"></el-table-column>
            <el-table-column prop="ispublic" label="状态">
              <template slot-scope="scope">
                <span style="color:#6cbb7a" v-if="scope.row.ispublic==1">审核通过</span>
                <span style="color:#409eff" v-if="scope.row.ispublic==0">未审核</span>
                <span style="color:#f60c6c" v-if="scope.row.ispublic==-1">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="admin" label="审核人"></el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <el-button @click=" shenhe(scope.row)" type="text" size="small">审核</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="del(scope.row.article_id)"
                  :disabled="uinfo.username !== 'guoang'"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

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
  name: "contentexamine",
  computed: {
    ...mapState({
      uinfo: state => state.user.uinfo
    })
  },
  data() {
    return {
      loading: false,
      dialog: false,
      pagelistquery: {
        user: "",
        admin: "",
        state: "0",
        search: "",
        type: "help",
        total: 0,
        page: 1,
        pagesize: 10
      },
      type: "help",
      thiscontent: {},
      tableData: [],
      content: {}
    };
  },
  methods: {
    shenhe(row) {
      this.content = row;
      this.dialog = true;
    },
    async changestate(state) {
      let id;
      if (this.pagelistquery.type == "help") {
        id = this.content.help_id;
      }
      if (this.pagelistquery.type == "activity") {
        id = this.content.activity_id;
      }
      if (this.pagelistquery.type == "job") {
        id = this.content.job_id;
      }
      if (this.pagelistquery.type == "oldstuff") {
        id = this.content.oldstuff_id;
      }
      if (this.pagelistquery.type == "article") {
        id = this.content.article_id;
      }
      let data = {
        id: id,
        type: this.pagelistquery.type,
        state: state
      };
      let res = await this.$axios.post(
        "/admin/changecontentstate",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("操作成功");
        this.dialog = false;
        this.getcontentlist();
      }
    },
    async del(id) {
      let data = {
        id: id,
        type: this.pagelistquery.type
      };
      let res = await this.$axios.post(
        "/admin/admindelete",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("删除成功");
        this.getcontentlist();
      }
    },
    handleSizeChange(val) {
      this.pagelistquery.pagesize = val;
      this.getcontentlist();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagelistquery.page = val;
      this.getcontentlist();
      console.log(`当前页: ${val}`);
    },
    async getcontentlist() {
      this.loading = true;
      this.type = this.pagelistquery.type;
      let res = await this.$axios.post(
        "/admin/contentexamine",
        this.qs.stringify(this.pagelistquery)
      );
      if (res.data.state.type === "SUCCESS") {
        this.tableData = res.data.data;
        console.log(res.data);
        this.pagelistquery.total = res.data.count;
        this.loading = false;
      }
    }
  },
  created() {
    this.getcontentlist();
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
  padding: 20px;
  background-color: #fff;
}
</style>