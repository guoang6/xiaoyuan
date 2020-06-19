const { query } = require('../../plugins/db.js')
const { md5 } = require('../../plugins/md5.js')
var uuid = require('node-uuid');//npm install node-uuid
const { PED_SALT, EXPIRE_SIN, PEIVATE_KEY } = require('../../plugins/config.js')
var jwt = require('jsonwebtoken');
let data
const s = {
    "type": 'SUCCESS',
    "msg": "操作成功"
}
const e = {
    "type": 'ERROE',
    "msg": "操作失败"
}
const ep = {
    "type": 'ERROR_PARAMS_EXIST',
    "msg": "用户名重复"
}
//注册
exports.registered = async (req, res) => {
    let infogetuser = [req.body.username]
    let sqlgetuser = 'select * from user where username =?'
    const result = await query(sqlgetuser, infogetuser)
    if (result.length != 0) {
        data = {
            state: ep,
            data: {}
        }
    } else {
        let time = Date.now() - 8 * 60 * 60
        let info = {
            user_id: uuid.v1(),   //用户id 
            username: req.body.username,//用户名
            password: req.body.password,//密码
            user_createtime: time,//创建时间
            nickname: '该用户还没没有设置昵称',//昵称
            avatar: 'http://oss.guoang.xyz/morentouxiang.jpg',
            realstate: 1,
            user_state: 2,
            companystate: 1
        }
        info.password = md5(`${info.password}${PED_SALT}`)
        let sql = 'insert into user set ?'
        const result = await query(sql, info)
        data = {
            state: s,
            data: {}
        }
    }
    res.send(data)
}
//登录
exports.login = async (req, res) => {
    req.body.password = md5(`${req.body.password}${PED_SALT}`)
    let info = [req.body.username, req.body.password]
    let sql = 'select * from user where username=? and password=?'
    const result = await query(sql, info)
    if (result == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    } else {
        console.log(result[0].user_id)
        let uid = result[0].user_id
        let nickname = result[0].nickname
        nickname
        //通过jwt生成token     npm i -s jsonwebtoken
        let token = jwt.sign(
            { uid, nickname },
            PEIVATE_KEY,
            { expiresIn: EXPIRE_SIN }
        )
        data = {
            state: s,
            data: {
                shensu:{
                    activationdate:result[0].activationdate,
                    jubao_id:result[0].jubao_id,
                    username:result[0].username
                },
                token: token,
                userinfo: {
                    uid: result[0].id,
                    nickname: result[0].nickname,
                    avatar: result[0].avatar,
                    companystate: result[0].companystate,
                    realstate: result[0].realstate,
                }
            }

        }
        if (req.body.type == '' && result[0].activationdate > Date.now()) {
            data = {
                state: 's',
                data: result[0].activationdate
            }
        }//返回登录成功

    }
    console.log(result)
    res.send(data);
}
//获取用户信息
exports.getuser = async (req, res) => {
    let info = [req.user.uid]
    let sql = 'select * from user where user_id =?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: result[0],
    }
    res.send(data)
}
exports.getusernumbering = async (req, res) => {
    let info = [req.user.uid]
    const help = await query(' select count(*) as count from help where user_id=?', info)
    const article = await query(' select count(*) as count from article where user_id=?', info)
    const activity = await query(' select count(*) as count from activity where user_id=?', info)
    const oldstuff = await query(' select count(*) as count from oldstuff where user_id=?', info)
    const job = await query(' select count(*) as count from job where user_id=?', info)
    data = {
        state: s,
        data: {
            article:article[0].count,
            help:help[0].count,
            activity:activity[0].count,
            oldstuff:oldstuff[0].count,
            job:job[0].count,

        }

    }
    res.send(data)
}
//修改用户信息
exports.updatauser = async (req, res) => {
    // console.log(req)
    if (req.body.m == "student") {

        let info = [
            req.body.realname,
            req.body.studentid,
            req.body.studentcard,
            2,
            req.user.uid]
        console.log(info)
        let sql = 'update user set realname =?,studentid=?,studentcard=?,realstate=? where user_id =?'
        const result = await query(sql, info)
        data = {
            state: s,
            data: {}
        }
    }

    if (req.body.m == "company") {
        let info = [
            req.body.companyname,
            req.body.companyimg,
            2,
            req.user.uid]
        console.log(info)
        let sql = 'update user set companyname =?,companyimg=?,companystate=? where user_id =?'
        const result = await query(sql, info)
        data = {
            state: s,
            data: {}
        }
    }
    if (req.body.m == "user") {
        let info = [
            req.body.avatar,
            req.body.nickname,
            req.body.synopsis,
            req.body.mail,
            req.body.qq,
            req.body.phone,
            req.user.uid]
        console.log(info)
        let sql = 'update user set avatar =?,nickname=?,synopsis=?,mail=?,qq=?,phone=? where user_id =?'
        const result = await query(sql, info)
        if (result.affectedRows === 1) {
            let info = [req.user.uid]
            let sql = 'select * from user where user_id =?'
            const result = await query(sql, info)
            data = {
                state: s,
                data: {
                    userinfo: {
                        uid: result[0].id,
                        nickname: result[0].nickname,
                        avatar: result[0].avatar
                    }
                }
            }
        } else {
            data = {
                state: e,
                data: {}
            }
        }
    }

    res.send(data)
}
//图片上传  
exports.uplod = (req, res) => {
    const file = req.file
    file.url = `http://oss.guoang.xyz/${file.filename}`
    console.log(file)
    res.send(file)
}
/**
 * 互助相关
 * 
 */
