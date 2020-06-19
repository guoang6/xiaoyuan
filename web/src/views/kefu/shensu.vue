<template>
  <div class="kefu">
    <div v-title data-title="昌航通  |  账号申诉"></div>
    <div class="main">
      <el-page-header @back="$router.back(-1)" content="账号申诉"></el-page-header>
        <el-form
        v-if="type===0"
        ref="form"
        :model="form"
        label-width="80px"
        size="medium "
        style="margin:120px"
      >
        <el-form-item label="账号">
          <el-input v-model="user.username" useCustomImageHandler ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password" useCustomImageHandler ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left:70px" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
        <div v-if="type===1">
          <div style="width: 300px;" v-if="userinfo.shensu.activationdate<Date.now()" class="top">
          <el-button type="success" icon="el-icon-check" style="margin-right:10px;" circle></el-button>该账号是启用状态
        </div>
       <div v-else>
 <div style="width: 400px;" class="top" >
          <el-button type="danger" icon="el-icon-close" style="margin-right:10px;" circle></el-button>您的账号被封禁至{{ this.userinfo.shensu.time}}
             <div style="width: 100px; margin: 0 auto; margin-top:40px; "> 
               封禁原因
             </div>
            </div>
        <el-form status-icon label-width="100px">
                    <el-form-item label="举报内容">{{jubao.jubao_content}}</el-form-item>
                     <el-form-item label="违规内容地址">
                        <a :href="jubao.jubao_url" target="_blank">{{jubao.jubao_url}}</a>
                     </el-form-item>
                    <el-form-item label="截图">
                      <div>
                        <img
                          v-for="(img,id) in jubao.jubao_img"
                          style="width:300px ;margin-top:5px"
                          :key="id"
                          :src="img.url"
                          alt
                        />
                      </div>
                    </el-form-item>
                    <el-form-item label="处理结果">{{jubao.result}}</el-form-item>
                  </el-form>
          <el-button type="primary" style="margin-left:250px" @click=" type = 2">去申诉</el-button>
</div>
            
        </div>
                       
      <el-form
        v-if="type===2"
        ref="form"
        :model="form"
        label-width="80px"
        size="medium "
        style="margin-top:40px"
      >
        <el-form-item label="申诉描述">
          <el-input type="textarea" :rows="10" placeholder="请输入申诉描述" v-model="form.shensu_content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
      <div v-if="type===3" style="margin-top:50px">
        <div class="top">
          <el-button type="success" icon="el-icon-check" style="margin-right:30px" circle></el-button>添加申诉成功
        </div>
        <div class="bottom">
           <P style="text-indent:2em;">添加申诉成功，我们会尽快做出处理，在查明后会解封您的账号 </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: "",
  data() {
    return {
      jubao:{},
      userinfo:{},
     user : {
        password: this.password,
        username: this.username,
        type: "shensu"
      },
      type: 0,
      form: {
        shensu_content: "",
      }
    };
  },
  methods: {
     //登录
    login() {
      if (this.password == "" || this.password == "") {
        this.$message.error("账号或者密码为空");
        return;
      }
      // this.pwdhash = crypto
      //   .createHash("sha1")
      //   .update(this.password)
      //   .digest("hex");
      // let this_ = this;
      
      this.$axios({
        url: "/webadmin/login",
        method: "POST",
        data: this.qs.stringify(this.user)
      })
        .then(res => {
          this. userinfo = res.data.data;
          this.userinfo.shensu.time=moment(this.userinfo.shensu.activationdate).format("YYYY-MM-DD HH:mm");
          if (res.data.state.type === "SUCCESS") {
        this.type = 1;
        if(this.userinfo.shensu.activationdate>Date.now()) this.jubaocontent()

          }
          if (res.data.state.type === "ERROE")
            this.$message.error("用户名或密码错误");
        })
        .catch(e => {
          this.$message(e);
        });
    },
    
     async jubaocontent() {
      let res = await this.$axios.post(
        "/webadmin/jubaocontent",
        this.qs.stringify({id:this.userinfo.shensu.jubao_id})
      );
      if (res.data.state.type === "SUCCESS") {
        this.jubao=res.data.data;
          this.jubao.jubao_img = JSON.parse(this.jubao.jubao_img);

      }
    },
    async onSubmit() {
      this.form.shensu_user=this.userinfo.shensu.username
      this.form.shensu_jubao_id=this.jubao.jubao_id
      let res = await this.$axios.post(
        "/webadmin/createshensu",
        this.qs.stringify(this.form)
      );
      let data = res.data.data;
      if (res.data.state.type === "SUCCESS") {
        this.type = 3;

      }
    }
  }
};
</script>
<style  scoped>
.kefu {
  width: 50%;
  min-height: 500px;
  margin: 0 auto;
  border-style: solid;
  border-width: 5px;
  border-radius: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 30px;
}
.kefu .main {
  margin: 0 auto;
  width: 80%;
}
.top{
  width: 200px;
  font-size: 20px;
  margin: 0 auto;
    padding: 60px;
}
.bottom{
  font-size: 15px;

}
</style>