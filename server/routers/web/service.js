const { query } = require('../../plugins/db.js')
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
//添加消息
let setnotice = async function (user_from, user_to, nickname, content_id, content_name, action, router) {
    let notice = {
        notice_id: uuid.v1(),// 消息 id 
        user_from: user_from,//发起者
        nickname: nickname,
        user_to: user_to,//接受者
        content_name: content_name,
        action: action,//动作
        content_id: content_id,//内容id
        router: router,//路由
        createtime: Date.now() - 8 * 60 * 60,//时间
        state: 0//状态
    }
    let sql = 'insert notice set ?'
    const result = await query(sql, notice)

}
//获取求助列表
exports.webgetwebhelplist = async (req, res) => {
    console.log(req.body)
    let sql1 = ' select count(*) as count from help where ispublic=1 or ispublic=0'
    if (req.body.lable != '') sql1 = `${sql1} and help_lable='${req.body.lable}'`//有分类时
    if (req.body.tag != '') sql1 = `${sql1} and help_tag like '%${req.body.tag}%'`//标签时
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select help.help_id,help.help_title,help.createtime,help.help_read_num, user.nickname from help,user where help.user_id=user.user_id'
    if (req.body.lable != '') sql = `${sql} and help.help_lable='${req.body.lable}'`//有分类时
    if (req.body.tag != '') sql = `${sql} and help.help_tag like '%${req.body.tag}%'`//标签时
    sql = `${sql}  and help.ispublic=1 or help.ispublic=0`
    sql = `${sql} order by help.help_read_num desc  limit ? offset ?`
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
//求助详情
exports.gethelpcontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from help ,user where help.user_id =user.user_id and help_id=?'
    const result = await query(sql, info)
    const add = await query('update help set help_read_num=help_read_num+1 where help_id = ?', info)
    if (result.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        s
        data = {
            state: s,
            data: result[0]
        }
    }
    console.log(result)
    res.send(data);
}
//文章详情
exports.getarticlecontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from article ,user where article.user_id =user.user_id and article_id=?'
    const add = await query('update  article set article_read_num=article_read_num+1 where article_id = ?', info)

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

//公司详情
exports.getcompanycontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from job where  company_id=?'
    const company = await query('select * from company where company_id=?', info)
    const add = await query('update  company set company_read_num=company_read_num+1 where company_id = ?', info)
    const joblist = await query(sql, info)

    if (company.length == 0) {
        data = {
            state: e,
            data: {
            }
        }
    } else {
        data = {
            state: s,
            data: {
                joblist: joblist,
                company: company[0]
            }
        }
    }
    res.send(data);
}
//工作详情
exports.getjobcontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from job ,company where company.company_id =job.company_id and job_id=?'
    const add = await query('update job set job_read_num=job_read_num+1 where job_id = ?', info)

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
//评论
exports.setcomment = async (req, res) => {
    let time = Date.now() - 8 * 60 * 60
    setnotice(req.user.uid, req.body.to_userid, req.user.nickname, req.body.content_id, req.body.contentname, '评论了你', req.body.router)
    let info = {
        comment_id: uuid.v1(),   //评论id 
        user_id: req.user.uid,//  用户di 
        content_id: req.body.content_id,//内容id
        comment_content: req.body.comment_content,//内容  
        comment_createtime: time,//创建时间  
        comment_state: 0, //状态  
        comment_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert comment set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取评论列表
exports.getcomment = async (req, res) => {
    let info = [req.body.content_id]//内容id
    console.log(info)
    let sql1 = ' select count(*) as count from comment where  content_id=?'
    const counts = await query(sql1, info)
    let count = counts[0].count
    let sql = 'select * from user,comment where comment.user_id = user.user_id and content_id=? '
    'order by comment.comment_createtime asc '
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    res.send(data)
}
//评论
exports.setreply = async (req, res) => {
    setnotice(req.user.uid, req.body.to_userid, req.user.nickname, req.body.content_id, req.body.contentname, '回复了你', req.body.router)
    let time = Date.now() - 8 * 60 * 60
    let info = {
        reply_id: uuid.v1(),//留言id
        user_id: req.user.uid,//  用户di 
        comment_id: req.body.comment_id,//内容id
        reply_content: req.body.comment_content,//内容  
        tousernickname: req.body.tousernickname,
        touserid: req.body.touserid,
        createtime: time,//创建时间  
        reply_state: 0, //状态  
        reply_istop: 0,//是否置顶
        ispublic: 0,//是否显示
    }
    let sql = 'insert reply set ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: {}
    }
    res.send(data)
}
//获取回复列表
exports.getreply = async (req, res) => {
    let info = [req.body.comment_id]//评论id
    console.log(req.body)
    let sql = 'select * from user,reply where reply.user_id = user.user_id and comment_id=? ' +
        'order by reply.createtime asc '
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
    }
    res.send(data)
}

