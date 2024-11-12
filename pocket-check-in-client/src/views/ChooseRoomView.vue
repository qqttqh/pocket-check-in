<template>
    <div class="chooce-room-new-root">
        <!-- 修改用户名-输入卡片 -->
        <inputCard v-if="userNameInputSwitch" @close="userNameInputSwitch = false" @confirm="saveUserName"
            :default-value="roomStore.username" input-title="用户名" />
        <!-- 输入用户名-输入卡片 -->
        <inputCard v-if="roomStore.username == ''" @close="userNameInputSwitch = false" @confirm="saveUserName"
            :default-value="roomStore.username" input-title="用户名" />
        <!-- 创建新房间-输入卡片 -->
        <inputCard v-if="createNewRoomInputSwitch" @close="createNewRoomInputSwitch = false" @confirm="createNewRoom"
            input-title="创建房间" :default-value="roomStore.historyRoomName" />
        <!-- 用户名 -->
        <div class="top-bar" @click="userNameInputSwitch = true">
            <div class="username-container"><span>{{ roomStore.username }}</span></div>
            <Right></Right>
        </div>
        <!-- 房间列表 -->
        <div class="room-card-list">
            <RoomCard :room-name="item.roomName" :count="item.count" v-for="item in roomStore.rooms" />
            <NoRoom v-if="roomStore.rooms[0] == null"></NoRoom>
        </div>
        <!-- 按钮容器 -->
        <div class="button-container">
            <el-button @click="createNewRoomInputSwitch = true" style="font-size: 18px;" color="#010302" :icon="Add"
                size="large" round></el-button>
        </div>
    </div>
</template>

<script setup>
import RoomCard from '@/components/RoomCard.vue'
import Add from '@/components/icons/Add.vue'
import Right from '@/components/icons/Right.vue'
import NoRoom from '@/components/NoRoom.vue'
import inputCard from '@/components/InputCard.vue'

import { useRoomStore } from '@/stores/roomStore'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 用户名输入卡开关
const userNameInputSwitch = ref(false)
// 创建新房间输入卡开关
const createNewRoomInputSwitch = ref(false)
// 房间仓库
const roomStore = useRoomStore()

// 更新昵称
function saveUserName(newValue) {
    // 用户名非空校验
    if (newValue) {
        roomStore.username = newValue //新昵称存入仓库
        location.reload() // 刷新页面
    } else {
        ElMessage({
            message: '用户名不能为空！',
            type: 'warning'
        })
    }
}
// 创建房间
function createNewRoom(newValue) {
    // 房间名非空校验
    if (newValue) {
        roomStore.createRoom(newValue)
        createNewRoomInputSwitch.value = false
    } else {
        ElMessage({
            message: '房间名不能为空！',
            type: 'warning'
        })
    }
}
</script>

<style scoped lang="scss">
@import url(../assets/Styles/ChooseRoomNew.scss);
</style>