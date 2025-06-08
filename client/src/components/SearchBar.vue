<template>
  <div class="search-container">
    <input
      :value="city"
      placeholder="Enter city name..."
      class="search-input"
      @input="$emit('update:city', $event.target.value)"
      @keyup.enter="$emit('search')"
    >
    <button
      class="search-button"
      @click="$emit('search')"
    >
      Search
    </button>
  </div>
</template>

<script setup>
defineProps({
    city: {
        type: String,
        required: true
    }
})

defineEmits(['update:city', 'search'])
</script>

<style scoped>
.search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.search-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #2D2D2D;
    border-radius: 8px;
    background-color: #FFFCF7;
    color: #2D2D2D;
    font-family: 'Comfortaa', sans-serif;
    font-size: 16px;
}

.search-button {
    padding: 12px 24px;
    background-color: #2D2D2D;
    color: #FFFCF7;
    border: none;
    border-radius: 8px;
    font-family: 'Comfortaa', sans-serif;
    font-weight: 500;
    cursor: pointer;
}
</style>