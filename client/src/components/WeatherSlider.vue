<template>
  <div class="forecast-slider">
    <div class="slider-header">
      <h3>5-Day Forecast</h3>
      <div class="slider-controls">
        <button
          class="slider-control"
          :disabled="currentIndex === 0"
          @click="slideLeft"
        >
          &lt;
        </button>
        <button
          class="slider-control"
          :disabled="currentIndex >= forecast.length - visibleItems"
          @click="slideRight"
        >
          &gt;
        </button>
      </div>
    </div>
    <div class="slider-container">
      <div
        class="slider-track"
        :style="{ transform: `translateX(-${currentIndex * (itemWidth + 20)}px)` }"
      >
        <div
          v-for="(day, index) in forecast"
          :key="index"
          class="forecast-day"
        >
          <div class="date">
            {{ formatDate(day.dt * 1000) }}
          </div>
          <img
            :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`"
            :alt="day.weather[0].description"
            class="forecast-icon"
          >
          <div class="temp">
            {{ Math.round(day.temp.day) }}°C
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
const props = defineProps({
    forecast: {
        type: Array,
        required: true
    }
});
const currentIndex = ref(0);
const itemWidth = ref(100);
const containerWidth = ref(0);
const visibleItems = computed(() => Math.floor(containerWidth.value / itemWidth.value));
function slideLeft() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
}
function slideRight() {
    if (currentIndex.value < props.forecast.length - visibleItems.value) {
        currentIndex.value++;
    }
}
function formatDate(timestamp) {
    const options = { weekday: 'short', day: 'numeric' };
    return new Date(timestamp).toLocaleDateString(undefined, options);
}
function updateContainerWidth() {
    const container = document.querySelector('.slider-container');
    if (container) {
        containerWidth.value = container.offsetWidth;
    }
}
onMounted(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
});
onUnmounted(() => {
    window.removeEventListener('resize', updateContainerWidth);
});
</script>

<style scoped>
/* Weather Slider Component Styles */
.forecast-slider {
    background-color: var(--details-bg-color);
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;
    box-shadow: var(--card-shadow);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    color: var(--text-color);
}
.slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--text-color);
}
.slider-controls {
    display: flex;
    gap: 0.5rem;
}
.slider-control {
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    transition: opacity 0.3s ease, background-color 0.3s ease;
}
.slider-control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.slider-container {
    overflow: hidden;
    position: relative;
}
.slider-track {
    display: flex;
    transition: transform 0.3s ease;
}
.forecast-day {
    min-width: 100px;
    flex-shrink: 0;
    margin-right: 20px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: background-color 0.3s ease;
    color: var(--text-color);
}
.date {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}
.temp {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0.5rem 0;
    color: var(--text-color);
}
.forecast-icon {
    width: 50px;
    height: 50px;
}
</style>