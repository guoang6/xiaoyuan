<template>
  <div class="comment">
    <section id="comments">
      <h3 id="comments-title">({{commentnum}}) 留言</h3>

      <article id="comment-4" v-if="userinfo">
        <img
          :src="avatar"
          class="avatar touxiang avatar-60 photo"
          style=" width: 50px;height: 50px"
        />
        <h4 class="author" style=" display: inline;">{{nickname}}</h4>
      </article>
      <div v-if="editorid!==-1" @click="usercomment" class="commenttop">添加评论</div>
      <vue-editor
        v-if="editorid===-1"
        style="margin-top:40px"
        useCustomImageHandler
        @image-added="handleImageAdded"
        v-model="comment_content"
      ></vue-editor>
      <div class="comment">
        <el-button type="info" v-if="editorid===-1" @click="setcomment">评论</el-button>
      </div>
      <ol class="commentlist">
        <li
          v-for="(item,id) in commentlist"
          :key="id"
          class="comment even thread-even depth-1"
          id="li-comment-2"
        >
          <article id="comment-2">
            <el-popover placement="top" width="400" trigger="hover">
              <span>
                <li class="comment even thread-odd thread-alt depth-1" id="li-comment-4">
                  <article id="comment-4">
                    <img
                      :src="item.avatar"
                      class="avatar touxiang avatar-60 photo"
                      height="60"
                      width="60"
                    />

                    <div class="comment-meta">
                      <h5 class="author">{{item.nickname}}</h5>

                      <p class="date" v-if="item.realstate==3">认证用户</p>
                      <p class="date" v-else>未认证用户</p>
                    </div>
                  </article>
                </li>
                <div class="xinxi">
                  <p style="  color: #000;">账号：</p>
                  <p>{{item.username}}</p>
                </div>
                <div class="xinxi">
                  <p style="  color: #000;">邮箱：</p>
                  <p>{{item.mail}}</p>
                </div>
                <div class="xinxi">
                  <p style="  color: #000;">QQ：</p>
                  <p>{{item.qq}}</p>
                </div>
                <div class="xinxi">
                  <p style="  color: #000;">个人简介：</p>
                  <p>{{item.synopsis}}</p>
                </div>
                <el-button
                  @click="jubao(item.username)"
                  style="margin:10px 150px"
                  type="danger"
                  plain
                >举报</el-button>
              </span>
              <div slot="reference">
                <a href="#">
                  <img
                    alt
                    :src="item.avatar"
                    class="avatar touxiang avatar-60 photo"
                    height="40"
                    width="40"
                  />
                </a>

                <div class="comment-meta">
                  <h5 class="author">
                    <cite class="fn">
                      <a href="#" rel="external nofollow" class="url">{{item.nickname}}</a>
                    </cite>
                  </h5>
                  <p class="date">
                    <a href="#">
                      <time>{{item.comment_createtime|dataFormat}}</time>
                    </a>
                  </p>
                </div>
              </div>
            </el-popover>

            <!-- end .comment-meta -->

            <div class="comment-body" v-html="item.comment_content"></div>
            <div class="comment-footer">
              <p @click="getreplybutton(item.comment_id,id)">查看所有回复</p>
              <p @click="showinput(id,item.nickname,item.user_id,item.comment_id)">回复</p>
            </div>
            <div class="reply" v-if="id===editorid">
              <vue-editor
                useCustomImageHandler
                @image-added="handleImageAdded"
                v-model="comment_content"
              ></vue-editor>
              <div class="comment">
                <el-button type="info" @click="setcomment">评论</el-button>
              </div>
            </div>
            <!-- end of comment-body -->
          </article>
          <!-- end of comment -->

          <ul class="children" v-if="id===replyid">
            <li
              class="comment byuser comment-author-saqib-sarwar bypostauthor odd alt depth-2"
              id="li-comment-3"
              v-for="(data,index) in replylist"
              :key="index"
            >
              <article id="comment-3">
                <el-popover placement="top" width="400" trigger="hover">
                  <span>
                    <li class="comment even thread-odd thread-alt depth-1" id="li-comment-4">
                      <article id="comment-4">
                        <img
                          :src="data.avatar"
                          class="avatar touxiang avatar-60 photo"
                          height="60"
                          width="60"
                        />
                        <div class="comment-meta">
                          <h5 class="author">{{data.nickname}}</h5>

                          <p class="date" v-if="data.realstate==3">认证用户</p>
                          <p class="date" v-else>未认证用户</p>
                        </div>
                      </article>
                    </li>
                    <div class="xinxi">
                      <p style="  color: #000;">账号：</p>
                      <p>{{data.username}}</p>
                    </div>
                    <div class="xinxi">
                      <p style="  color: #000;">邮箱：</p>
                      <p>{{data.mail}}</p>
                    </div>
                    <div class="xinxi">
                      <p style="  color: #000;">QQ：</p>
                      <p>{{data.qq}}</p>
                    </div>
                    <div class="xinxi">
                      <p style="  color: #000;">个人简介：</p>
                      <p>{{data.synopsis}}</p>
                    </div>
                    <el-button
                      @click="jubao(data.username)"
                      style="margin:10px 150px"
                      type="danger"
                      plain
                    >举报</el-button>
                  </span>
                  <div slot="reference">
                    <a href="#">
                      <img
                        alt
                        :src="data.avatar"
                        class="avatar touxiang avatar-60 photo"
                        height="40"
                        width="40"
                      />
                    </a>

                    <div class="comment-meta">
                      <h5 class="author">
                        <cite class="fn">
                          <a href="#" rel="external nofollow" class="url">{{data.nickname}}</a>
                        </cite>
                        @
                        <a class="comment-reply-link touser" href="#">{{data.tousernickname}}</a>
                      </h5>
                      <p class="date">
                        <a href="#">
                          <time>{{data.comment_createtime|dataFormat}}</time>
                        </a>
                      </p>
                    </div>
                  </div>
                </el-popover>

                <!-- end .comment-meta -->

                <div class="comment-body" v-html="data.reply_content"></div>
                <!-- end of comment-body -->
                <div class="comment-footer">
                  <p class="date">
                    <a href="#">
                      <time>{{data.createtime|dataFormat}}</time>
                    </a>
                  </p>
                  <p @click="showreplyinput(index,data.nickname,data.user_id,data.comment_id)">回复</p>
                </div>
                <div class="reply" v-if="index===replyinputid">
                  <vue-editor
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                    v-model="comment_content"
                  ></vue-editor>
                  <div class="comment">
                    <el-button type="info" @click="setcomment">评论</el-button>
                  </div>
                </div>
              </article>
              <!-- end of comment -->
            </li>
          </ul>
        </li>
      </ol>
    </section>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },
  computed: {
    ...mapState({
      avatar: state => state.user.userinfo.avatar,
      nickname: state => state.user.userinfo.nickname,
      contentid: state => state.contentid,
      commentnum: state => state.commentnum,
      contentname: state => state.contentname,
      userinfo: state => state.userinfo,
      contentuserid: state => state.contentuserid
    })
  },
  data() {
    return {
      replyinputid: -1,
      replyid: -1,
      editorid: -2,
      replylist: "",
      commentid: "",
      comment_id: "",
      touserid: "",
      tousernickname: "",

      commentlist: {},
      comment_content: ""
    };
  },
  methods: {
    jubao(username) {
      let url = escape(window.location.href); //escape对url进行编码方便在地址栏传递
      this.$router.push({
        path: "/jubao",
        query: { user: username, url: url }
      });
    },
    ...mapActions(["setcommentnum"]),
    //
    usercomment() {
      this.editorid = -1;
      this.replyinputid = -2;
    },
    //回复回复按钮
    showreplyinput(index, tousernickname, touserid, comment_id) {
      if (this.replyinputid == index) {
        this.replyinputid = -2;
      } else {
        this.touserid = touserid;
        this.tousernickname = tousernickname;
        this.replyinputid = index;
        this.editorid = -2;
        this.comment_id = comment_id;
      }
    },
    //回复按钮
    showinput(id, tousernickname, touserid, comment_id) {
      if (this.editorid == id) {
        this.editorid = -2;
      } else {
        this.touserid = touserid;
        this.tousernickname = tousernickname;
        this.editorid = id;
        this.replyinputid = -2;
        this.comment_id = comment_id;
      }
    },
    // reply(){
    //   this.touserid='',
    //   this.tousernickname='',
    //   this.editorid= -1
    // },
    //富文本编辑器图片上传npm install vue2-editor
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$axios.post("/uplod", formData);
      console.log(res);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    //获取回复按钮
    getreplybutton(comment_id, id) {
      this.replylist = "";
      this.replyid = id;
      this.commentid = comment_id;
      this.getreply();
    },
    //获取回复
    async getreply() {
      let data = {
        comment_id: this.commentid
      };
      let res = await this.$axios.post(
        "/web/getreply",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.replylist = res.data.data;
      }
    },
    //评论
    async setcomment() {
      let res;
      if (this.touserid != "") {
        //回复
        let data = {
          comment_content: this.comment_content,
          touserid: this.touserid,
          tousernickname: this.tousernickname,
          comment_id: this.comment_id,
          router: this.$route.name,
          to_userid: this.touserid,
          content_id: this.contentid,
          contentname: this.contentname
        };
        res = await this.$axios.post("/web/setreply", this.qs.stringify(data));
        this.replyinputid = -1; //添加完评论时关闭回复框
        this.getreply(); //重新获取评论
      } else {
        //评论
        let data = {
          contentname: this.contentname,
          comment_content: this.comment_content,
          content_id: this.contentid,
          router: this.$route.name,
          to_userid: this.contentuserid
        };
        res = await this.$axios.post(
          "/web/setcomment",
          this.qs.stringify(data)
        );
      }
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("评论成功");
        this.comment_content = "";
        this.touserid != "";
        this.getcomment();
        this.replyinputid = -1;
        this.replyid = -1;
        this.editorid = -2;
      }
    },
    //获取评论
    async getcomment() {
      let data = {
        content_id: this.contentid
      };
      let res = await this.$axios.post(
        "/web/getcomment",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.commentlist = res.data.data;
        console.log(this.commentlist);
        this.setcommentnum(res.data.count);
      }
    }
  },
  created() {
    this.getcomment();
  }
};
</script>
<style>
.help {
  min-height: 200px;
}
.comment {
  margin-top: 10px;
  margin-left: 20px;
}
.comment-footer {
  height: 30px;
  line-height: 30px;
}
.comment-footer p {
  float: left;
  margin-left: 20%;
  font-size: 15px;
}
.commenttop {
  margin-top: 20px;
  font-size: 20px;
  width: 100%;
  text-align: center;
  padding: 10px;
  background-color: rgb(250, 244, 244);
}

.touser {
  color: blue;
}
</style>