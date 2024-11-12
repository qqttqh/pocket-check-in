<template>
    <div class="input-card-root" @click.self="emit('close')">
        <!-- 输入卡片主体 -->
        <div class="input-card-main">
            <!-- 标题 -->
            <h2>{{ inputTitle }}</h2>
            <!-- 输入框容器 -->
            <div class="input-container">
                <input v-model="inputCache" type="text">
            </div>
            <!-- 按钮容器 -->
            <div class="button-container">
                <span>
                    <el-button @click="emit('close')" color="#010302" :icon="False" round></el-button>
                    <el-button @click="emit('confirm', inputCache)" :icon="True" color="#010302" round></el-button>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import False from '@/components/icons/False.vue'
import True from '@/components/icons/True.vue'

import { ref, defineProps, defineEmits, onMounted } from 'vue'

// 输入框缓存
const inputCache = ref('')
// 定义props
const props = defineProps({
    inputTitle: String,
    defaultValue: String
})
// 定义emit
const emit = defineEmits(['close', 'confirm'])

onMounted(() => {
    // 挂载完成后将用户名缓存
    inputCache.value = props.defaultValue
})
</script>

<style scoped lang="scss">
.input-card-root {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: .2);

    // 输入卡片主体
    .input-card-main {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 320px;
        height: 200px;
        padding: 20px;
        border-radius: 30px;
        background-color: rgba($color: #fff, $alpha: .5);
        backdrop-filter: blur(10px);

        // 标题
        h2 {
            text-align: center;
        }

        // 输入框容器
        .input-container {
            display: flex;
            justify-content: center;

            input {
                padding: 0 10px;
                width: 200px;
                height: 30px;
                background-color: transparent;
                outline: none;
                border: none;
                border-radius: 15px;
                box-shadow: inset 0 0 20px rgba($color: #fff, $alpha: .5);
                text-align: center;
                font-size: 16px;
            }
        }

        .button-container {
            display: flex;
            justify-content: center;
        }
    }


}
</style>