//创建求助
exports.createhelp = async (req, res) => {
    let data
    let time = Date.now() - 8 * 60 * 60
    let info = {
        help_id: uuid.v1(),   //互助id 
        user_id: req.user.uid,//  用户di 
        help_title: req.body.help_title,// 标题   
        help_lable: req.body.help_lable,// 分类
        help_tag: req.body.help_tag,// 分类
        help_content: req.body.help_content,//内容  
        help_img: req.body.help_img,//图片
        createtime: time,//创建时间
        updatetime: time,//更新时间
        help_favour_num: 0,//点赞数    
        help_read_num: 0,//浏览量
        help_state: 0, //状态  
        help_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert into help set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取求助列表
exports.getwebhelplist = async (req, res) => {
    let sql1 = ' select count(*) as count from help where user_id=?'
    let info1 = [req.user.uid]
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let page = (req.body.page - 1) * req.body.pagesize
    let pagesize = req.body.pagesize * 1
    let info = [req.user.uid, pagesize, page]
    let sql = 'select * from help where user_id=? limit ? offset ?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    } else {
        data = {
            state: s,
            data: result,
            count: count
        }
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
//求助详情
exports.gethelpdetails = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from help where help_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//修改求助
exports.updateehelp = async (req, res) => {
    console.log(req.user)
    let info = [
        req.body.help_title,
        req.body.help_lable,
        req.body.help_content,
        req.body.help_img,
        req.user.uid,
        req.body.id]

    let sql = 'update help set help_title =?, help_lable=?,help_content=?,help_img=? where user_id =?and help_id=?'

    // let sql = `update help set help_title ='${req.body.help_title}', help_lable='${req.body.help_lable}' ,help_content='${req.body.help_content}',help_img='${req.body.help_img}',where user_id = '${req.user.uid}'and help_id='${req.body.id}'`
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//删除求助
exports.deletehelp = async (req, res) => {
    let info = [req.body.help_id, req.user.uid]

    let sql = 'delete  from help where help_id=? and user_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
            }
        }
    }
    console.log(result)
    res.send(data)
}
/**
 * 
 * 活动相关
 * 
 */

//创建活动
exports.createactivity = async (req, res) => {
    // console.log(req)
    let time = Date.now() - 8 * 60 * 60
    let info = {
        activity_id: uuid.v1(),   //活动id 
        user_id: req.user.uid,//  用户di 
        activity_title: req.body.activity_title,// 标题   
        activity_lable: req.body.activity_lable,// 标签
        activity_type: req.body.activity_type,// 类型
        activity_content: req.body.activity_content,//内容  
        activity_locale: req.body.activity_locale,//地点
        activity_impose: req.body.activity_impose,//是否限制人数
        createtime: time,//创建时间
        activity_num: req.body.activity_num,//人数
        activity_statetime: req.body.activity_statetime,//活动开始时间
        activity_endtime: req.body.activity_endtime,//活动结束时间
        updatetime: time,//更新时间
        activity_favour_num: 0,//点赞数    
        activity_read_num: 0,//浏览量
        activity_state: 0, //状态  
        activity_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert into activity set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取活动列表
exports.getwebactivitylist = async (req, res) => {
    // console.log(req)
    let sql1 = ' select count(*) as count from activity where user_id=?'
    let info1 = [req.user.uid]
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let page = (req.body.page - 1) * req.body.pagesize
    let pagesize = req.body.pagesize * 1
    let info = [req.user.uid, pagesize, page]
    let sql = 'select * from activity where user_id=? limit ? offset ?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    } else {
        data = {
            state: s,
            data: result,
            count: count
        }
    }
    console.log(data)
    // console.log(result)
    res.send(data);
}
//活动详情
exports.getactivitydetails = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from activity where activity_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//修改活动
exports.updateactivity = async (req, res) => {
    // console.log(req.user)
    let updatetime = Date.now() - 8 * 60 * 60
    let info = [
        req.body.activity_title,
        req.body.activity_lable,
        req.body.activity_content,
        req.body.activity_locale,
        req.body.activity_type,
        req.body.activity_impose,
        req.body.activity_num,
        req.body.activity_statetime,
        req.body.activity_endtime,
        updatetime,
        req.user.uid,
        req.body.id]
    let sql = 'update activity set activity_title =?, activity_lable=?,activity_content=?,activity_locale=?,' +
        ' activity_type=?,activity_impose=?,activity_num=?,activity_statetime=?,activity_endtime=?,updatetime=? where user_id =?and activity_id=?'
    // let sql = `update help set help_title ='${req.body.help_title}', help_lable='${req.body.help_lable}' ,help_content='${req.body.help_content}',help_img='${req.body.help_img}',where user_id = '${req.user.uid}'and help_id='${req.body.id}'`
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//删除活动
exports.deleteactivity = async (req, res) => {
    let info = [req.body.activity_id, req.user.uid]

    let sql = 'delete  from activity where activity_id=? and user_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
            }
        }
    }
    console.log(result)
    res.send(data);
}
//获取被jion列表
exports.joinslist = async (req, res) => {
    let info = [req.user.uid]
    let sql = 'select * from joins,'
    if (req.body.type === 'oldstuffcontent') { sql = `${sql}oldstuff where oldstuff.oldstuff_id` }
    if (req.body.type === 'activitycontent') { sql = `${sql}activity where activity.activity_id` }
    sql = `${sql}=joins.content_id and joins.user_id=?`
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
    }
    console.log(data)
    res.send(data);
}
exports.getwebjoinslist = async (req, res) => {
    // console.log(req)

    let info = [req.body.id]
    let sql = 'select * from joins,user where user.user_id=joins.user_id and joins.content_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    } else {
        data = {
            state: s,
            data: result,
        }
    }
    console.log(data)
    // console.log(result)
    res.send(data);
}
//添加二手
exports.createoldstuff = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        oldstuff_id: uuid.v1(),   //二手id 
        user_id: req.user.uid,//  用户di 
        oldstuff_img: req.body.oldstuff_img,// 标题   
        oldstuff_name: req.body.oldstuff_name,// 标签
        oldstuff_lable: req.body.oldstuff_lable,// 类型
        oldstuff_price: req.body.oldstuff_price,//内容  

        oldstuff_content: req.body.oldstuff_content,//内容  
        createtime: time,//创建时间
        updatetime: time,//更新时间
        oldstuff_favour_num: 0,//点赞数    
        oldstuff_read_num: 0,//浏览量
        oldstuff_state: 0, //状态  
        oldstuff_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert into oldstuff set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取二手列表