//活动详情
exports.getactivitycontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from activity,user where user.user_id=activity.user_id and activity.activity_id=?'
    const add = await query('update activity set activity_read_num=activity_read_num+1 where activity_id = ?', info)
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
//获取求助列表
exports.webgetwebhelplist = async (req, res) => {
    console.log(req.body)
    let sql1 = ' select count(*) as count from help where ispublic=1 or ispublic=0'
    if (req.body.lable != '') sql1 = `${sql1} and help_lable='${req.body.lable}'`//有分类时
    if (req.body.tag != '') sql1 = `${sql1} and help_tag like '%${req.body.tag}%'`//标签时
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select help.help_id,help.help_title,help.createtime,help.help_read_num, user.nickname from help,user where help.user_id=user.user_id'
    if (req.body.lable != '') sql = `${sql} and help.help_lable='${req.body.lable}'`//有分类时
    if (req.body.tag != '') sql = `${sql} and help.help_tag like '%${req.body.tag}%'`//标签时
    sql = `${sql}  and (help.ispublic=1 or help.ispublic=0)`
    sql = `${sql} order by help.help_read_num desc  limit ? offset ?`
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
//web获取活动列表
exports.webgetwebactivitylist = async (req, res) => {
    console.log(req.body.lable)
    let sql1 = ' select count(*) as count from activity where ispublic=1 or ispublic=0'
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select * from activity,user where activity.user_id=user.user_id'
    if (req.body.lable != '') sql = `${sql} and activity.activity_lable='${req.body.lable}'`//有分类时
    sql = `${sql}  and (activity.ispublic=1 or activity.ispublic=0)`
    sql = `${sql} order by activity.activity_read_num desc limit ? offset ?`
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
//web获取二手列表
exports.webgetweboldstufflist = async (req, res) => {
    console.log(req.body.lable)
    let sql1 = ' select count(*) as count from oldstuff where ispublic=1 or ispublic=0'
    if (req.body.lable != '') sql1 = `${sql1} and oldstuff_lable='${req.body.lable}'`//有分类时
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select * from oldstuff,user where oldstuff.user_id=user.user_id'
    if (req.body.lable != '') sql = `${sql} and oldstuff.oldstuff_lable='${req.body.lable}'`//有分类时
    sql = `${sql}  and (oldstuff.ispublic=1 or oldstuff.ispublic=0)`

    sql = `${sql} order by oldstuff.oldstuff_read_num desc limit ? offset ?`
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
//web获取工作列表
exports.webgetjoblist = async (req, res) => {
    let sql1 = ' select count(*) as count from job  where ispublic=1 or ispublic=0'
    if (req.body.lable != '') sql1 = `${sql1} and job_lable='${req.body.lable}'`//有分类时
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select job.job_id,job.job_name,job.job_createtime,job.job_salary,company.company_name' +
        ' from job,company where job.company_id=company.company_id '
    if (req.body.lable != '') sql = `${sql} and job.job_lable='${req.body.lable}'`//有分类时
    sql = `${sql}  and (job.ispublic=1 or job.ispublic=0)`
    sql = `${sql} order by job.job_read_num desc limit ? offset ?`
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
//获取文章列表
exports.getarticlelist = async (req, res) => {
    let sql1 = ' select count(*) as count from article  where ispublic=1 or ispublic=0'
    if (req.body.lable != '') sql1 = `${sql1} and article_lable='${req.body.lable}'`//有分类时

    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    let sql = 'select article.article_read_num,article.article_id,article.article_title,article.article_introduction,' +
        'article.article_createtime,user.nickname from article,user where article.user_id=user.user_id '
    if (req.body.lable != '') sql = `${sql} and article.article_lable='${req.body.lable}'`//有分类时
    sql = `${sql}  and (article.ispublic=1 or article.ispublic=0)`

    sql = `${sql} order by article.article_read_num desc limit ? offset ?`
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

//二手详情
exports.getoldstuffcontent = async (req, res) => {
    let info = [req.body.id]
    let sql = 'select * from oldstuff,user where user.user_id=oldstuff.user_id and oldstuff.oldstuff_id=?'
    const add = await query('update  oldstuff set oldstuff_read_num=oldstuff_read_num+1 where oldstuff_id = ?', info)

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
//web获取公司列表
exports.webgetcompanylist = async (req, res) => {
    console.log("------公司信息--------------------")
    let sql1 = ' select count(*) as count from company '
    let info1 = []
    const counts = await query(sql1, info1)
    let count = counts[0].count
    let pagesize = req.body.pagesize * 1
    let page = (req.body.page - 1) * pagesize
    let info = [pagesize, page]
    console.log("------公司列表--------------------")
    let sql = 'select company_id,company_name from company order by company_read_num desc  limit ? offset ?'
    const result = await query(sql, info)
    data = {
        state: s,
        data: result,
        count: count
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}

//获取消息
exports.getnotice = async (req, res) => {
    let sqlnoticenum = ' select count(*) as count from notice where user_to=? and state=0'
    let info = [req.user.uid]
    const count = await query(sqlnoticenum, info)

    let sqlnotice = ' select count(*) as count from notice where user_to=?'
    const num = await query(sqlnotice, info)
    let result
    if (req.body.num == '') {
        let sql = 'select * from notice where user_to=? ORDER BY  createtime DESC'
        result = await query(sql, info)
    }
    data = {
        state: s,
        data: {
            list: result,
            count: count[0].count,
            num: num[0].count
        }
    }

    // console.log(result)
    res.send(data);
}
//修改消息
exports.changenotice = async (req, res) => {
    console.log(req.body)
    let info = []
    let sql = ''
    if (req.body.change == 'change') {
        sql = 'update notice set state =? where user_to =?and notice_id=?'
        info = [1, req.user.uid, req.body.notice_id]
    }
    if (req.body.change == 'delete') {
        sql = 'delete from notice where user_to=? and notice_id=?',
            info = [req.user.uid, req.body.notice_id]
    }
    if (req.body.change == 'changeall') {
        sql = 'update notice set state =? where user_to =?',
            info = [1, req.user.uid]
    }
    if (req.body.change == 'deleteall') {
        sql = 'delete from notice where user_to=?',
            info = [req.user.uid]
    }
    result = await query(sql, info)
    data = {
        state: s,
        data: {
        }
    }

    console.log(result)
    res.send(data);
}
//添加jion
exports.setjoin = async (req, res) => {
    let onlyone = [req.body.content_id, req.user.uid,]
    let onlyonesql = 'select * from joins where content_id=? and user_id=?'
    const resultonlyone = await query(onlyonesql, onlyone)
    if (resultonlyone.length == 0) {
        let time = Date.now() - 8 * 60 * 60
        setnotice('', req.user.uid, '系统通知', req.body.content_id, req.body.contentname, '你已经成功参与', req.body.type)
        setnotice('', req.body.to_userid, '系统通知', req.body.content_id, req.body.contentname, '有一位用户参加了你发布的内容', req.body.type)
        let info = {
            join_id: uuid.v1(),//id
            user_id: req.user.uid,//  用户di 
            type: req.body.type,
            jions_createtime: time,
            name: req.body.name,//  名称 
            describe: req.body.describe,//  描述
            content_id: req.body.content_id
        }
        let sql = 'insert joins set ?'
        const result = await query(sql, info)
        data = {
            state: s,
            data: {}
        }
    }
    else {
        data = {
            state: e,
            data: {}
        }
    }
    res.send(data)
}
//搜索
exports.search = async (req, res) => {
    console.log(req.body.search)
    info = []
    const help = await query(`select * from help,user where help.user_id=user.user_id and help.help_title like '%${req.body.search}%'`, info)
    const activity = await query(`select * from activity where activity.activity_title like '%${req.body.search}%'`, info)
    const job = await query(`select * from job,user where job.user_id=user.user_id and job.job_name like '%${req.body.search}%'`, info)
    const company = await query(`select * from company where  company.company_name like '%${req.body.search}%'`, info)
    const oldstuff = await query(`select * from oldstuff where oldstuff_name like '%${req.body.search}%'`, info)
    const article = await query(`select * from article,user where article.user_id=user.user_id and (article.article_title like '%${req.body.search}%' or article.article_introduction  like '%${req.body.search}%')`, info)
    data = {
        state: s,
        data: {
            help: help,
            activity: activity,
            job: job,
            oldstuff: oldstuff,
            company: company,
            article: article,
        },
    }
    // console.log(data)
    // console.log(result)
    res.send(data);
}
