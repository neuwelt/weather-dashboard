<template>
  <div
    class="splash-screen"
    style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh;"
  >
    <div
      class="brand"
      style="text-align: center; margin-bottom: 50px;"
    >
      <div style="font-size: 4rem; font-weight: bold; margin-bottom: 10px;">
        <span style="color: #333;">Weather</span><span :style="{ color: currentColor }">Press</span>
      </div>
    </div>
    <div class="loading-bar" />
  </div>
</template>

<script setup>
defineProps({
    currentColor: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.loading-bar {
    width: 200px;
    height: 4px;
    background-color: #ddd;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
}

.loading-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #4A90E2, transparent);
    animation: loading 2s infinite;
}

@keyframes loading {
    0% { left: -100%; }
    100% { left: 100%; }
}
</style>