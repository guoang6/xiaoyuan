<template>
  <div id="login" style="    width: 100%;height: 100%;">
    <loginparticles />
    <div class="login-box">
      <p class="title">“昌航通”后台管理系统</p>
      <form action id="form" @submit.prevent="onSubmit">
        <p class="usericon">
          <input type="text" v-model="username" placeholder="用户" id="username" />
        </p>
        <p class="passicon">
          <input type="password" v-model="password" placeholder="密码" id="password" />
        </p>
        <p >
          <input type="submit" @click.prevent ="login" value="立即登录" class="submit-btn" />
        </p>
        <div class="others">
          <!-- <a href class="register">立即注册</a> -->
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import loginparticles from "@/views/loginparticles.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "login",
  components: {
    loginparticles
  },
  data() {
    return {
      password: "guoang",  
      username: "guoang"
    };
  },
  methods: {
     ...mapActions("user", [
      "setUserInfo",
      "setToken",
    ]),
    //登录
    login() {
      if (this.password == "" || this.password == "") {
        this.$message.error("账号或者密码为空");
        return;
      }
      console.log(111)
      let obj = {
        password: this.password,
        username: this.username
      };
      this.$axios({
        url: "/admin/login",
        method: "POST",
        data: this.qs.stringify(obj)
      })
        .then(res => {
          let data = res.data.data;
            console.log(11111);
          console.log(res.data)
          if (res.data.state.type === "SUCCESS") {
            this.$message.success("登录成功"); 
            this.setUserInfo(data.userinfo);
            this.setToken(data.token);
            this.$router.push('/');
          } else this.$message.error("用户名或密码错误");
        }).catch(e => {
          this.$message(e);
        });
    }
  }
};
</script>
  <style scoped>
.login-box {
  width: 300px;
  height: 250px;
  padding: 20px;
  box-shadow: 0 -15px 30px #e0b3e9;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.login-box p.title {
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  color: #45bda6;
  text-shadow: 0 0 1px #0e947a;
  margin-bottom: 30px;
}
.login-box p {
  position: relative;
}
.login-box p::before {
  font-family: "adminthemesregular";
  position: absolute;
  top: 0;
  left: 10px;
  height: 42px;
  line-height: 42px;
  font-size: 20px;
  color: #0e947a;
}
.login-box p.usericon::before {
  content: "u";
}
.login-box p.passicon::before {
  content: "p";
}
canvas {
  position: absolute;
}
.login-box input {
  font-size: 16px;
  height: 26px;
  width: 90%;
  border: none;
  padding: 8px 5%;
  background: #5cbdaa;
  color: white;
  text-indent: 2em;
}
.login-box input::-webkit-input-placeholder {
  color: #f4f4f4;
  line-height: inherit;
}
.login-box input::-moz-placeholder {
  color: #f4f4f4;
  line-height: inherit;
}
.login-box input.submit-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  background: #048f74;
  color: #f8f8f8;
  text-indent: 0;
}
.login-box input.submit-btn:hover {
  background: #0c9076;
  color: #f4f4f4;
}
.others {
  position: relative;
  margin-top: 2px;
}
.register {
  color: #fff;
  position: absolute;
  right: 10px;
}
.register:hover {
  color: #fff;
}
</style>