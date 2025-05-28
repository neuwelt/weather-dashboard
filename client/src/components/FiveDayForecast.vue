<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  forecast: {
    type: Array,
    required: false,
    default: () => []
  },
})

const filteredForecast = computed(() => {
  if (!props.forecast) return []
  return props.forecast
    .filter(item => item.dt_txt.includes('12:00:00'))
    .slice(0, 5)
})

function formatDate(dt_txt) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  return new Date(dt_txt).toLocaleDateString(undefined, options)
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="forecast-container" v-if="filteredForecast.length">
    <h3>5-Day Forecast</h3>
    <div class="forecast-list">
      <div v-for="day in filteredForecast" :key="day.dt" class="forecast-day">
        <div class="date">{{ formatDate(day.dt_txt) }}</div>
        <img
          :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
          :alt="day.weather[0].description"
          class="weather-icon"
        />
        <div class="description">{{ capitalize(day.weather[0].description) }}</div>
        <div class="temperature">
          {{ Math.round(day.main.temp) }}°C / {{ Math.round(celsiusToFahrenheit(day.main.temp)) }}°F
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No forecast data available.</p>
  </div>
</template>