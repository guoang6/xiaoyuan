const express = require('express')
const router = express.Router()
const service = require('./service')//相关操作逻辑
//管理员账号

router.post('/admin/registered', service.registered)
router.post('/admin/getadminlist', service.getadminlist)
router.post('/admin/changeadminstate', service.changeadminstate)
router.post('/admin/login', service.login)
router.post('/admin/changepassword', service.changepassword)
router.post('/admin/changeuseruserstate', service.changeuseruserstate)
router.post('/admin/deleteuser', service.deleteuser)
router.post('/admin/getadmin', service.getadmin)

router.post('/admin/getcomment', service.getcomment)
router.post('/admin/getreply', service.getreply)
router.post('/admin/admindelete', service.admindelete)
router.post('/admin/contentexamine', service.contentexamine)
router.post('/admin/changecontentstate', service.changecontentstate)

router.post('/admin/getuserlist', service.getuserlist)
router.post('/admin/changeuserstate', service.changeuserstate)
router.post('/admin/changeuserstate', service.changeuserstate)

//分类管理
router.post('/admin/lablelist', service.lablelist)
router.post('/admin/changelable', service.changelable)
router.post('/admin/changecarousel', service.changecarousel)
router.post('/admin/carousellist', service.carousellist)
router.post('/admin/deletecarouse', service.deletecarouse)
router.post('/admin/kefullist', service.kefullist)
router.post('/admin/changkefustate', service.changkefustate)
router.post('/admin/deletekefu', service.deletekefu)
router.post('/admin/changresult', service.changresult)
router.post('/admin/changeadminuser', service.changeadminuser)
router.post('/admin/changeactivationdate', service.changeactivationdate)
//公告列表

router.post('/admin/announcementlist', service.announcementlist)

//发布公告
router.post('/admin/setannouncement', service.setannouncement)


//仪表盘数据
router.post('/admin/numbering', service.numbering)







module.exports = router
