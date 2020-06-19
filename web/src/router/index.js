import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import home from "../views/home.vue"
import help from "../views//help.vue"
import news from '../views/news.vue'
import job from "../views/job.vue"
import search from "../views/search.vue"
import activity from "../views/activity.vue"
import oldstuff from "../views/oldstuff.vue"
import helpcontent from "../views/content/helpcontent.vue"
import oldstuffcontent from "../views/content/oldstuffcontent.vue"
import activitycontent from "../views/content/activitycontent.vue"
import newscontent from "../views/content/newscontent.vue"
import jobcontent from "../views/content/jobcontent.vue"
import companycontent from "../views/content/companycontent.vue"
import adminindex from "../views/webadmin/adminindex.vue"
import adminhome from "../views/webadmin/adminhome.vue"
import myself from "../views/webadmin/myself.vue"
// import list from "../views/webadmin/list.vue"
import notice from "../views/webadmin/notice.vue"
import createhelp from "../views/webadmin/help/createhelp.vue"
import createhelplist from "../views/webadmin/help/createhelplist.vue"
import createactivity from "../views/webadmin/activity/createactivity.vue"
import createactivitylist from "../views/webadmin/activity/createactivitylist.vue"
import company from "../views/webadmin/job/company.vue"
import createarticle from "../views/webadmin/article/createarticle.vue"
import articlelist from "../views/webadmin/article/articlelist.vue"
import createoldstuff from "../views/webadmin/oldstuff/createoldstuff.vue"
import createoldstufflist from "../views/webadmin/oldstuff/createoldstufflist.vue"
import fankui from "../views/kefu/fankui.vue"
import jubao from "../views/kefu/jubao.vue"
import shensu from "../views/kefu/shensu.vue"
import Router from 'vue-router'

Vue.use(VueRouter)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
const routes = [
  // { path: '/', name: 'index',  component: index, meta:{ispublic:true}},
  {
    path: '/', name: 'index', component: index,meta:{ispublic:true}, children: [
      { path: '', name: 'home', component: home, meta:{ispublic:true} },
      { path: 'help', name: 'help', component: help, meta:{ispublic:true}},
      { path: 'help/:tag', name: 'help', component: help,props:true ,meta:{ispublic:true }},
      { path: 'search', name: 'search', component: search,meta:{ispublic:true }},
      { path: 'helpcontent/:id', name: 'helpcontent', component: helpcontent,props:true, meta:{ispublic:true}},
      { path: 'oldstuffcontent/:id', name: 'oldstuffcontent', component: oldstuffcontent,props:true, meta:{ispublic:true}},
      { path: 'activitycontent/:id', name: 'activitycontent', component: activitycontent,props:true, meta:{ispublic:true}},
      { path: 'newscontent/:id', name: 'newscontent', component: newscontent,props:true, meta:{ispublic:true}},
      { path: 'jobcontent/:id', name: 'jobcontent', component: jobcontent,props:true, meta:{ispublic:true}},
      { path: 'companycontent/:id', name: 'companycontent', component: companycontent,props:true, meta:{ispublic:true}},
      { path: 'news', name: 'news', component: news, meta:{ispublic:true}},
      { path: 'job', name: 'job', component: job, meta:{ispublic:true}},
      { path: 'oldstuff', name: 'oldstuff', component: oldstuff, meta:{ispublic:true}},
      { path: 'activity', name: 'activity', component: activity, meta:{ispublic:true}},
      { path: 'fankui', name: 'fankui', component: fankui, meta:{ispublic:true}},
      { path: 'jubao', name: 'jubao', component: jubao, meta:{ispublic:true}},
      { path: 'shensu', name: 'shensu', component: shensu, meta:{ispublic:true}},
      {
        path: 'admin', name: 'adminindex',  component: adminindex, children: [
          // { path: '*', redirect: 'admin/home', },
          { path: '', name: 'adminhome', component: adminhome },
          { path: 'myself', name: 'myself', component: myself },
          { path: 'createhelp', name: 'createhelp', component: createhelp },
          // { path: 'list', name: 'list', component: list },
          { path: 'notice', name: 'notice', component: notice },
          { path: 'updatehelp/:id', name: 'createhelp', component: createhelp ,props:true},
          { path: 'createhelplist', name: 'createhelplist', component: createhelplist },
          { path: 'updateactivity/:id', name: 'updateactivity', component: createactivity ,props:true},
          { path: 'createactivitylist', name: 'createactivitylist', component: createactivitylist },
          { path: 'createactivity', name: 'createactivity', component: createactivity },
          { path: 'createarticle', name: 'createarticle', component: createarticle },
          { path: 'updataarticle/:id', name: 'updataarticle', component: createarticle ,props:true},
          { path: 'updateoldstuff/:id', name: 'updateoldstuff', component: createoldstuff ,props:true},
          
          { path: 'articlelist', name: 'articlelist', component: articlelist },
          { path: 'createoldstuff', name: 'createoldstuff', component: createoldstuff },
          { path: 'createoldstufflist', name: 'createoldstufflist', component: createoldstufflist },
          { path: 'company', name: 'company', component: company },
        ]
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,Form,next)=>{
  // console.log(to)
  if(!to.meta.ispublic&&!localStorage.luffy_jwt_token){
    return next('/home')
  }
  next()
})
export default router
