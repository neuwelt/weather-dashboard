<template>
  <div
    id="app"
    :class="{ 'dark': isDark }"
    style="font-family: 'Comfortaa', sans-serif;"
  >
    <!-- Theme Toggle Button -->
    <ThemeToggle
      :is-dark="isDark"
      @toggle="toggleDark"
    />

    <!-- Splash Screens -->
    <SplashScreen
      v-if="showSplash"
      :current-color="currentColor"
    />

    <SearchSplash
      v-if="showSecondSplash"
      v-model:city="city"
      @search="handleSplashSearch"
      @show-login="showLoginPageFunc"
    />

    <!-- Login Page -->
    <LoginPage
      v-if="showLoginPageState"
      @login="handleLogin"
      @back="goBackToSplash"
    />

    <!-- Main Application -->
    <div
      v-if="showMain"
      class="app"
      :class="{ 'main-transition': transitioning }"
    >
      <!-- Fixed Header -->
      <AppHeader
        :is-menu-open="isMenuOpen"
        @toggle-menu="toggleMenu"
      />

      <!-- Full Screen Menu -->
      <FullScreenMenu
        :is-open="isMenuOpen"
        :active-menu="activeMenu"
        @close="closeMenu"
        @set-menu="setActiveMenu"
      />

      <transition name="slide-up">
        <main class="main-content">
          <div class="home">
            <!-- Search Section -->
            <SearchBar
              v-model:city="city"
              @search="searchWeather"
            />

            <!-- Loading/Error States -->
            <LoadingError
              :is-loading="isLoading"
              :error="error"
            />

            <!-- Main Weather Display -->
            <MainWeatherCard
              v-if="weather"
              :weather="weather"
            />

            <!-- Weather Details -->
            <WeatherDetails
              v-if="weather"
              :weather="weather"
            />

            <!-- 30-Day Forecast Section -->
            <ForecastSection
              v-if="forecast && forecast.daily"
            />

            <!-- Conditional Content Based on Active Menu -->
            <SavedLocations
              v-if="activeMenu === 'saved'"
              :locations="savedLocations"
              @load-location="loadSavedLocation"
              @delete-location="deleteLocation"
            />

            <ProfilePage
              v-if="activeMenu === 'profile'"
            />
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

// Import Components
import ThemeToggle from './components/ThemeToggle.vue'
import SplashScreen from './components/SplashScreen.vue'
import SearchSplash from './components/SearchSplash.vue'
import LoginPage from './components/LoginPage.vue'
import AppHeader from './components/AppHeader.vue'
import FullScreenMenu from './components/FullScreenMenu.vue'
import SearchBar from './components/SearchBar.vue'
import LoadingError from './components/LoadingError.vue'
import MainWeatherCard from './components/MainWeatherCard.vue'
import WeatherDetails from './components/WeatherDetails.vue'
import ForecastSection from './components/ForecastSection.vue'
import SavedLocations from './components/SavedLocations.vue'
import ProfilePage from './components/ProfilePage.vue'

import './assets/theme.css'
import './assets/main.css'

// Stores
const weatherStore = useWeatherStore()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleDark = themeStore.toggleDark

// Reactive state
const city = ref('')
const showSplash = ref(true)
const showSecondSplash = ref(false)
const showMain = ref(false)
const transitioning = ref(false)
const activeMenu = ref('news')
const currentColor = ref('#333')
const showLoginPageState = ref(false)
const isMenuOpen = ref(false)

// Color animation
const colors = ['#333', '#FF8C00', '#4A90E2', '#333']
let colorIndex = 0

// Computed properties
const weather = computed(() => weatherStore.currentWeather)
const forecast = computed(() => weatherStore.forecast)
const savedLocations = computed(() => weatherStore.savedLocations)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

// Lifecycle
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

// Methods
async function handleSplashSearch() {
    if (!city.value) return
    transitioning.value = true
    await searchWeather()
    setTimeout(() => {
        showSecondSplash.value = false
        showMain.value = true
        transitioning.value = false
    }, 800)
}

async function searchWeather() {
    if (!city.value) return
    await weatherStore.fetchWeather(city.value)
}

async function loadSavedLocation(location) {
    await weatherStore.fetchWeatherByCoords(location.latitude, location.longitude)
    activeMenu.value = 'news'
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

.app {
    background: linear-gradient(180deg, #FFFCF7 0%, #FFFCF7 30%, #F7D0D0 67%, #D0E8F2 100%);
    min-height: 100vh;
}

.main-content {
    padding: 100px 20px 40px 20px;
    max-width: 1400px;
    margin: 0 auto;
}

@media (max-width: 480px) {
    .main-content {
        padding: 100px 15px 40px 15px;
    }
}
</style>