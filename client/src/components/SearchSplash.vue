<template>
  <div
    class="splash-screen"
    style="background-color: #F8F5EC;"
  >
    <div class="brand">
      <span class="brand-weather">Weather</span><span class="brand-press">Press</span>
    </div>
    <transition name="fade">
      <div class="splash-search-container">
        <input
          :value="city"
          placeholder="Enter city name..."
          class="splash-search-input"
          style="border: 2px solid #2D2D2D;"
          @input="$emit('update:city', $event.target.value)"
          @keyup.enter="$emit('search')"
        >
        <div style="text-align: center; margin-top: 20px;">
          <button
            style="background: none;
            border: none; color: #2D2D2D;
            cursor: pointer;
            text-decoration: underline;
            font-size: 14px;
            font-family: 'Comfortaa', sans-serif;"
            @click="$emit('show-login')"
          >
            I already have an account
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
    city: {
        type: String,
        required: true
    }
})

defineEmits(['update:city', 'search', 'show-login'])
</script>

<style scoped>
.splash-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.brand {
    text-align: center;
    margin-bottom: 50px;
    font-size: 3rem;
    font-weight: bold;
}

.brand-weather {
    color: #333;
}

.brand-press {
    color: #4A90E2;
}

.splash-search-container {
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.splash-search-input {
    width: 100%;
    padding: 15px 20px;
    border-radius: 8px;
    background-color: #FFFCF7;
    color: #2D2D2D;
    font-family: 'Comfortaa', sans-serif;
    font-size: 16px;
    box-sizing: border-box;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>