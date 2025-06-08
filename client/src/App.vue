<template>
  <div
    id="app"
    :class="{ 'dark': isDark }"
    style="font-family: 'Comfortaa', sans-serif;"
  >
    <!-- Theme Toggle Button -->
    <button
      class="theme-toggle"
      @click="toggleDark()"
    >
      <span v-if="isDark">☀️</span>
      <span v-else>🌙</span>
    </button>

    <!-- First Splash Screen -->
    <div
      v-if="showSplash"
      class="splash-screen"
      style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh;"
    >
      <div
        class="brand"
        style="text-align: center; margin-bottom: 50px;"
      >
        <div style="font-size: 4rem; font-weight: bold; margin-bottom: 10px;">
          <span style="color: #333;">Weather</span><span :style="{ color: currentColor }">Press</span>
        </div>
      </div>
      <div class="loading-bar" />
    </div>

    <!-- Second Splash Screen with Search -->
    <div
      v-if="showSecondSplash"
      class="splash-screen"
      style="background-color: #F8F5EC;"
    >
      <div class="brand">
        <span class="brand-weather">Weather</span><span class="brand-press">Press</span>
      </div>
      <transition name="fade">
        <div class="splash-search-container">
          <input
            v-model="city"
            placeholder="Enter city name..."
            class="splash-search-input"
            style="border: 2px solid #2D2D2D;"
            @keyup.enter="handleSplashSearch"
          >
          <div style="text-align: center; margin-top: 20px;">
            <button
              style="background: none;
              border: none; color: #2D2D2D;
              cursor: pointer;
              text-decoration: underline;
              font-size: 14px;
              font-family: 'Comfortaa', sans-serif;"
              @click="showLoginPageFunc"
            >
              I already have an account
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Login Page -->
    <div
      v-if="showLoginPageState"
      class="login-page"
      style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; padding: 20px;"
    >
      <div
        class="brand"
        style="text-align: center; margin-bottom: 40px;"
      >
        <div style="font-size: 3rem; font-weight: bold; color: #333; margin-bottom: 10px;">
          WeatherPress
        </div>
        <div style="font-size: 1.2rem; color: #666;">
          Welcome back!
        </div>
      </div>

      <div
        class="login-form"
        style="background-color: #FFFCF7; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px;"
      >
        <div
          v-if="loginError"
          style="background-color: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #ef5350;"
        >
          {{ loginError }}
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
          <input
            v-model="loginEmail"
            type="email"
            placeholder="Enter your email"
            style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #333; font-family: 'Comfortaa', sans-serif;"
          >
        </div>

        <div style="margin-bottom: 30px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Password</label>
          <input
            v-model="loginPassword"
            type="password"
            placeholder="Enter your password"
            style="width: 100%; padding: 12px; border: 2px solid #2D2D2D; border-radius: 8px; background-color: #FFFCF7; color: #333; font-family: 'Comfortaa', sans-serif;"
          >
        </div>

        <button
          style="width: 100%;
          padding: 12px;
          background-color: #2D2D2D;
          color: #FFFCF7;
          border: none;
          border-radius: 8px;
          font-family: 'Comfortaa', sans-serif;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 20px;"
          @click="handleLogin"
        >
          Login
        </button>

        <div style="text-align: center;">
          <span
            style="color: #2D2D2D;
            cursor: pointer;
            text-decoration: underline;
            font-size: 14px;"
            @click="goBackToSplash"
          >Back to search</span>
        </div>
      </div>
    </div>

    <!-- Main content: This should appear only after both splash screens -->
    <div
      v-if="showMain"
      class="app"
      :class="{ 'main-transition': transitioning }"
    >
      <!-- Fixed Header -->
      <div class="fixed-header">
        <div class="profile-section">
          Profile
        </div>
        <div class="web-name">
          Weather Press
        </div>
        <button
          class="menu-button"
          :class="{ 'menu-active': isMenuOpen }"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- Full Screen Menu -->
      <div
        class="fullscreen-menu"
        :class="{ 'menu-open': isMenuOpen }"
      >
        <button
          class="close-menu-button"
          @click="closeMenu"
        >
          ×
        </button>
        <div class="menu-content">
          <div
            class="menu-item"
            @click="setActiveMenu('news')"
          >
            News
          </div>
          <div
            class="menu-item"
            @click="setActiveMenu('saved')"
          >
            Saved Locations
          </div>
          <div
            class="menu-item"
            @click="setActiveMenu('profile')"
          >
            Profile
          </div>
        </div>
      </div>

      <transition name="slide-up">
        <main class="main-content">
          <div class="home">
            <div class="search-container">
              <input
                v-model="city"
                placeholder="Enter city name..."
                class="search-input"
                @keyup.enter="searchWeather"
              >
              <button
                class="search-button"
                @click="searchWeather"
              >
                Search
              </button>
            </div>

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

            <!-- Main Weather Block - Updated Layout -->
            <div
              v-else-if="weather"
              class="main-weather-container"
            >
              <div class="weather-illustration-container">
                <img
                  src="./assets/icons/girl-with-fan.png"
                  alt="Weather illustration"
                  class="weather-illustration"
                >
                <div class="air-pollution-info">
                  <div class="air-pollution-title">
                    Air pollution: Fair
                  </div>
                  <div class="air-pollution-description">
                    Air quality is fine, but sensitive groups may feel some effects over time.
                  </div>
                </div>
              </div>

              <div class="main-weather-info">
                <h1 class="city-name">
                  {{ weather.name }}
                </h1>
                <div class="temperature-main">
                  {{ Math.round(weather.main.temp) }}°C {{ weather.weather[0].main }}
                </div>
                <div class="feels-like-pill">
                  Feels like: {{ Math.round(weather.main.feels_like) }}°C
                </div>
              </div>
            </div>

            <!-- Weather Details Cards -->
            <div
              v-if="weather"
              class="weather-details-grid"
            >
              <!-- Forecast Cards -->
              <div class="forecast-cards">
                <div class="forecast-card">
                  <div class="forecast-date">
                    22 May
                  </div>
                  <div class="forecast-temp">
                    22°C
                  </div>
                  <div class="forecast-icon">
                    ☀️
                  </div>
                </div>
                <div class="forecast-card">
                  <div class="forecast-date">
                    23 May
                  </div>
                  <div class="forecast-temp">
                    10°C
                  </div>
                  <div class="forecast-icon">
                    ☀️
                  </div>
                </div>
              </div>

              <!-- Weather Stats Card -->
              <div class="weather-stats-card">
                <div class="stat-item">
                  <span class="stat-label">Humidity:</span>
                  <span class="stat-value">{{ weather?.main.humidity }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Wind:</span>
                  <span class="stat-value">{{ weather?.wind.speed }} km/h</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Pressure:</span>
                  <span class="stat-value">{{ weather?.main.pressure }} mb</span>
                </div>
              </div>
            </div>

            <!-- 30-Day Forecast Section -->
            <div
              v-if="forecast && forecast.daily"
              class="thirty-day-section"
            >
              <h3 class="section-title">
                30 Days Weather
              </h3>
            </div>

            <!-- Saved Locations (only shown when activeMenu is 'saved') -->
            <div
              v-if="activeMenu === 'saved'"
              class="saved-locations"
            >
              <h3>Saved Locations</h3>
              <div
                v-if="savedLocations.length === 0"
                class="no-locations"
              >
                No saved locations yet.
              </div>
              <ul
                v-else
                class="locations-list"
              >
                <li
                  v-for="location in savedLocations"
                  :key="location.id"
                  class="location-item"
                >
                  <span
                    class="location-name"
                    @click="loadSavedLocation(location)"
                  >
                    {{ location.city_name }}
                  </span>
                  <button
                    class="delete-button"
                    @click="deleteLocation(location.id)"
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>

            <!-- Profile Page (only shown when activeMenu is 'profile') -->
            <div
              v-if="activeMenu === 'profile'"
              class="profile-page"
            >
              <div class="profile-form">
                <h3>User Profile</h3>
                <div class="form-group">
                  <label class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Username"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-input"
                    placeholder="Email"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Preferred Units</label>
                  <select class="form-input">
                    <option value="metric">
                      Metric (°C)
                    </option>
                    <option value="imperial">
                      Imperial (°F)
                    </option>
                  </select>
                </div>
                <button class="form-button">
                  Save Changes
                </button>
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
//import WeatherSlider from './components/WeatherSlider.vue'
import './assets/theme.css'
import './assets/main.css'

//function formatDate(timestamp) {
//    const options = { weekday: 'short', month: 'short', day: 'numeric' }
//    return new Date(timestamp).toLocaleDateString(undefined, options)
//}

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
const currentColor = ref('#333')
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const showLoginPageState = ref(false)
const isMenuOpen = ref(false)

const colors = ['#333', '#FF8C00', '#4A90E2', '#333']
let colorIndex = 0

const weather = computed(() => weatherStore.currentWeather)
const forecast = computed(() => weatherStore.forecast)
//const airPollution = computed(() => weatherStore.airPollution)
const savedLocations = computed(() => weatherStore.savedLocations)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

// Helper functions for air pollution
//const getAqiDescription = (aqi) => weatherStore.getAqiDescription(aqi)

onMounted(async () => {
    // Start color animation
    const colorInterval = setInterval(() => {
        colorIndex = (colorIndex + 1) % colors.length
        currentColor.value = colors[colorIndex]
    }, 300)

    // Show the first splash screen for 2 seconds
    setTimeout(() => {
        clearInterval(colorInterval)
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

/*
function saveLocation() {
    if (!weather.value) return
    weatherStore.saveLocation({
        city_name: weather.value.name,
        country_code: weather.value.sys.country,
        latitude: weather.value.coord.lat,
        longitude: weather.value.coord.lon
    })
}
 */

async function loadSavedLocation(location) {
    await weatherStore.fetchWeatherByCoords(location.latitude, location.longitude)
    activeMenu.value = 'news' // Switch back to main view
    closeMenu()
}

async function deleteLocation(id) {
    await weatherStore.deleteLocation(id)
}

function showLoginPageFunc() {
    showSecondSplash.value = false
    showLoginPageState.value = true
}

function handleLogin() {
    // Clear previous error
    loginError.value = ''

    // Check if fields are empty
    if (!loginEmail.value.trim()) {
        loginError.value = 'Please enter your email'
        return
    }

    if (!loginPassword.value.trim()) {
        loginError.value = 'Please enter your password'
        return
    }

    // Handle login logic here
    console.log('Login attempt:', loginEmail.value, loginPassword.value)
    // After successful login, go to main page
    showLoginPageState.value = false
    showMain.value = true
}

function goBackToSplash() {
    showLoginPageState.value = false
    showSecondSplash.value = true
}

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
    isMenuOpen.value = false
}

function setActiveMenu(menu) {
    activeMenu.value = menu
    closeMenu()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
@import './assets/app-styles.css';

* {
    font-family: 'Comfortaa', sans-serif !important;
}

/* Main App Background */
.app {
    background: linear-gradient(180deg, #FFFCF7 0%, #FFFCF7 30%, #F7D0D0 67%, #D0E8F2 100%);
    min-height: 100vh;
}

/* Fixed Header Styles */
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #FFFCF7;
    z-index: 1000;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: none;
    border-bottom: 1px solid rgba(45, 45, 45, 0.1);
}

.profile-section {
    font-weight: 500;
    color: #2D2D2D;
    font-size: 16px;
}

.web-name {
    font-weight: bold;
    font-size: 1.2rem;
    color: #2D2D2D;
}

/* Main Content */
.main-content {
    padding: 100px 20px 40px 20px;
    max-width: 1400px;
    margin: 0 auto;
}

/* Search Container */
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

/* Main Weather Container */
.main-weather-container {
    display: flex;
    gap: 40px;
    margin-bottom: 40px;
    align-items: flex-start;
}

.weather-illustration-container {
    flex: 0 0 auto;
}

.weather-illustration {
    width: 180px;
    height: 180px;
    object-fit: contain;
    margin-bottom: 20px;
}

.air-pollution-info {
    max-width: 180px;
}

.air-pollution-title {
    font-weight: 600;
    color: #2D2D2D;
    font-size: 14px;
    margin-bottom: 8px;
}

.air-pollution-description {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
}

.main-weather-info {
    flex: 1;
    padding-top: 20px;
}

.city-name {
    font-size: 4rem;
    font-weight: bold;
    color: #2D2D2D;
    margin: 0 0 10px 0;
    line-height: 1;
}

.temperature-main {
    font-size: 2rem;
    color: #2D2D2D;
    margin-bottom: 15px;
    font-weight: 500;
}

.feels-like-pill {
    background: linear-gradient(90deg, #D0E8F2 0%, #D0E8F2 100%);
    color: #2D2D2D;
    padding: 12px 24px;
    border-radius: 25px;
    display: inline-block;
    font-weight: 500;
    font-size: 16px;
}

/* Weather Details Grid */
/*.weather-details-grid {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}*/

.forecast-cards {
    display: flex;
    gap: 15px;
}

.forecast-card {
    background: linear-gradient(135deg, #FFFCF7 0%, #F7D0D0 100%);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    min-width: 120px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.forecast-date {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.forecast-temp {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2D2D2D;
    margin-bottom: 10px;
}

.forecast-icon {
    font-size: 1.5rem;
}

.weather-stats-card {
    background: linear-gradient(135deg, #F7D0D0 0%, #F7D0D0 100%);
    padding: 25px;
    border-radius: 12px;
    flex: 1;
    min-width: 300px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 16px;
}

.stat-item:last-child {
    margin-bottom: 0;
}

.stat-label {
    color: #2D2D2D;
    font-weight: 500;
}

.stat-value {
    color: #2D2D2D;
    font-weight: 600;
}

/* 30 Days Section */
.thirty-day-section {
    margin-top: 60px;
}

.section-title {
    color: #3B7EA1;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    text-align: left;
}

/* Animated Menu Button */
.menu-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: 30px;
    height: 30px;
    justify-content: space-around;
    z-index: 1003;
    position: relative;
}

.menu-button span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #2D2D2D;
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
}

.menu-button.menu-active span {
    background-color: white;
}

.menu-button.menu-active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.menu-button.menu-active span:nth-child(2) {
    opacity: 0;
}

.menu-button.menu-active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

/* Full Screen Menu */
.fullscreen-menu {
    position: fixed;
    top: -100vh;
    left: 0;
    right: 0;
    height: 100vh;
    background: linear-gradient(135deg, #F28C38 0%, #F9C497 40%, #FCE0C7 62%, #FFFCF7 100%);
    z-index: 1002;
    transition: top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    align-items: center;
    justify-content: center;
}

.fullscreen-menu.menu-open {
    top: 0;
}

.menu-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.menu-item {
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    cursor: pointer;
    padding: 20px 40px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
}

.menu-item:hover {
    color: #2D2D2D;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.menu-item:active {
    transform: translateY(2px);
}

/* Close Menu Button */
.close-menu-button {
    position: absolute;
    top: 30px;
    right: 30px;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    font-weight: 300;
    cursor: pointer;
    z-index: 1004;
    transition: all 0.3s ease;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-menu-button:hover {
    background-color: rgba(255,255,255,0.1);
    transform: rotate(90deg);
}

/* Loading and Error States */
.loading, .error {
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #2D2D2D;
}

.error {
    color: #c62828;
}

/* Responsive Design */
@media (max-width: 768px) {
    .main-weather-container {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }

    .city-name {
        font-size: 3rem;
    }

    /*.weather-details-grid {
        flex-direction: column;
    }*/

    .forecast-cards {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .city-name {
        font-size: 2.5rem;
    }

    .main-content {
        padding: 100px 15px 40px 15px;
    }
}
</style>