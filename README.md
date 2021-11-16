# changhangtong
vue.js+node.js毕业设计 -----
## 线上演示
http://www.guoang.xyz/changhangtong<br>
http://www.guoang.xyz/changhangtong/admin


# 简介
  前端vue后端node的express框架数据库mysql。主要涵盖：校园信息交流平台（二手信息，交流问答，新闻文章，校内活动，招聘信息）评论 ，内容审核，实名认证，消息通知，移动端适配



# 运行
 * 1.安装node环境（百度）
 * 2.导入数据库
   + 数据库文件/数据库   
   + 数据库配置文件/server/plugins/DataBase.ini.js

 数据库文件
 
![image](https://user-images.githubusercontent.com/50048496/141990468-25d1d534-0f8a-4836-8c75-fd2d05186ea3.png)

 * 3.分别在/admin；/server/；/web下面执行命令



```
npm i
``` 
 * 4.分别在/admin；/server/；/web下面执行命令
```
npm run serve
```

# 主要功能模块
- 前台
  * 问答
  * 活动
  * 失物认领
  * 二手交易
  * 招聘信息
  * 文章与新闻
  * 个人中心&&登录注册
    + 个人中心
     * 问答
       *  发布
        * 管理 
      * 活动
         *  发布
        * 管理 
     * 失物认领
        *  发布
        * 管理 
    * 二手交易
           *  发布
        * 管理 
     * 招聘信息
        *  发布
        * 管理 
    *   文章与新闻
        *  发布
        * 管理 
 * 后台
     * 数据中心
     * 审核中心
        * 问答 /活动/失物认领/ 二手交易/招聘信息/ 文章与新闻
        * 留言审核
     * 认证中心
       * 学生认证
       * 公司认证
     * 客服中心
     * 平台管理
           分类管理
     * 账号管理
             账号添加/删除/授权/

# 前台   
## 前台-首页
<img  src="./tu/qt-sy.png"> 

## 前台-功能模块
|                                                                                     |                                           |
| ----------- | --------------- |
| ![](./tu/qt-wd-list.png)   交流问答列表核                                                       | ![](./tu/qt-pl.png) 评论        |
| ----------- | --------------- |
| ![](./tu/qt-hd-list.png)   校内活动列表核                                                       | ![](./tu/qt-es-list.png) 二手信息列表         |
| ----------- | --------------- |
| ![](./tu/qt-wd-list.png)   招聘列表核                                                       | ![](./tu/qt-wz-list.png) 文章列表         |
## 前台-个人中心
<img  src="./tu/qt-grzx.png">  

# 后台   
## 后台-首页
<img  src="./tu/ht-shouye.png">   

## 后台-个人中心
<img  src="./tu/ht-gerenzhongxin.png"> 

## 后台-审核中心
|                                                                                     |                                           |
| --------------------------------------------------------------------------------------- | ------------------------------------------- |
| ![](./tu/ht-shenhezhongxin1.png)   内容审核                                                       | ![](./tu/ht-shenhezhongxin2.png) 评论审核          |


 

## 后台-用户中心

|                                                                                     |                                           |
| --------------------------------------------------------------------------------------- | ------------------------------------------- |
|  ![](./tu/ht-yh1.png)普通用户管理                                                       | ![](./tu/ht-yh2.png) 管理员账号管理          |




## 后台-网站管理中心

|                                                                                     |                                           |
| --------------------------------------------------------------------------------------- | ------------------------------------------- |
| ![](./tu/ht-gl1.png)分类管理                                                       | ![](./tu/ht-gl2.png) 轮播图管理        |




## 数据库设计
###### user表
字段名    | 描述
-------- | -----
 user_id| 用户id
username  | 用户名
password|密码
nickname|昵称
avatar|头像
realstate|是否学生认证
realname|姓名
studentid|学号
studentcard|学生证
iscompany|是否公司
qq|QQ
mail|邮箱
describe|描述
###### notice表
| 字段 | 含义      |
|:--------:| -------------:|
| notice_id | 消息 id |
|user_from|发起者
|user_to|接受者
|action|动作
|content_id|内容id
|router|路由
|createtime|时间
|state|状态
