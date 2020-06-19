<template>
  <div class="crestehelp">
    <h2>{{id?'编辑':'创建' }}信息</h2>
    <el-form ref="form" :model="form" label-width="80px" size="medium ">
      <el-form-item label="标题">
        <el-input v-model="form.help_title" useCustomImageHandler @image-added="handleImageAdded"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-radio
          v-for="(item,id) in lable"
          :key="id"
          :class="'page_span_'+id "
          v-model="form.help_lable"
          :label="item" 
        >{{item}}</el-radio>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
      </el-form-item>
      <el-form-item label="内容">
        <vue-editor
          useCustomImageHandler
          @image-added="handleImageAdded"
          v-model="form.help_content"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button   @click="$router.push('/admin/createhelplist') ">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  data() {
    return {
      lable: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      dialogVisible: false,
      form: {
        help_tag:'',
        help_title: '',
        help_lable: '',
        help_content: ''
      }
    };
  },
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  methods: {
    /**
     *
     * 标签相关
     */
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
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
      this.form.help_tag = String(this.dynamicTags);
      console.log(this.form)
      if (this.id) {
        this.form.id = this.id;
        res = await this.$axios.post(
          "/webadmin/updateehelp",
          this.qs.stringify(this.form)
        );
      } else {
        res = await this.$axios.post(
          "/webadmin/createhelp",
          this.qs.stringify(this.form)
        );
      }
      let data = res.data.data;
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("成功");
        this.$router.push("/admin/createhelplist");
      }
    },
    async gethelpdetails() {
      const res = await this.$axios.post(
        "/webadmin/gethelpdetails",
        this.qs.stringify({ id: this.id })
      );
      let data = res.data.data;
      // console.log(data)
      this.form.help_title = data.help_title;
      this.form.help_lable = data.help_lable;
      this.form.help_content = data.help_content;
      this.dynamicTags=data.help_tag.split(",");
    },
    async lablelist() { 
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name:'问答分类' })
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
    this.id && this.gethelpdetails();
    this.lablelist()
  }
};
</script>
<style  scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>