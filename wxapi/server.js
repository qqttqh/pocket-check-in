// 引入必要的模块
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors'); // 引入 cors 模块
require('dotenv').config(); // 加载环境变量

const app = express();
const port = process.env.PORT || 3102; // 设置端口，默认为 3102

const appId = process.env.WX_APPID// 从环境变量中读取 appId
const appSecret = process.env.WX_APP_SECRET; // 从环境变量中读取 appSecret

let accessToken = ''; // 存储访问令牌
let jsapiTicket = ''; // 存储 jsapi 票据

// 使用 cors 中间件允许跨域请求
app.use(cors());

// 获取 access_token 的函数
async function getAccessToken() {
    try {
        const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
        accessToken = response.data.access_token; // 成功获取后存储 access_token
    } catch (error) {
        console.error('获取 access_token 时出错:', error); // 捕获并打印错误
    }
}

// 获取 jsapi_ticket 的函数
async function getJsapiTicket() {
    try {
        const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`);
        jsapiTicket = response.data.ticket; // 成功获取后存储 jsapi_ticket
    } catch (error) {
        console.error('获取 jsapi_ticket 时出错:', error); // 捕获并打印错误
    }
}

// 生成签名的函数
function generateSignature(url) {
    const nonceStr = Math.random().toString(36).substring(2, 15); // 生成随机字符串
    const timestamp = Math.floor(Date.now() / 1000); // 获取当前时间戳
    const str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`; // 拼接字符串
    const signature = crypto.createHash('sha1').update(str).digest('hex'); // 生成 SHA-1 哈希
    return { appId, timestamp, nonceStr, signature }; // 返回签名对象
}

// 定时获取 access_token 和 jsapi_ticket，每小时获取一次
setInterval(async () => {
    await getAccessToken();
    await getJsapiTicket();
}, 3600000);

// 初次启动时立即获取 access_token 和 jsapi_ticket
(async () => {
    await getAccessToken();
    await getJsapiTicket();
})();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 定义 /wx-config 路由，生成并返回微信配置
app.get('/wx-config', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL 是必需的' }); // 如果未提供 URL，返回错误
    }
    const config = generateSignature(url); // 生成签名
    res.json(config); // 返回签名配置
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}/`);
});
