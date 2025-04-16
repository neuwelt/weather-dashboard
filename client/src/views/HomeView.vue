<template>
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
      
      <div v-if="isLoading" class="loading">
        Loading...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
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
            <div class="weather-description">
              {{ weather.weather[0].description }}
            </div>
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
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useWeatherStore } from '../stores/weatherStore';
  
  const weatherStore = useWeatherStore();
  const city = ref('');
  
  const weather = computed(() => weatherStore.currentWeather);
  const savedLocations = computed(() => weatherStore.savedLocations);
  const isLoading = computed(() => weatherStore.isLoading);
  const error = computed(() => weatherStore.error);
  
  onMounted(async () => {
    await weatherStore.getSavedLocations();
  });
  
  async function searchWeather() {
    if (!city.value) return;
    await weatherStore.fetchWeather(city.value);
  }
  
  async function saveLocation() {
    if (!weather.value) return;
    
    await weatherStore.saveLocation({
      city_name: weather.value.name,
      latitude: weather.value.coord.lat,
      longitude: weather.value.coord.lon
    });
  }
  
  async function loadSavedLocation(location) {
    city.value = location.city_name;
    await searchWeather();
  }
  
  async function deleteLocation(id) {
    await weatherStore.deleteLocation(id);
  }
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .search-container {
    display: flex;
    gap: 0.5rem;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .search-button, .save-button, .delete-button {
    padding: 0.75rem 1.5rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  
  .search-button:hover, .save-button:hover {
    background-color: #2980b9;
  }
  
  .delete-button {
    background-color: #e74c3c;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  
  .loading, .error {
    padding: 1rem;
    text-align: center;
    border-radius: 4px;
  }
  
  .loading {
    background-color: #f0f0f0;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
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
    background-color: #3498db;
    color: white;
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
    color: #777;
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
  
  .location-item:last-child {
    border-bottom: none;
  }
  
  .location-name {
    cursor: pointer;
    color: #3498db;
  }
  
  .location-name:hover {
    text-decoration: underline;
  }
  </style>