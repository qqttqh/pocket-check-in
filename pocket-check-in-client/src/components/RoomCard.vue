<template>
    <div class="room-card-root" @click.stop="roomStore.joinRoom(roomName)">
        <!-- 房间名和信息容器 -->
        <div class="room-name-and-message-container">
            <!-- 房间名 -->
            <div class="room-name">
                {{ roomName }}
            </div>
            <!-- 房间信息 -->
            <div class="message">
                在线 {{ count }} 人...
            </div>
        </div>
        <!-- 图标和按钮容器 -->
        <div class="icon-and-button-container">
            <!-- 图标容器 -->
            <div class="icon-container">
                <House></House>
            </div>
            <!-- 按钮 -->
            <el-button @click.stop="roomStore.joinRoom(roomName)" size="small" color="#4B3CFF" :icon="Join"
                style="font-size: 20px;" round></el-button>
        </div>
    </div>
</template>

<script setup>
import Join from '@/components/icons/Join.vue'
import House from '@/components/icons/House.vue'

import { defineProps } from 'vue'
import { useRoomStore } from '@/stores/roomStore'

const roomStore = useRoomStore()

const props = defineProps({
    roomName: String,
    count: Number
})
</script>

<style scoped lang="scss">
.room-card-root {
    width: 150px;
    height: 150px;
    padding: 10px;
    background-color: #fff;
    border-radius: 20px;

    // 房间名和信息容器
    .room-name-and-message-container {

        // 房间名
        .room-name {
            width: 130px;
            height: 36.8px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 28px;
            font-weight: 600;
        }

        // 房间信息
        .message {
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 2px;
            font-size: 12px;
            font-variant-caps: rgb(176, 175, 175);
        }
    }

    // 图标和按钮容器
    .icon-and-button-container {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin-top: 15px;

        // 图标容器
        .icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background-color: rgba($color: #B799D5, $alpha: .5);
            box-shadow: 0 0 50px rgba($color: #fff, $alpha: .6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
    }
}
</style>
