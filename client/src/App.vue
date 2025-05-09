<template>
  <div id="app">
      <!-- First Splash Screen -->
      <div v-if="showSplash" class="splash-screen">
          <h1>🌤️ Weather Dashboard</h1>
          <p>Loading...</p>
      </div>

      <!-- Second Splash Screen with Search -->
      <div v-if="showSecondSplash" class="splash-screen">
          <transition name="fade">
              <div class="splash-search-container">
                  <input
                          v-model="city"
                          @keyup.enter="handleSplashSearch"
                          placeholder="Enter city name..."
                          class="splash-search-input"
                  />
              </div>
          </transition>
      </div>

      <!-- Main content: This should appear only after both splash screens -->
      <div v-if="showMain" class="app" :class="{ 'main-transition': transitioning }">
          <transition name="slide-up">
              <main>
                  <div class="home">
                      <div class="search-container">
                          <input
                                  v-model="city"
                                  @keyup.enter="searchWeather"
                                  placeholder="Enter city name..."
                                  class="search-input"
                          />
                      </div>

                      <div v-if="isLoading" class="loading">Loading...</div>
                      <div v-else-if="error" class="error">{{ error }}</div>

                      <div v-else-if="weather" class="weather-card">
                          <div class="weather-header">
                              <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
                              <button @click="saveLocation" class="save-button">Save Location</button>
                          </div>

                          <div class="weather-body">
                              <div class="temperature">
                                  <span class="temp-value">{{ Math.round(weather.main.temp) }}°C</span>
                                  <span class="feels-like">Feels like: {{ Math.round(weather.main.feels_like) }}°C</span>
                              </div>

                              <div class="weather-info">
                                  <img
                                          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                                          :alt="weather.weather[0].description"
                                          class="weather-icon"
                                  />
                                  <div class="weather-description">{{ weather.weather[0].description }}</div>
                              </div>
                          </div>

                          <div class="weather-details">
                              <div class="detail">
                                  <span class="label">Humidity:</span>
                                  <span class="value">{{ weather.main.humidity }}%</span>
                              </div>
                              <div class="detail">
                                  <span class="label">Wind:</span>
                                  <span class="value">{{ weather.wind.speed }} m/s</span>
                              </div>
                              <div class="detail">
                                  <span class="label">Pressure:</span>
                                  <span class="value">{{ weather.main.pressure }} hPa</span>
                              </div>
                          </div>
                      </div>

                      <div class="saved-locations">
                          <h3>Saved Locations</h3>
                          <div v-if="savedLocations.length === 0" class="no-locations">
                              No saved locations yet.
                          </div>
                          <ul v-else class="locations-list">
                              <li v-for="location in savedLocations" :key="location.id" class="location-item">
                <span class="location-name" @click="loadSavedLocation(location)">
                  {{ location.city_name }}
                </span>
                                  <button @click="deleteLocation(location.id)" class="delete-button">Delete</button>
                              </li>
                          </ul>
                      </div>
                  </div>
              </main>
          </transition>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWeatherStore } from './stores/weatherStore'

const weatherStore = useWeatherStore()
const city = ref('')
const showSplash = ref(true)
const showSecondSplash = ref(false)
const showMain = ref(false)
const transitioning = ref(false)

const weather = computed(() => weatherStore.currentWeather)
const savedLocations = computed(() => weatherStore.savedLocations)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

onMounted(async () => {
  // Show the first splash screen for 2 seconds
  setTimeout(() => {
      showSplash.value = false
      showSecondSplash.value = true
  }, 2000)

  // Get saved locations after mounting
  await weatherStore.getSavedLocations()
})

async function handleSplashSearch() {
  if (!city.value) return
  transitioning.value = true
  await searchWeather()
  setTimeout(() => {
      showSecondSplash.value = false
      showMain.value = true
      transitioning.value = false
  }, 800) // Transition time to main content
}

async function searchWeather() {
  if (!city.value) return
  await weatherStore.fetchWeather(city.value)
}

async function saveLocation() {
  if (!weather.value) return
  await weatherStore.saveLocation({
      city_name: weather.value.name,
      latitude: weather.value.coord.lat,
      longitude: weather.value.coord.lon
  })
}

async function loadSavedLocation(location) {
  city.value = location.city_name
  await searchWeather()
}

async function deleteLocation(id) {
  await weatherStore.deleteLocation(id)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Moranga&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Moranga', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #a8d0f7;
}

.splash-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #a8d0f7;
  text-align: center;
}

.splash-search-container {
  width: 100%;
  max-width: 500px;
  padding: 0 1rem;
}

.splash-search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 9999px;
  border: none;
  font-size: 1.2rem;
  outline: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-ente-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  animation: slide-up 0.8s ease-out forwards;
}
@keyframes slide-up {
  0% {
      transform: translateY(100px);
      opacity: 0;
  }
  100% {
      transform: translateY(0);
      opacity: 1;
  }
}

.app {
  padding: 2rem;
  min-height: 100vh;
  background-color: #a8d0f7;
}

.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.search-input {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: none;
  font-size: 1rem;
  width: 100%;
  max-width: 500px;
  outline: none;
}

.save-button, .delete-button {
  padding: 0.5rem 1rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-button {
  background-color: #e74c3c;
}

.weather-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #a8d0f7;
  color: #333;
}

.weather-body {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  align-items: center;
}

.temperature {
  display: flex;
  flex-direction: column;
}

.temp-value {
  font-size: 3rem;
  font-weight: bold;
}

.feels-like {
  font-size: 0.875rem;
  color: #555;
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

.weather-description {
  text-transform: capitalize;
  font-size: 1.25rem;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background-color: #f8f9fa;
}

.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 0.875rem;
  color: #777;
}

.value {
  font-size: 1.25rem;
  font-weight: bold;
}

.saved-locations {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.no-locations {
  color: #777;
  text-align: center;
  padding: 1rem;
}

.locations-list {
  list-style: none;
  padding: 0;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.location-name {
  cursor: pointer;
  color: #333;
}

.location-name:hover {
  text-decoration: underline;
}
</style>