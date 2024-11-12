<template>
    <div class="menber-status-card-root">
        <!-- 头像容器 -->
        <div class="avatar-container">
            <Avatar></Avatar>
        </div>
        <!-- 用户名 -->
        <div class="username">{{ username }}</div>
        <!-- 状态容器 -->
        <div class="status-container">
            <!-- {{ status }} -->
            <Wait v-if="status === '等待'" />
            <Success v-else-if="status === '完成'" />
            <ScanGreen v-else-if="status === '扫码人'" />
        </div>
    </div>
</template>

<script setup>
import Avatar from '@/components/icons/Avatar.vue'
import Wait from '@/components/icons/Wait.vue'
import ScanGreen from '@/components/icons/ScanGreen.vue'
import Success from '@/components/icons/Success.vue'

import { defineProps } from 'vue'
const props = defineProps({
    username: String,
    status: String
})
</script>

<style scoped lang="scss">
.menber-status-card-root {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 335px;
    height: 70px;
    padding: 10px;
    border-radius: 30px;
    background-color: #fff;

    .avatar-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #fff, $alpha: .5);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        backdrop-filter: blur(10px);
    }

    .username {
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 10px;
    }

    .status-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 120px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #fff;
    }
}
</style>
