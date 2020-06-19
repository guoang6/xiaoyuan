<template>
  <div class="help">
    <!-- Start of Page Container -->
    <div class="page-container">
      <div class="container">
        <div class="row">
          <!-- start of page content -->
          <div class="span8 page-content">
            <el-page-header @back="$router.back(-1)" content="详情页面"></el-page-header>
            <article class="type-post format-standard hentry clearfix">
              <div>
                <div class="oldstuffcontent">
                  <img :src="content.oldstuff_img" alt="物品照片" />
                </div>
                <div class="oldstuffcontent">
                  <h3>{{content.oldstuff_name}}</h3>
                  <div class="prize_bar">
                    <div class="show_prize fl">
                      ￥
                      <em>{{content.oldstuff_price}}</em>
                    </div>
                    <div style="margin-top:10px">原价：{{content.oldstuff_price}}</div>
                    <div style="margin-top:10px;font-size:10px">卖家信息———————————————</div>
                    <el-popover placement="left" width="400" trigger="hover">
                      <span>
                        <li class="comment even thread-odd thread-alt depth-1" id="li-comment-4">
                          <article id="comment-4">
                            <img
                              :src="content.avatar"
                              class="avatar touxiang avatar-60 photo"
                              height="60"
                              width="60"
                            />

                            <div class="comment-meta">
                              <h5 class="author">{{content.nickname}}</h5>

                              <p class="date" v-if="content.realstate==3">认证用户</p>
                              <p class="date" v-else>未认证用户</p>
                            </div>
                          </article>
                        </li>
                        <div class="xinxi">
                          <p style="  color: #000;">账号：</p>
                          <p>{{content.username}}</p>
                        </div>
                        <div class="xinxi">
                          <p style="  color: #000;">邮箱：</p>
                          <p>{{content.mail}}</p>
                        </div>
                        <div class="xinxi">
                          <p style="  color: #000;">QQ：</p>
                          <p>{{content.qq}}</p>
                        </div>
                        <div class="xinxi">
                          <p style="  color: #000;">个人简介：</p>
                          <p>{{content.synopsis}}</p>
                        </div>
                         <el-button
                      @click="jubao(content.username)"
                      style="margin:10px 150px"
                      type="danger"
                      plain
                    >举报</el-button>
                      </span>
                      <div slot="reference" class="show_unit fl">
                        <a class="iconfont ic">&#xe622;</a>
                        {{content.nickname}}
                      </div>
                    </el-popover>

                    <div class="show_unit fl">
                      <a class="iconfont ic">&#xe66a;</a>
                      {{content.qq}}
                    </div>
                    <div class="show_unit fl">
                      <a class="iconfont ic">&#xe62a;</a>
                      {{content.phone}}
                    </div>
                  </div>
                  <el-button type="primary" @click="dialogFormVisible = true">有意向购买</el-button>
                  <el-dialog title="欲购买信息" :visible.sync="dialogFormVisible" width="30%">
                    <el-form :model="data" size="medium ">
                      <el-form-item label="联系方式">
                        <el-input autocomplete="off" v-model="data.describe"></el-input>
                      </el-form-item>
                      <el-form-item label="欲购买价格">
                        <el-input autocomplete="off" v-model="data.name"></el-input>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="setjoin">确 定</el-button>
                    </div>
                  </el-dialog>
                </div>
                <div style="clear:both"></div>
              </div>
              <h3>商品描述</h3>
              <blockquote v-html="content.oldstuff_content"></blockquote>
            </article>
            <div class="like-btn">
              <form id="like-it-form" action="#" method="post">
                <span class="like-it">66</span>
                <input type="hidden" name="post_id" value="99" />
                <input type="hidden" name="action" value="like_it" />
              </form>
            </div>

            <comment />
            <!-- end of comments -->
            <!-- end of page content -->
          </div>
          <aside class="span4 page-sidebar">
            <carousel />
            <oldstuffhot />
          </aside>

          <!-- end of sidebar -->
        </div>
      </div>
    </div>
    <!-- End of Page Container -->
  </div>
</template>


<script>
import carousel from "@/components/carousel.vue";
import comment from "@/components/comment.vue";
import oldstuffhot from "@/components/oldstuffhot.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    carousel,
    comment,
    oldstuffhot
  },
  data() {
    return {
      data: {
        type: "", //类型
        name: "", //  名称
        describe: "", //  描述
        content_id: "",
        contentname: "",
        to_userid: ""
      },
      dialogFormVisible: false, //弹框相关
      content: {}
    };
  },
  props: {
    id: {}
  },
  computed: {
    ...mapState({
      commentnum: state => state.commentnum,
      contentuserid: state => state.contentuserid
    })
  },
  methods: {
    ...mapActions(["setcontentid", "setcontentinfo"]),
    jubao(username) {
      let url=escape(window.location.href)
      this.$router.push({
        path: "/jubao",
        query : { user: username, url: url }
      });
    },
    async getoldstuffcontent() {
      let data = {
        id: this.id
      };
      let res = await this.$axios.post(
        "/web/getoldstuffcontent",
        this.qs.stringify(data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.content = res.data.data;
        this.setcontentinfo({
          contentname: res.data.data.oldstuff_name,
          contentuserid: res.data.data.user_id
        });
      }
    },
    async setjoin() {
      this.data.type = this.$route.name; //类型
      this.data.contentname = this.content.oldstuff_name;
      this.data.to_userid = this.contentuserid;

      this.data.content_id = this.content.oldstuff_id;
      let res = await this.$axios.post(
        "/web/setjoin",
        this.qs.stringify(this.data)
      );
      if (res.data.state.type === "SUCCESS") {
        this.$message.success("添加意向成功");
      } else {
        this.$message.error("你已经添加了意向");
      }
      this.dialogFormVisible = false;
    }
  },
  watch: {
    id: {
      handler(newVal) {
        this.getoldstuffcontent();
        this.setcontentid(this.id);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getoldstuffcontent();
    this.setcontentid(this.id);
  }
};
</script>
<style >
.help {
  min-height: 200px;
}
.label {
  margin-left: 15px;
}
.oldstuffcontent {
  width: 90%;
  min-height: 200px;
  padding: 5%;
}
.show_prize {
  font-size: 20px;
  color: #ff3e3e;
  padding-left: 20px;
}
.show_unit {
  margin-bottom: 10px;
  height: 50px;
  line-height: 50px;
}
.ic {
  color: #409eff;
  margin-right: 30px;
  font-size: 30px;
}
</style>