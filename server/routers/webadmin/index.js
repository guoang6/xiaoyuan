
const express = require('express')
const router = express.Router()
const service = require('./service')//相关操作逻辑
const jwt = require('../../plugins/jwt')//引入jwt
router.use(jwt)//express-jwt中间件
router.use(function (err, req, res, next) {
  if (err) {
    console.log(err)
  }
  if (err.name === 'UnauthorizedError') {
    //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.send({    
        state:{
          "type": 'ERROE',
          "msg": "操作失败"
      },
        code:401});
  }
});
//上传中间件
const multer = require('multer')//上传npm i multer
const MAO = require('multer-aliyun-oss');//npm install --save multer-aliyun-oss
// const uplod = multer({
//   storage: MAO({
//       config: {
//           region: 'oss-cn-hangzhou',//地址
//           accessKeyId: 'ooooooooo',//accessKeyId
//           accessKeySecret: 'oooooooooo',//accessKeySecret
//           bucket: 'guoang'//用户名
//       }
//   })
// });//上传阿里云oss
const uplod = multer({ dest: __dirname + '/../../uplodes' })//上传本地
//图片图片上传
router.post('/uplod', uplod.single('file'), service.uplod)
/**
 * 用户信息
 * 
 * 
 * 
 */
//注册
router.post('/webadmin/registered', service.registered)
//登录
router.post('/webadmin/login', service.login)
//用户信息
router.post('/webadmin/getuser', service.getuser)
router.post('/webadmin/updatauser', service.updatauser)



/**
 * 
 * 
 * 求助
 */
// //创建求助
router.post('/webadmin/createhelp', service.createhelp)
//用户u获取求助列表
router.post('/webadmin/getwebhelplist', service.getwebhelplist)
//求助详情
router.post('/webadmin/gethelpdetails', service.gethelpdetails)
//修改求助
router.post('/webadmin/updateehelp', service.updateehelp)
//删除求助
router.post('/webadmin/deletehelp', service.deletehelp)
//创建活动
router.post('/webadmin/createactivity', service.createactivity)
//用户获取求助列表
router.post('/webadmin/getwebactivitylist', service.getwebactivitylist)

//活动详情
router.post('/webadmin/getactivitydetails', service.getactivitydetails)

//修改活动
router.post('/webadmin/updateactivity', service.updateactivity)
//删除活动
router.post('/webadmin/deleteactivity', service.deleteactivity)
//被joins列表
router.post('/webadmin/getwebjoinslist', service.getwebjoinslist)
//joins列表
router.post('/webadmin/joinslist', service.joinslist)



//添加二手信息
router.post('/webadmin/createoldstuff', service.createoldstuff)
//获取二手信息
router.post('/webadmin/getweboldstufflist', service.getweboldstufflist)



//获取个人公司详情
router.post('/webadmin/getwebcompany', service.getwebcompany)
//修改公司信息
router.post('/webadmin/changewebcompany', service.changewebcompany)
//添加岗位
router.post('/webadmin/createjob', service.createjob)
//删除工作
router.post('/webadmin/deletejob', service.deletejob)
//添加文章
router.post('/webadmin/createarticle', service.createarticle)
//文章列表
router.post('/webadmin/articlelist', service.articlelist)
//文章详情

router.post('/webadmin/getarticledetails', service.getarticledetails)
router.post('/webadmin/getoldstuffdetails', service.getoldstuffdetails)
router.post('/webadmin/updatearticle', service.updatearticle)
router.post('/webadmin/updateoldstuff', service.updateoldstuff)
router.post('/webadmin/createfankui', service.createfankui)
router.post('/webadmin/createjubao', service.createjubao)
router.post('/webadmin/jubaocontent', service.jubaocontent)
router.post('/webadmin/createshensu', service.createshensu)
router.post('/webadmin/getusernumbering', service.getusernumbering)
router.post('/webadmin/deletejoin', service.deletejoin)
router.post('/webadmin/deleteoldstuff', service.deleteoldstuff)































module.exports = router
