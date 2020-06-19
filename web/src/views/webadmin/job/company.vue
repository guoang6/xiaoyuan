<template>
  <div class="company">
    <h2>招聘中心</h2>
    <el-tabs type="border-card">
      <el-tab-pane label="公司信息">
        <el-form ref="form" :model="form" label-width="80px" size="medium ">
          <el-form-item label="公司名称">
            <el-input v-model="form.company_name" disabled></el-input>
          </el-form-item>

          <el-form-item label="公司规模">
            <el-input v-model="form.company_scale"></el-input>
          </el-form-item>
             <el-form-item label="投递方式">
            <el-input v-model="form.company_mail"></el-input>
          </el-form-item>
          <el-form-item label="公司简介">
            <vue-editor
              useCustomImageHandler
              @image-added="handleImageAdded"
              v-model="form.company_content"
            ></vue-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changewebcompany">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 岗位管理 -->
      <el-tab-pane label="岗位管理">
        <!--添加 招聘信息弹窗-->
        <el-button type="text" icon="el-icon-plus" @click="dialogFormVisible = true">添加工作信息</el-button>
        <el-dialog title="编辑岗位 " :visible.sync="dialogFormVisible" width="70%">
          <el-form
            :model="job"
            size="medium "
            label-width="80px"
            style="height:400px;overflow:auto;padding-right:20px"
          >
            <el-form-item label="岗位名称">
              <el-input autocomplete="off" v-model="job.job_name"></el-input>
            </el-form-item>
            <el-form-item label="薪资">
              <el-input autocomplete="off" v-model="job.job_salary"></el-input>
            </el-form-item>
            <el-form-item label="人数">
              <el-input autocomplete="off" v-model="job.job_num"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-radio
                v-for="(item,id) in lable"
                :key="id"
                :class="'page_span_'+id "
                v-model="job.job_lable"
                :label="item"
              >{{item}}</el-radio>
            </el-form-item>
            <el-form-item label="岗位简介">
              <vue-editor
                useCustomImageHandler
                @image-added="handleImageAdded"
                v-model="job.job_content"
              ></vue-editor>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="createjob">确 定</el-button>
          </span>
        </el-dialog>

        <el-table :data="joblist" border style="width: 100%">
          <el-table-column fixed prop="job_createtime" label="日期">
            <template slot-scope="scope">{{ scope.row.job_createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="job_name" label="名称"></el-table-column>
          <el-table-column prop="job_lable" label="类型"></el-table-column>
          <el-table-column prop="job_salary" label="薪资"></el-table-column>
          <el-table-column prop="job_num" label="招聘人数"></el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small">
                <a
                  style="color:#409eff"
                  target="_blank"
                  :href="`${url}/#/activitycontent/${scope.row.activity_id}` "
                >查看</a>
              </el-button>
              <el-button type="text" @click="deletejob(scope.row.job_id)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { VueEditor } from "vue2-editor";
import { mapState } from "vuex";
export default {
  data() {
    return {
      lable: [],
      dialogFormVisible: false,
      job: {},
      joblist: [],
      form: {
        company_name: "",
        company_scale: 0,
        company_content: ""
      }
    };
  },
  computed: {
    ...mapState({
      url: state => state.url
    })
  },
  components: {
    VueEditor
  },
  methods: {
     /**
     * npm install vue2-editor
     *
     * 富文本编辑器图片上传
     */
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$axios.post("/uplod", formData);
      console.log(res);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },

    async getwebcompany() {
      let res = await this.$axios.post("/webadmin/getwebcompany");

      if (res.data.state.type === "SUCCESS") {
        this.form = res.data.data.company;
        this.joblist = res.data.data.joblist;
      }
    },

    async changewebcompany() {
      let res = await this.$axios.post(
        "/webadmin/changewebcompany",
        this.qs.stringify(this.form)
      );

      if (res.data.state.type === "SUCCESS") {
        this.$message.success("公司信息修改成功");
      }
    },
    //删除岗位信息
    async deletejob(id) {
      let res = await this.$axios.post(
        "/webadmin/deletejob",
        this.qs.stringify({ job_id: id })
      );

      if (res.data.state.type === "SUCCESS") {
        this.getwebcompany();
        this.$message.success("删除成功");
      }
    },
    async createjob() {
      this.job.company_id = this.form.company_id;
      let res = await this.$axios.post(
        "/webadmin/createjob",
        this.qs.stringify(this.job)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("添加成功");
        this.dialogFormVisible = false;
        this.getwebcompany();
      }
    },
      async lablelist() { 
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name:'招聘分类' })
      );
      if (res.data.state.type === "SUCCESS") {
        // this.lable = res.data.data
          this.lable = JSON.parse(res.data.data[0].lable);
        console.log("分类列表");
        console.log(this.lable);
      }
    }
  },
  created() {
    this.getwebcompany();
    this.lablelist()
  }
};
</script>
