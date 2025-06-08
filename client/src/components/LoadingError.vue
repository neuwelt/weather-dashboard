<template>
  <div
    v-if="isLoading"
    class="loading"
  >
    Loading...
  </div>
  <div
    v-else-if="error"
    class="error"
  >
    {{ error }}
  </div>
</template>

<script setup>
defineProps({
    isLoading: {
        type: Boolean,
        required: true
    },
    error: {
        type: String,
        default: null
    }
})
</script>

<style scoped>
.loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #2D2D2D;
}

.error {
    color: #c62828;
}
</style>