exports.getweboldstufflist = async (req, res) => {
    // console.log(req)
    let sql1 = ' select count(*) as count from oldstuff where user_id=?'
    let info1 = [req.user.uid]
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let page = (req.body.page - 1) * req.body.pagesize
    let pagesize = req.body.pagesize * 1
    let info = [req.user.uid, pagesize, page]
    let sql = 'select * from oldstuff where user_id=? limit ? offset ?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }   //    数据库里面没找到配对的内容返回参数
    } else {
        data = {
            state: s,
            data: result,
            count: count
        }
    }
    console.log(data)
    // console.log(result)
    res.send(data);
}
//删除二手
exports.deleteoldstuff = async (req, res) => {
    let info = [req.body.oldstuff_id, req.user.uid]

    let sql = 'delete  from oldstuff where oldstuff_id=? and user_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
            }
        }
    }
    console.log(result)
    res.send(data)
}
//活动详情
exports.getoldstuffdetails = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from activity where activity_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//获取个人公司
exports.getwebcompany = async (req, res) => {
    // console.log(req)
    let info = [req.user.uid,]
    let company
    let sql = 'select * from company where user_id=? '
    const result = await query(sql, info)
    if (result.length !== 0) company = result[0]
    let sqljob = 'select * from job where user_id=? '
    const resultjob = await query(sqljob, info)
    data = {
        state: s,
        data: {
            company: company,
            joblist: resultjob,
        },
    }


    console.log(data)
    // console.log(result)
    res.send(data);
}
//公司信息修改
exports.changewebcompany = async (req, res) => {
    let info = [req.body.company_mail, req.body.company_name, req.body.company_scale, req.body.company_content, req.body.company_id, req.user.uid,]
    let sql = 'update company set company_mail=?,  company_name=?,company_scale=? ,company_content=? where company_id=? and user_id=? '
    const result = await query(sql, info)
    data = {
        state: s,
        data: {

        },
    }
    res.send(data);
}
//添加工作
exports.createjob = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        job_id: uuid.v1(),   //id 
        user_id: req.user.uid,//  用户di 
        company_id: req.body.company_id,
        job_name: req.body.job_name,// 岗位铭恒   
        job_salary: req.body.job_salary,// 薪资
        job_num: req.body.job_num,//人数 
        job_lable: req.body.job_lable,//类型
        job_content: req.body.job_content,//内容  
        job_createtime: time,//创建时间
        job_updatetime: time,//更新时间
        job_favour_num: 0,//点赞数    
        job_read_num: 0,//浏览量
        job_state: 0, //状态  
        job_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert job  set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//删除工作
