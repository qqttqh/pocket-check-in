<div align="center">
  <img src="./images/pci-logo.webp" alt="Project Logo" width="200"/>
  <h1>口袋扫码</h1>
</div>



## 项目简介

<img src="./images/pci-logo.webp" alt="Icon" width="16"/>口袋扫码，是一个微信远程代扫码工具。可远程代扫码登录。解决动态登录二维码刷新快，难远程登录的痛点。

## 项目技术栈

### 前端：

基于<img src="./images/vue-logo.webp" alt="Icon" width="16"/> Vue 3 进行开发，集成了<img src="./images/axios-logo.webp" alt="Icon" width="16"/> Axios 作为请求工具，使用<img src="./images/pinia-logo.webp" alt="Icon" width="16"/> Pinia 进行状态管理，并通过<img src="./images/Pinia-Persistedstate-logo.webp" alt="Icon" width="16"/> Pinia Persistedstate 实现状态的持久化存储。路由管理则采用<img src="./images/vue-logo.webp" alt="Icon" width="16"/> VueRouter 4，确保应用页面的高效切换和管理。整合weixin-js-sdk调用微信扫码接口进行扫码，解码。

### 后端：

基于<img src="./images/nodejs-logo.webp" alt="Icon" width="16"/> Node.js 开发，整合了<img src="./images/NodePlugin-logo.webp" alt="Icon" width="16"/> Express 框架构建<img src="./images/RESfulAPI-logo.webp" alt="Icon" width="16"/> RESTful API，整合ws库实现和前端的<img src="./images/WebSocket-logo.webp" alt="Icon" width="16"/> WebSoket协议持久通信。

