<template>
    <div class="scan-new-root">
        <!-- 顶栏 -->
        <div class="top-bar">
            <h1>{{ roomStore.roomTitle }}</h1>
            <el-button @click="roomStore.leaveRoom()" :icon="False" color="#000" style="font-size: 12px; color: #fff;"
                circle size="small"></el-button>
        </div>
        <!-- 房间成员列表 -->
        <div class="room-menber-list">
            <MenberStatusCard v-for="item in roomStore.roomInfo[roomStore.currentRoom].users" :username="item.username"
                :status="item.status"></MenberStatusCard>
        </div>
        <!-- 开关容器 -->
        <div class="switch-container">
            <div class="success-switch">
                <el-switch size="large" v-model="roomStore.isSuccess"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #DCDFE6" :active-action-icon="Success"
                    :inactive-action-icon="Wait" inline-prompt active-text="完成" inactive-text="等待" />
            </div>
            <div class="scan-switch">
                <el-switch size="large" v-model="isScanner"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #DCDFE6" :active-action-icon="ScanGreen"
                    :inactive-action-icon="ScanGray" inline-prompt active-text="扫码" inactive-text="扫码" />
            </div>
            <div class="me-to-switch">
                <el-switch size="large" v-model="isNeedCheck" :before-change="!isScanner"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #DCDFE6" :active-action-icon="LinkGreen"
                    :inactive-action-icon="LinkGray" inline-prompt active-text="跳转" inactive-text="跳转" />
            </div>
        </div>
        <!-- 扫码按钮容器 -->
        <div class="scan-button-container">
            <el-button v-show="isScanner" @click="startScan" class="custom-button"
                style="font-size: 70px; width: 70px; height: 70px;" :icon="ScanBlack" circle></el-button>
        </div>
    </div>
</template>

<script setup>
import MenberStatusCard from '@/components/MenberStatusCard.vue'
import Wait from '@/components/icons/Wait.vue'
import Success from '@/components/icons/Success.vue'
import ScanGray from '@/components/icons/ScanGray.vue'
import ScanGreen from '@/components/icons/ScanGreen.vue'
import ScanBlack from '@/components/icons/ScanBlack.vue'
import LinkGray from '@/components/icons/LinkGray.vue'
import LinkGreen from '@/components/icons/LinkGreen.vue'
import False from '@/components/icons/False.vue'

import { ref, watch } from 'vue'
import { useRoomStore } from '@/stores/roomStore'
import { useWeChatStore } from '@/stores/wechatStore'

const roomStore = useRoomStore()
const wechatStore = useWeChatStore()

const isNeedCheck = ref(false) // 自己进行签到的开关
const isScanner = ref(false) // 自己进行扫码的开关

// 监听扫码开关状态，开启则获取微信配置进行初始化
watch(async () => {
    if (isScanner.value) {
        // 获取微信配置
        const weChatConfig = await wechatStore.getWeChatConfig()
        // 初始化微信配置
        wechatStore.initWeChatConfig(weChatConfig)
    }
})
watch(() => {
    if (roomStore.isSuccess) {
        roomStore.updateStatus('完成')
    } else {
        roomStore.updateStatus('等待')
    }
})
watch(() => {
    if (isScanner.value) {
        roomStore.updateStatus('扫码人')
    } else {
        isNeedCheck.value = false
        roomStore.updateStatus('等待')
    }
})

// 开始调用扫一扫
const startScan = async () => {
    // 调用微信扫一扫
    await wechatStore.scanQRCode()
    roomStore.sendQRCode(wechatStore.scanResult);
    if (isNeedCheck.value) {
        // 自己需要签到则跳转签到
        window.location.href = wechatStore.scanResult;
    }
}
</script>

<style scoped lang="scss">
@import url(../assets/Styles/ScanNew.scss);

.custom-button:focus {
    outline: none;
    box-shadow: none;
    background-color: transparent;
    /* 根据需要设置背景颜色 */
    padding: 0;
    border: 0;
}
</style>