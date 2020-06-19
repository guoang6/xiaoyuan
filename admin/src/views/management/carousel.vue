<template>
  <div class="contentexamine">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>网站管理里</el-breadcrumb-item>
          <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main" style=" margin-top: 40px;">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add"
          style="margin-left:40px;margin-top:20px"
          circle
        ></el-button>
        <span style="margin-left:50px;color:red">
          温馨提示：
          填写完毕后按回车保存，如果上传图片前其相应的链接不为空，则自动完成相应的添加或修改动作
        </span>
      </div>
      <div class="main" style=" position: relative;" v-for="(carousel,id) in carousel" :key="id">
        <el-form ref="form" :model="carousel" style="margin-top:40px;width:80%" label-width="80px">
          <el-form-item label="图片">
            <el-upload
              :action="$axios.defaults.baseURL+'/uplod'"
              :show-file-list="false"
              :on-success="(value)=> uplogsuccess(value, id)"
              class="avatar-uploader"
            >
              <img v-if="carousel.carousel_img" :src="carousel.carousel_img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="carousel.carousel_title" @keyup.enter.native="changecarousel(id)"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="carousel.carousel_url" @keyup.enter.native="changecarousel(id)"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-delete" @click="del(id)" class="del" circle></el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "contentexamine",
  data() {
    return {
      carousel: []
    };
  },
  methods: {
    async changecarousel(id) {
      if (
        this.carousel[id].carousel_img !== "" &&
        this.carousel[id].carousel_url !== "" &&
        this.carousel[id].carousel_title !== ""
      ) {
        let res = await this.$axios.post(
          "/admin/changecarousel",
          this.qs.stringify(this.carousel[id])
        );
        if (res.data.state.type === "SUCCESS") {
          this.carousel[id].carousel_id !== "" &&
            this.$message.success("修改成功");
          this.carousel[id].carousel_id == "" &&
            this.$message.success("添加成功");
          this.carousellist();
        }
      } else {
        this.carousel[id].carousel_id == "" && this.carousel.shift();
      }
    },
    del(id) {
      if (
        this.carousel[id].carousel_img !== "" &&
        this.carousel[id].carousel_url !== "" &&
        this.carousel[id].carousel_id !== "" &&
        this.carousel[id].carousel_title !== ""
      )
        this.deletecarouse(id);
      else this.carousel[id].carousel_id == "" && this.carousel.shift();
    },
    add() {
      this.carousel.unshift({
        carousel_img: "",
        carousel_url: "",
        carousel_id: "",
        carousel_title: ""
      });
    },
    //文件上传成功时的钩子
    uplogsuccess(res, id) {
      console.log(res);
      this.carousel[id].carousel_img = res.url;
      console.log(this.carousel);
      if (
        this.carousel[id].carousel_url !== "" &&
        this.carousel[id].carousel_title !== ""
      )
        this.changecarousel(id);
    },
    async deletecarouse(id) {
      let res = await this.$axios.post(
        "/admin/deletecarouse",
        this.qs.stringify(this.carousel[id])
      );
      if (res.data.state.type === "SUCCESS") {
        this.carousel = res.data.data;
        this.$message.success("删除成功");
        console.log(this.carousel);
        this.carousellist();
      }
    },
    async carousellist() {
      let res = await this.$axios.post(
        "/admin/carousellist",
        this.qs.stringify({ lable_name: "" })
      );
      if (res.data.state.type === "SUCCESS") {
        this.carousel = res.data.data;
        console.log("轮播数据");
        console.log(this.carousel);
      }
    }
  },
  created() {
    this.carousellist();
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
  margin-top: 20px;
  padding: 5px 40px 20px 40px;
  background-color: #fff;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  min-width: 100px;
  height: 100px;
  display: block;
}
.del {
  position: absolute;

  right: 100px;
  top: 100px;
}
</style>