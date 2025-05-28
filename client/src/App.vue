<template>
  <div id="app" :class="{ 'dark': isDark }">
      <!-- Theme Toggle Button -->
      <button @click="toggleDark()" class="theme-toggle">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
      </button>

      <!-- First Splash Screen -->
      <div v-if="showSplash" class="splash-screen">
          <div class="brand">
              <span class="brand-weather">Weather</span><span class="brand-press">Press</span>
          </div>
          <div class="loading-bar"></div>
      </div>

      <!-- Second Splash Screen with Search -->
      <div v-if="showSecondSplash" class="splash-screen">
          <div class="brand">
              <span class="brand-weather">Weather</span><span class="brand-press">Press</span>
          </div>
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
                  <!-- Navigation Menu Bar -->
                  <div class="menu-bar">
                      <div class="menu-items">
                          <div class="menu-item" :class="{ 'active': activeMenu === 'news' }" @click="activeMenu = 'news'">
                              News
                          </div>
                          <div class="menu-item" :class="{ 'active': activeMenu === 'saved' }" @click="activeMenu = 'saved'">
                              Saved Locations
                          </div>
                          <div class="menu-item" :class="{ 'active': activeMenu === 'profile' }" @click="activeMenu = 'profile'">
                              Profile
                          </div>
                      </div>
                  </div>

                  <div class="home">
                      <div class="search-container">
                          <input
                                  v-model="city"
                                  @keyup.enter="searchWeather"
                                  placeholder="Enter city name..."
                                  class="search-input"
                          />
                          <button @click="searchWeather" class="search-button">Search</button>
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
                                <!-- Toggle Fahrenheit -->
                                <span class="temp-fahrenheit"> / {{ Math.round(celsiusToFahrenheit(weather.main.temp)) }}°F</span>
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

                      <!-- Air Pollution Card -->
                      <div v-if="airPollution" class="pollution-card">
                          <div class="pollution-header">
                              <h3>Air Quality</h3>
                          </div>
                          
                          <div 
                              class="aqi-indicator" 
                              :style="{ backgroundColor: getAqiColor(airPollution.list[0].main.aqi ) }"
                          >
                              <div class="aqi-value">{{ airPollution.list[0].main.aqi }}</div>
                              <div class="aqi-description">{{ getAqiDescription(airPollution.list[0].main.aqi) }}</div>
                          </div>
                          
                          <div class="pollutants-grid">
                              <div class="pollutant-item">
                                  <div class="pollutant-name">PM2.5</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.pm2_5 }} μg/m³</div>
                              </div>
                              <div class="pollutant-item">
                                  <div class="pollutant-name">PM10</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.pm10 }} μg/m³</div>
                              </div>
                              <div class="pollutant-item">
                                  <div class="pollutant-name">O₃</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.o3 }} μg/m³</div>
                              </div>
                              <div class="pollutant-item">
                                  <div class="pollutant-name">NO₂</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.no2 }} μg/m³</div>
                              </div>
                              <div class="pollutant-item">
                                  <div class="pollutant-name">SO₂</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.so2 }} μg/m³</div>
                              </div>
                              <div class="pollutant-item">
                                  <div class="pollutant-name">CO</div>
                                  <div class="pollutant-value">{{ airPollution.list[0].components.co }} μg/m³</div>
                              </div>
                          </div>
                      </div>

                      <!-- 30-Day Forecast -->
                      <div v-if="forecast && forecast.daily" class="thirty-day-forecast">
                        <h3>30-Day Weather Forecast</h3>
                        <div class="thirty-day-grid">
                          <div v-for="(day, index) in forecast.daily" :key="index" class="thirty-day-item">
                            <div class="thirty-day-date">{{ formatDate(day.dt * 1000) }}</div>
                            <img
                              :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`"
                              :alt="day.weather[0].description"
                              class="thirty-day-icon"
                            />
                            <div class="thirty-day-temp">{{ Math.round(day.temp.day) }}°C</div>
                          </div>
                        </div>
                      </div>

                      <!-- Enhanced 5-Day Forecast -->
                      <div v-if="forecast && forecast.daily" class="forecast-container">
                        <h3>5-Day Forecast</h3>
                        <div class="forecast-list">
                          <div v-for="(day, index) in forecast.daily.slice(0, 5)" :key="index" class="forecast-day">
                            <div class="date">{{ formatDate(day.dt * 1000) }}</div>
                            <img
                              :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                              :alt="day.weather[0].description"
                              class="forecast-icon"
                            />
                            <div class="temp">{{ Math.round(day.temp.day ) }}°C</div>
                            <div class="description">{{ day.weather[0].description }}</div>
                            
                            <div class="forecast-details">
                              <div class="forecast-detail">
                                <span class="forecast-detail-label">Humidity:</span>
                                <span>{{ day.humidity }}%</span>
                              </div>
                              <div class="forecast-detail">
                                <span class="forecast-detail-label">Wind:</span>
                                <span>{{ day.wind_speed }} m/s</span>
                              </div>
                              <div class="forecast-detail">
                                <span class="forecast-detail-label">Pressure:</span>
                                <span>{{ day.pressure }} hPa</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Saved Locations (only shown when activeMenu is 'saved') -->
                      <div v-if="activeMenu === 'saved'" class="saved-locations">
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

                      <!-- Profile Page (only shown when activeMenu is 'profile') -->
                      <div v-if="activeMenu === 'profile'" class="profile-page">
                          <div class="profile-form">
                              <h3>User Profile</h3>
                              <div class="form-group">
                                  <label class="form-label">Username</label>
                                  <input type="text" class="form-input" placeholder="Username" />
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Email</label>
                                  <input type="email" class="form-input" placeholder="Email" />
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Preferred Units</label>
                                  <select class="form-input">
                                      <option value="metric">Metric (°C)</option>
                                      <option value="imperial">Imperial (°F)</option>
                                  </select>
                              </div>
                              <button class="form-button">Save Changes</button>
                          </div>
                      </div>

                      <!-- Login Page (only shown when activeMenu is 'login') -->
                      <div v-if="activeMenu === 'login'" class="login-page">
                          <div class="login-form">
                              <h3>Login</h3>
                              <div class="form-group">
                                  <label class="form-label">Email</label>
                                  <input type="email" class="form-input" placeholder="Email" />
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Password</label>
                                  <input type="password" class="form-input" placeholder="Password" />
                              </div>
                              <button class="form-button">Login</button>
                          </div>
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
import { useThemeStore } from './stores/themeStore'
import './assets/theme.css'

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

function formatDate(timestamp) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  return new Date(timestamp).toLocaleDateString(undefined, options)
}

const weatherStore = useWeatherStore()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleDark = themeStore.toggleDark

const city = ref('')
const showSplash = ref(true)
const showSecondSplash = ref(false)
const showMain = ref(false)
const transitioning = ref(false)
const activeMenu = ref('news') // Default active menu

const weather = computed(() => weatherStore.currentWeather)
const forecast = computed(() => weatherStore.forecast)
const airPollution = computed(() => weatherStore.airPollution)
const savedLocations = computed(() => weatherStore.savedLocations)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

// Helper functions for air pollution
const getAqiDescription = (aqi) => weatherStore.getAqiDescription(aqi)
const getAqiColor = (aqi) => weatherStore.getAqiColor(aqi)

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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
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
}

.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  outline: none;
}

.splash-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.splash-search-container {
  width: 100%;
  max-width: 500px;
  padding: 0 1rem;
  margin-top: 2rem;
}

.splash-search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  font-size: 1.2rem;
  outline: none;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.loading-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background-color: var(--brand-color-accent);
  animation: loading 2s infinite ease-in-out;
}

@keyframes loading {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  font-size: 1.2rem;
}
</style>
