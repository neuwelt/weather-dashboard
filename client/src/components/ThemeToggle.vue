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
    isDark: Boolean
})

defineEmits(['toggle'])
</script>

<style scoped>
.theme-toggle {
    position: fixed;
    top: 14px;
    right: 20px;
    z-index: 1001;
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0;
}
</style>
