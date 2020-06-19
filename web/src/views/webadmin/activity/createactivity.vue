<template>
  <div class="createactivity">
    <h2>{{id?'编辑':'创建' }}活动</h2>

    <el-tabs type="border-card">
      <el-tab-pane label="活动编辑">
        <el-form ref="form" :model="form" label-width="80px" size="medium ">
          <el-form-item label="活动名称">
            <el-input v-model="form.activity_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="form.activity_statetime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker
              value-format="timestamp"
              v-model="form.activity_endtime"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="地点">
            <el-input v-model="form.activity_locale"></el-input>
          </el-form-item>

          <el-form-item label="人数限制">
            <el-switch v-model="form.activity_impose"></el-switch>
          </el-form-item>

          <el-form-item label="活动人数">
            <el-input
              :rules="[
      { required: true, message: '人数不能为空'},
      { type: 'number', message: '人数必须为数字值'}
    ]"
              v-model="form.activity_num"
            ></el-input>
          </el-form-item>

          <el-form-item label="活动分类">
            <el-radio-group v-model="form.activity_lable">
              <el-radio
                v-for="(item,id) in lable"
                :key="id"
                :class="'page_span_'+id "
                :label="item"
              >{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="活动形式">
            <el-radio-group v-model="form.activity_type">
              <el-radio label="线上"></el-radio>
              <el-radio label="线下"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容介绍">
            <vue-editor
              useCustomImageHandler
              @image-added="handleImageAdded"
              v-model="form.activity_content"
            ></vue-editor>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="id" label="公告管理">
        <el-button type="text" icon="el-icon-plus" @click="dialogFormVisible = true">添加新的活动公告</el-button>
        <el-dialog title="发布公告 " :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="announcement" size="medium ">
            <el-form-item label="公告名称">
              <el-input autocomplete="off" v-model="announcement.announcement_name"></el-input>
            </el-form-item>
            <el-form-item label="公告类容">
              <el-input
                type="textarea"
                autocomplete="off"
                v-model="announcement.announcement_content"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="setannouncement">确 定</el-button>
          </div>
        </el-dialog>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(item,id) in announcementlist"
              :key="id"
              :timestamp="item.announcement_createtime | dataFormat"
              placement="top"
            >
              <el-card>
                <h4>{{item.announcement_name}}</h4>
                <p>{{item.announcement_content}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane v-else label="公告管理">请先添加活动，活动添加成功后才可以添加活动公告</el-tab-pane>
      <el-tab-pane label="活动人员管理">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="createtime" label="报名日期">
            <template slot-scope="scope">{{ scope.row.joins_createtime | dataFormat }}</template>
          </el-table-column>
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="qq" label="qq"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { VueEditor } from "vue2-editor";

export default {
  data() {
    return {
      lable: [],
      announcementlist: [],
      dialogFormVisible: false,
      tableData: [], //报名列表
      dialogImageUrl: [],
      dialogVisible: false,
      announcement: {
        content_id: "",
        type: "activity",
        announcement_content: "",
        announcement_name: ""
      },
      form: {
        activity_title: "",
        activity_impose: false,
        activity_num: 0,
        activity_type: "",
        activity_lable: "",
        activity_content: "",
        activity_img: "",
        activity_statetime: "",
        activity_endtime: "",
        activity_locale: ""
      }
    };
  },
  components: {
    VueEditor
  },
  props: {
    id: {}
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
    //发布与编辑
    async onSubmit() {
      let res;
      if (this.id) {
        this.form.id = this.id;
        res = await this.$axios.post(
          "/webadmin/updateactivity",
          this.qs.stringify(this.form)
        );
      } else {
        res = await this.$axios.post(
          "/webadmin/createactivity",
          this.qs.stringify(this.form)
        );
      }
      let data = res.data.data;
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("成功");
        this.$router.push("/admin/createactivitylist");
      }
    },
    //发布活动公告
    async setannouncement() {
      this.announcement.contentname = this.form.activity_title;
      this.announcement.content_id = this.id;
      let res = await this.$axios.post(
        "/admin/setannouncement",
        this.qs.stringify(this.announcement)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("公告发布成功成功");
        this.getannouncementlist();
        this.dialogFormVisible = false;
      }
    },
    //获取公告列表
    async getannouncementlist() {
      let res = await this.$axios.post(
        "/admin/announcementlist",
        this.qs.stringify({ content_id: this.id })
      );

      if (res.data.state.type === "SUCCESS") {
        this.announcementlist = res.data.data;
      }
    },

    async getactivitydetails() {
      const res = await this.$axios.post(
        "/webadmin/getactivitydetails",
        this.qs.stringify({ id: this.id })
      );
      this.form = res.data.data;
      this.form.activity_impose = res.data.data.activity_impose === "true";
    },
    async getjoinslist() {
      const res = await this.$axios.post(
        "/webadmin/getwebjoinslist",
        this.qs.stringify({ id: this.id })
      );
      this.tableData = res.data.data;
    },
    //分类列表
    async lablelist() {
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name: "活动分类" })
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
    this.id && this.getactivitydetails();
    this.id && this.getjoinslist();
    this.id && this.getannouncementlist();
    this.lablelist();
  }
};
</script>
