import { defineStore } from 'pinia'; // 引入Pinia的defineStore函数
import { ref, reactive } from 'vue'; // 引入Vue的ref函数
import { ElMessage } from 'element-plus';

// 定义一个名为 'roomStore' 的store
export const useRoomStore = defineStore('room', () => {
    // 定义状态变量
    const rooms = ref([]); // 存储房间列表
    const currentRoom = ref(null); // 当前加入的房间
    const roomInfo = reactive({});// 存储房间信息
    const roomTitle = ref(''); // 当前房间的标题
    const ws = ref(null); // WebSocket连接
    const username = ref(''); // 用户名
    const historyRoomName = ref('')
    const isSuccess = ref(false) // 签到完成

    // 初始化WebSocket连接`
    const initWebSocket = (user) => {
        username.value = user;
        ws.value = new WebSocket(`/api?username=${encodeURIComponent(username.value)}`); // 创建WebSocket连接

        // 监听连接打开事件
        ws.value.onopen = () => {
            console.log('WebSocket connection opened');
            // 你可以在这里进行连接成功后的操作
        };

        // 监听消息事件
        ws.value.onmessage = (event) => {
            const data = JSON.parse(event.data); // 解析消息
            switch (data.type) {
                case 'success':
                    ElMessage.success(data.message);
                    break;
                case 'fail':
                    ElMessage.error(data.message);
                    break;
                case 'roomInfo':
                    updateRoomInfo(data);
                    break;
                case 'joinSuccess':
                    handleJoinSuccess(data);
                    break;
                case 'deleteRoom':
                    handleDeleteRoom(data.roomName);
                    break;
                case 'roomList':
                    handleRoomList(data);
                    break;
                case 'scanResult':
                    handleScanResult(data);
                    break;
            }
        };

        // 监听错误事件
        ws.value.onerror = (error) => {
            console.error('WebSocket 错误:', error);
            // 你可以在这里进行错误处理
        };

        // 监听连接关闭事件
        ws.value.onclose = () => {
            currentRoom.value = null;
            console.log('WebSocket 连接已关闭');
            // 你可以在这里进行连接关闭后的操作
        };
    };

    // 更新房间信息
    const updateRoomInfo = (data) => {
        const { roomName, count, users } = data;
        roomTitle.value = `${roomName}(${count}人)`;
        roomInfo[roomName] = {
            count: count,
            users: users
        }
    };

    // 处理加入房间成功
    const handleJoinSuccess = (data) => {
        currentRoom.value = data.currentRoom;
    };
    // 处理删除房间
    const handleDeleteRoom = (roomName) => {
        delete roomInfo[roomName]
    }

    // 处理房间列表
    const handleRoomList = (data) => {
        if (!data.roomList) {
            rooms.value = [];
        } else {
            rooms.value = Object.keys(data.roomList).map(key => ({
                roomName: key,
                count: data.roomList[key].count
            }));
        }
    };

    // 处理扫描二维码结果
    const handleScanResult = (data) => {
        if (!isSuccess.value) {
            window.location.href = data.url;
        }
    };

    // 创建房间
    const createRoom = (roomName) => {
        historyRoomName.value = roomName
        if (ws.value && roomName) {
            ws.value.send(JSON.stringify({ type: 'createRoom', roomName }));
        }
    };

    // 加入房间
    const joinRoom = (roomName) => {
        if (ws.value && roomName) {
            ws.value.send(JSON.stringify({ type: 'joinRoom', roomName }));
        }
    };
    const updateStatus = (status) => {
        if (ws.value && status) {
            ws.value.send(JSON.stringify({ type: 'updateStatus', status }));
        }
    };

    // 离开房间
    const leaveRoom = () => {
        if (ws.value && currentRoom.value) {
            ws.value.send(JSON.stringify({ type: 'leaveRoom', roomName: currentRoom.value }));
            currentRoom.value = null;
        }
    };

    // 扫描二维码
    const sendQRCode = (url) => {
        // const url = prompt('Enter QR Code URL'); // 使用提示框获取URL
        if (ws.value && url) {
            ws.value.send(JSON.stringify({ type: 'scan', url }));
        }
    };

    // 返回store中定义的状态和方法
    return {
        rooms,
        currentRoom,
        roomTitle,
        username,
        roomInfo,
        historyRoomName,
        isSuccess,
        initWebSocket,
        createRoom,
        joinRoom,
        leaveRoom,
        sendQRCode,
        updateStatus
    };
}, {
    persist: {
        paths: ['username', 'historyRoomName']
    }
});
