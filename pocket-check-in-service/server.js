const express = require('express'); // 引入Express库
const http = require('http'); // 引入HTTP库
const WebSocket = require('ws'); // 引入WebSocket库
require('dotenv').config();

const app = express(); // 创建Express应用
const server = http.createServer(app); // 创建HTTP服务器
const wss = new WebSocket.Server({ server }); // 创建WebSocket服务器

let rooms = {}; // 用于存储房间信息的对象
let roomEmptyTimes = {}; // 用于记录房间最后一个人离开的时间

wss.on('connection', (ws, req) => {
    // 解析URL参数以获取用户名
    const params = new URLSearchParams(req.url.replace(/^\/\?/, ''));
    const username = params.get('username');
    if (!username) {
        ws.close(1008, '必须填写用户名');
        return;
    }
    // 将用户名和初始状态存储在WebSocket连接对象中
    ws.userInfo = { username: username, status: '等待' };

    // 检查并删除空闲超过10分钟的房间
    for (const [roomName, emptyTime] of Object.entries(roomEmptyTimes)) {
        if (Date.now() - emptyTime > 10 * 60 * 1000) {
            delete rooms[roomName];
            delete roomEmptyTimes[roomName];
        }
    }

    // 发送当前所有房间的列表和人数给建立连接的客户端
    sendRoomList(ws);

    // 监听WebSocket连接
    ws.on('message', (message) => {
        // 监听客户端发送的消息
        const data = JSON.parse(message); // 将消息解析为JSON对象

        switch (data.type) {
            case 'createRoom':
                // 处理创建房间的消息
                if (!rooms[data.roomName]) {
                    // 如果房间不存在，则创建新房间
                    rooms[data.roomName] = [];
                    sendMessage(ws, 'success', `房间${data.roomName}创建成功!`);
                    // 广播房间列表更新
                    broadcastRoomList();
                } else {
                    // 发送错误消息
                    sendMessage(ws, 'fail', `房间${data.roomName}已经存在了`);
                    // 发送当前所有房间的列表和人数给建立连接的客户端
                    sendRoomList(ws);
                }
                break;
            case 'joinRoom':
                // 处理加入房间的消息
                if (rooms[data.roomName]) {
                    rooms[data.roomName].push(ws);
                    ws.roomName = data.roomName;
                    delete roomEmptyTimes[data.roomName]; // 删除空闲时间记录
                    // 广播房间信息和房间列表更新
                    broadcastRoomInfo(data.roomName);
                    broadcastRoomList();
                    // 发送加入房间信息
                    ws.send(JSON.stringify({ type: 'joinSuccess', currentRoom: data.roomName }));
                }
                break;
            case 'leaveRoom':
                // 处理离开房间的消息
                if (ws.roomName && rooms[ws.roomName]) {
                    rooms[ws.roomName] = rooms[ws.roomName].filter(client => client !== ws);
                    // 如果房间为空，则记录空闲时间
                    if (rooms[ws.roomName].length === 0) {
                        roomEmptyTimes[ws.roomName] = Date.now();
                        ws.send(JSON.stringify({ type: 'deleteRoom', roomName: ws.roomName }));
                    } else {
                        broadcastRoomInfo(ws.roomName);
                    }
                    // 广播房间列表更新
                    broadcastRoomList();
                }
                break;
            case 'updateStatus':
                // 处理更新用户状态的消息
                if (ws.roomName && rooms[ws.roomName]) {
                    const client = rooms[ws.roomName].find(client => client === ws);
                    if (client) {
                        client.userInfo.status = data.status;
                        broadcastRoomInfo(ws.roomName);
                    }
                }
                break;
            case 'scan':
                // 处理扫码结果的消息
                if (rooms[ws.roomName]) {
                    rooms[ws.roomName].forEach(client => {
                        if (client !== ws) {
                            client.send(JSON.stringify({ type: 'scanResult', url: data.url }));
                        }
                    });
                }
                break;
        }
    });

    ws.on('close', () => {
        // 处理WebSocket连接关闭
        if (ws.roomName && rooms[ws.roomName]) {
            rooms[ws.roomName] = rooms[ws.roomName].filter(client => client !== ws);
            // 如果房间为空，则记录空闲时间
            if (rooms[ws.roomName].length === 0) {
                roomEmptyTimes[ws.roomName] = Date.now();
                ws.send(JSON.stringify({ type: 'deleteRoom', roomName: ws.roomName }));
            } else {
                broadcastRoomInfo(ws.roomName);
            }
            // 广播房间列表更新
            broadcastRoomList();
        }
    });
});

// 向房间广播房间信息
function broadcastRoomInfo(roomName) {
    // 广播指定房间的房间信息
    const clients = rooms[roomName]; // 获取房间中的所有客户端连接
    const users = clients.map(client => client.userInfo); // 获取所有客户端的用户名和状态

    const roomInfo = {
        type: 'roomInfo',
        roomName: roomName,
        count: clients.length,
        users: users // 添加用户名和状态列表
    };

    clients.forEach(client => {
        client.send(JSON.stringify(roomInfo));
    });
}

// 广播当前所有房间的列表和人数给所有的客户端
function broadcastRoomList() {
    // 构建房间列表对象
    const roomList = {};
    Object.keys(rooms).forEach(roomName => {
        roomList[roomName] = {
            count: rooms[roomName].length
        };
    });

    // 广播当前所有房间的列表和人数
    wss.clients.forEach(client => {
        client.send(JSON.stringify({ type: 'roomList', roomList: roomList }));
    });
}

// 发送所有房间的列表和人数给建立连接的客户端
function sendRoomList(client) {
    // 构建房间列表对象
    const roomList = {};
    Object.keys(rooms).forEach(roomName => {
        roomList[roomName] = {
            count: rooms[roomName].length
        };
    });

    // 发送当前所有房间的列表和人数
    client.send(JSON.stringify({ type: 'roomList', roomList: roomList }));

}

// 发送信息给指定客户端
function sendMessage(client, msgType, msg) {
    client.send(JSON.stringify({ type: msgType, message: msg }));
}

server.listen(process.env.PORT, () => {
    // 启动服务器，监听端口
    console.log(`服务器正在侦听端口 ${process.env.PORT}`);
});
