<template>
  <div class="color-blocks-background">
    <div v-for="n in 10" :key="n" class="color-block"></div>
  </div>
  <div class="backdrop-mask"></div>
</template>

<script setup>
// 该组件主要是样式控制
</script>

<style scoped lang="scss">
@function random-between($min, $max) {
  @return $min + random($max - $min);
}

.color-blocks-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -2; /* 确保背景层在内容层下方 */
}

.backdrop-mask{
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}

.color-block {
  position: absolute;
  /* 使用自定义的random-between函数生成随机宽度和高度 */
  width: random-between(250px, 400px); /* 随机生成宽度 */
  height: random-between(200px, 350px); /* 随机生成高度 */
  background: linear-gradient(45deg, rgba(255, 0, 150, 0.7), rgba(0, 255, 255, 0.7));
  border-radius: random-between(30%, 70%); /* 随机生成不同的圆角，创造不规则的形状 */
  animation: moveBlocks 20s linear infinite; /* 无限循环的运动动画 */
  opacity: 0.6;
  mix-blend-mode: screen; /* 创建混合模式，让色块有相互叠加的效果 */
}

/* 随机生成色块的初始位置 */
.color-block:nth-child(odd) {
  background: linear-gradient(45deg, rgb(78, 185, 255), rgb(255, 214, 90));
}
.color-block:nth-child(even) {
  background: linear-gradient(45deg, rgb(255, 198, 215), rgb(255, 223, 223));
}

/* 定义色块随机的运动路径 */
@keyframes moveBlocks {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(500px, -200px) scale(1.2) rotate(45deg);
  }
  50% {
    transform: translate(-300px, 300px) scale(0.8) rotate(90deg);
  }
  75% {
    transform: translate(200px, -500px) scale(1.1) rotate(135deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(360deg);
  }
}

/* 添加随机的动画时长、延迟和不同的开始位置 */
.color-block:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-duration: 15s;
  animation-delay: -2s;
}
.color-block:nth-child(2) {
  top: 30%;
  left: 50%;
  animation-duration: 18s;
  animation-delay: -3s;
}
.color-block:nth-child(3) {
  top: 50%;
  left: 70%;
  animation-duration: 20s;
  animation-delay: -4s;
}
.color-block:nth-child(4) {
  top: 70%;
  left: 40%;
  animation-duration: 22s;
  animation-delay: -5s;
}
.color-block:nth-child(5) {
  top: 20%;
  left: 80%;
  animation-duration: 17s;
  animation-delay: -1s;
}
.color-block:nth-child(6) {
  top: 60%;
  left: 10%;
  animation-duration: 25s;
  animation-delay: -6s;
}
.color-block:nth-child(7) {
  top: 80%;
  left: 30%;
  animation-duration: 12s;
  animation-delay: -2s;
}
.color-block:nth-child(8) {
  top: 15%;
  left: 55%;
  animation-duration: 30s;
  animation-delay: -7s;
}
.color-block:nth-child(9) {
  top: 45%;
  left: 25%;
  animation-duration: 18s;
  animation-delay: -3s;
}
.color-block:nth-child(10) {
  top: 65%;
  left: 65%;
  animation-duration: 24s;
  animation-delay: -4s;
}
</style>
