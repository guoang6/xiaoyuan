<template>
  <div class="contentexamine">
    <el-main>
      <div class="top">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>网站管理里</el-breadcrumb-item>
          <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main" v-for="(lable,id) in lable" :key="id">
        <h3>{{lable.lable_name}}</h3>
        <div>
          <el-tag
            :key="tag"
            effect="dark"
            type="success"
            v-for="tag in lable.lable"
            closable
            :disable-transitions="false"
            @close="handleClose(tag,id)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="lable.inputshow===1"
            v-model="inputValue"
            size="small"
            @keyup.enter.native="handleInputConfirm(id)"
            @blur="handleInputConfirm(id)"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(id)">+ 添加新的分类</el-button>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "contentexamine",
  data() {
    return {
      lable: {},
      changelable: {},
      inputValue: ""
    };
  },
  methods: {
    /**
     *
     * 分类标签相关
     */
    handleClose(tag, id) {
      this.lable[id].lable.splice(this.lable[id].lable.indexOf(tag), 1);
      this.change(id);
    },

    showInput(id) {
      console.log(id);
      this.lable[id].inputshow = 1;
    },

    handleInputConfirm(id) {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.lable[id].lable.push(inputValue);
        this.change(id);
      }
      this.lable[id].inputshow = 0;
      this.inputValue = "";
    },
    async change(id) {
      this.changelable = JSON.stringify(this.lable[id]);
      this.changelable = JSON.parse(this.changelable); //通过JSON.stringify和JSON.parse完成深拷贝
      this.changelable.lable = JSON.stringify(this.changelable.lable);
      let res = await this.$axios.post(
        "/admin/changelable",
        this.qs.stringify(this.changelable)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("修改成功");
        this.lablelist();
      }
    },

    async lablelist() {
      let res = await this.$axios.post(
        "/admin/lablelist",
        this.qs.stringify({ lable_name: "" })
      );
      if (res.data.state.type === "SUCCESS") {
        this.lable = res.data.data;
        console.log(res.data);
        for (let i = 0; i < this.lable.length; i++) {
          this.lable[i].lable = JSON.parse(this.lable[i].lable);
        }
        console.log("分类列表");
        console.log(this.lable);
      }
    }
  },
  created() {
    this.lablelist();
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
  padding: 5px 40px 20px 40px;
  background-color: #fff;
}

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