exports.deletejob = async (req, res) => {
    let info = [req.body.job_id, req.user.uid]
    let sql = 'delete  from job where job_id=? and user_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
            }
        }
    }
    console.log(result)
    res.send(data)
}
//删除join
exports.deletejoin = async (req, res) => {
    let info = [req.body.id, req.user.uid]
    let sql = 'delete  from joins where join_id=? and user_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
            }
        }
    }
    console.log(result)
    res.send(data)
}
//添加文章
exports.createarticle = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        article_id: uuid.v1(),   //id 
        user_id: req.user.uid,//  用户di 
        article_title: req.body.article_title,// 标题 
        article_introduction: req.body.article_introduction,// 简介
        article_lable: req.body.article_lable,//类型
        article_content: req.body.article_content,//内容

        article_createtime: time,//创建时间
        article_updatetime: time,//更新时间
        article_favour_num: 0,//点赞数    
        article_read_num: 0,//浏览量
        article_state: 0, //状态  
        article_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert article  set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取文章列表
exports.articlelist = async (req, res) => {
    // console.log(req)
    let sql1 = ' select count(*) as count from article where user_id=?'
    let info1 = [req.user.uid]
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let page = (req.body.page - 1) * req.body.pagesize
    let pagesize = req.body.pagesize * 1
    let info = [req.user.uid, pagesize, page]
    let sql = 'select * from article where user_id=? limit ? offset ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    console.log(data)
    // console.log(result)
    res.send(data);
}
//文章详情
exports.getarticledetails = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from article where article_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//二手详情
exports.getoldstuffdetails = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from oldstuff where oldstuff_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//修改文章
exports.updatearticle = async (req, res) => {
    console.log(req.body)
    let info = [
        req.body.article_title,
        req.body.article_lable,
        req.body.article_content,
        req.body.article_introduction,
        req.user.uid,
        req.body.article_id]
    console.log(info)
    let sql = 'update article set article_title =?, article_lable=?,article_content=?,article_introduction=? where user_id =? and article_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//修改文章
exports.updateoldstuff = async (req, res) => {
    console.log(req.body)
    let info = [
        req.body.oldstuff_img,
        req.body.oldstuff_name,
        req.body.oldstuff_price,
        req.body.oldstuff_content,
        req.body.oldstuff_lable,
        req.user.uid,
        req.body.oldstuff_id]
    console.log(info)
    let sql = 'update oldstuff set oldstuff_img =?, oldstuff_name=?,oldstuff_price=?,oldstuff_content=?,oldstuff_lable=? where user_id =? and oldstuff_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//添加反馈
exports.createfankui = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        fankui_id: uuid.v1(),   //id 
        fankui_content: req.body.fankui_content,//内容  
        fankui_user: req.body.fankui_user,//  用户di 
        fankui_createtime: time,//创建时间
        fankui_state: 0, //状态  
    }
    let sql = 'insert fankui  set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//添加举报
exports.createjubao = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        jubao_id: uuid.v1(),   //id 
        jubao_content: req.body.jubao_content,//内容  
        jubao_user: req.body.jubao_user,//  用户di 
        jubao_img: req.body.jubao_img,
        jubao_url: req.body.jubao_url,
        jubao_createtime: time,//创建时间
        jubao_state: 0, //状态  
    }
    let sql = 'insert jubao  set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//添加申诉
exports.createshensu = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    let info = {
        shensu_id: uuid.v1(),   //id 
        shensu_content: req.body.shensu_content,//内容  
        shensu_user: req.body.shensu_user,//  用户
        shensu_jubao_id: req.body.shensu_jubao_id,
        shensu_createtime: time,//创建时间
        shensu_state: 0, //状态  
    }
    let sql = 'insert  shensu  set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//举报详情
exports.jubaocontent = async (req, res) => {
    console.log(req.body)
    let info = [req.body.id]
    let sql = 'select * from jubao where jubao_id=?'
    const result = await query(sql, info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}

