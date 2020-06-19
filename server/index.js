const express = require('express')
const bodyParser = require('body-parser')
const webadminrouter = require('./routers/webadmin')
const webrouter = require('./routers/web')
const adminrouter = require('./routers/admin')

const localPort = 3000
const app = express()
//静态文件文件
app.use('/uplodes',express.static(__dirname+'/uplodes'))//图片
// 自定义跨域中间件
var allowCors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Headers', 'Authorization');
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
  };
app.use(allowCors);//使用跨域中间件
  
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(jsonParser)
app.use(urlencodedParser)
app.use(webadminrouter)
app.use(webrouter)
app.use(adminrouter)

app.listen(localPort, () => {
  let fs =require("fs");
  let data = fs.readFileSync('console.txt');
console.log(data.toString());
})