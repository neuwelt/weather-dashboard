<template>
    <div id="app" :class="{ 'dark': isDark }" style="font-family: 'Comfortaa', sans-serif;">
        <!-- Theme Toggle Button -->
        <button @click="toggleDark()" class="theme-toggle">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
        </button>

        <!-- First Splash Screen -->
        <div v-if="showSplash" class="splash-screen" style="background-color: #F8F5EC; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh;">
            <div class="brand" style="text-align: center; margin-bottom: 50px;">
                <div style="font-size: 4rem; font-weight: bold; margin-bottom: 10px;">
                    <span style="color: #333;">Weather</span><span :style="{ color: currentColor }">Press</span>
                </div>
            </div>
            <div class="loading-bar"></div>
        </div>

        <!-- Second Splash Screen with Search -->
        <div v-if="showSecondSplash" class="splash-screen" style="background-color: #F8F5EC;">
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

        <div v-if="showMain" class="app" :class="{ 'main-transition': transitioning }" style="background-color: #FFFCF7;">
            <transition name="slide-up">
                <main>
                    <!-- Header with profile, web name, and menu -->
                    <div class="header">
                        <div class="profile-section">Profile</div>
                        <div class="web-name">WeatherPress</div>
                        <button class="menu-button">☰</button>
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

                        <!-- Main Weather Block - Updated Layout -->
                        <div v-else-if="weather" class="main-weather-block">
                            <img src="./assets/icons/girl-with-fan.png" alt="Weather illustration" class="weather-illustration" />
                            <div class="weather-info">
                                <h1 class="city-name">{{ weather.name }}</h1>
                                <div class="temperature">{{ Math.round(weather.main.temp) }}°C {{ weather.weather[0].main }}</div>
                                <div class="feels-like">Feels like: {{ Math.round(weather.main.feels_like) }}°C</div>
                            </div>
                        </div>

                        <!-- Air Pollution Card -->
                        <div v-if="airPollution" class="air-pollution">
                            <h3 class="air-pollution-title">Air Quality</h3>
                            <div class="air-quality-info">
                                <p>Air pollution: {{ getAqiDescription(airPollution.list[0].main.aqi) }}</p>
                                <p>Air quality is fine, but sensitive groups may feel some effects over time.</p>
                            </div>
                        </div>

                        <!-- Weather Details Section -->
                        <div class="weather-details">
                            <!-- 5-Day Forecast Slider -->
                            <div class="forecast-section">
                                <WeatherSlider v-if="forecast && forecast.daily" :forecast="forecast.daily.slice(0, 5)" />
                            </div>

                            <!-- Humidity, Wind, Pressure -->
                            <div class="humidity-wind-pressure">
                                <div class="detail-item">
                                    <span class="detail-label">Humidity:</span>
                                    <span>{{ weather?.main.humidity }}%</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Wind:</span>
                                    <span>{{ weather?.wind.speed }} km/h</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Pressure:</span>
                                    <span>{{ weather?.main.pressure }} mb</span>
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
import WeatherSlider from './components/WeatherSlider.vue'
import './assets/theme.css'
import './assets/main.css'

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
const currentColor = ref('#333')

const colors = ['#333', '#FF8C00', '#4A90E2', '#333']
let colorIndex = 0

const weather = computed(() => weatherStore.currentWeather)
const forecast = computed(() => weatherStore.forecast)
const airPollution = computed(() => weatherStore.airPollution)
const savedLocations = computed(() => weatherStore.savedLocations)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

// Helper functions for air pollution
const getAqiDescription = (aqi) => weatherStore.getAqiDescription(aqi)

onMounted(async () => {
    // Start color animation
    const colorInterval = setInterval(() => {
        colorIndex = (colorIndex + 1) % colors.length
        currentColor.value = colors[colorIndex]
    }, 500)

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

// eslint-disable-next-line no-unused-vars
function saveLocation() {
    if (!weather.value) return
    weatherStore.saveLocation({
        city_name: weather.value.name,
        country_code: weather.value.sys.country,
        latitude: weather.value.coord.lat,
        longitude: weather.value.coord.lon
    })
}

async function loadSavedLocation(location) {
    await weatherStore.fetchWeatherByCoords(location.latitude, location.longitude)
    activeMenu.value = 'news' // Switch back to main view
}

async function deleteLocation(id) {
    await weatherStore.deleteLocation(id)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
@import './assets/app-styles.css';

* {
    font-family: 'Comfortaa', sans-serif !important;
}
</style>