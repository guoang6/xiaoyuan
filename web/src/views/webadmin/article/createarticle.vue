<template>
  <div class="crestehelp">
    <h2>{{id?'编辑':'创建' }}文章/新闻</h2>
    <el-form ref="form" :model="article" label-width="80px" size="medium ">
      <el-form-item label="标题">
        <el-input v-model="article.article_title" useCustomImageHandler @image-added="handleImageAdded"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :rows="2" placeholder="请输入文章简介" v-model="article.article_introduction"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-radio
          v-for="(item,id) in lable"
          :key="id"
          :class="'page_span_'+id "
          v-model="article.article_lable"
          :label="item"
        >{{item}}</el-radio>
      </el-form-item>
      <el-form-item label="内容">
        <vue-editor
          useCustomImageHandler
          @image-added="handleImageAdded"
          v-model="article.article_content"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
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
      dialogVisible: false,
      article:{}
    };
  },
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  methods: {
    //富文本编辑器图片上传npm install vue2-editor
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
        res = await this.$axios.post(
          "/webadmin/updatearticle",
          this.qs.stringify(this.article)
        );
      } else {
        res = await this.$axios.post(
          "/webadmin/createarticle",
          this.qs.stringify(this.article)
        );
      }
      let data = res.data.data;
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("成功");
        this.$router.push("/admin/articlelist");
      }
    },
    async getarticledetails() {
      const res = await this.$axios.post(
        "/webadmin/getarticledetails",
        this.qs.stringify({ id: this.id })
      );
      this.article= res.data.data;
    },
       //分类列表
    async lablelist() {
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name: "文章分类" })
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
    this.lablelist();
    this.id && this.getarticledetails();

  }
};
</script>
<style  scoped>
</style>