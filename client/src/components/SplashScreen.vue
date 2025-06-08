<template>
  <div
    v-if="showSplash || showSecondSplash"
    class="splash-screen"
    :style="{ backgroundColor: currentColor }"
  >
    <div
      v-if="showSplash"
      class="splash-content"
    >
      <h1>Welcome to WeatherPress</h1>
    </div>
    <div
      v-else
      class="splash-search"
    >
      <input
        v-model="city"
        placeholder="Enter a city..."
      >
      <button @click="handleSplashSearch">
        Search
      </button>
      <button @click="showLoginPageFunc">
        Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'

const props = defineProps({
    onSearchComplete: {
        type: Function,
        required: true
    },
    showLogin: {
        type: Function,
        required: true
    }
})

const weatherStore = useWeatherStore()

const showSplash = ref(true)
const showSecondSplash = ref(false)
const city = ref('')
const currentColor = ref('#fff')
const colors = ['#F28C38', '#F9C497', '#FCE0C7', '#FFFCF7']
let colorIndex = 0

onMounted(() => {
    const interval = setInterval(() => {
        colorIndex = (colorIndex + 1) % colors.length
        currentColor.value = colors[colorIndex]
    }, 300)

    setTimeout(() => {
        clearInterval(interval)
        showSplash.value = false
        showSecondSplash.value = true
    }, 2000)
})

async function handleSplashSearch() {
    if (!city.value) return
    await weatherStore.fetchWeather(city.value)
    props.onSearchComplete()
}

function showLoginPageFunc() {
    props.showLogin()
}
</script>

<style scoped>
.splash-screen {
    width: 100vw;
    height: 100vh;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.splash-content h1 {
    font-size: 3rem;
    color: #2D2D2D;
}

.splash-search {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.splash-search input {
    padding: 12px 16px;
    border: 2px solid #2D2D2D;
    border-radius: 8px;
    font-size: 16px;
}

.splash-search button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background-color: #2D2D2D;
    color: #FFFCF7;
    font-weight: 500;
    cursor: pointer;
}
</style>
