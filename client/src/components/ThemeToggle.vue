<template>
  <button
    class="theme-toggle"
    @click="$emit('toggle')"
  >
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script setup>
defineProps({
    isDark: {
        type: Boolean,
        required: true
    }
})

defineEmits(['toggle'])
</script>

<style scoped>
.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
}
</style>