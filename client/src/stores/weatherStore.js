import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const useWeatherStore = defineStore('weather', {
  state: ( ) => ({
    currentWeather: null,
    forecast: null,
    airPollution: null,
    savedLocations: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchWeather(city) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/weather/${city}`);
        this.currentWeather = response.data;
        
        // After getting weather data, fetch air pollution and forecast using coordinates
        if (response.data && response.data.coord) {
          await this.fetchAirPollution(response.data.coord.lat, response.data.coord.lon);
          await this.fetchForecast(response.data.coord.lat, response.data.coord.lon);
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch weather data';
        console.error('Error fetching weather:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchAirPollution(lat, lon) {
      try {
        const response = await axios.get(`${API_URL}/air-pollution/${lat}/${lon}`);
        this.airPollution = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching air pollution:', error);
        // Don't set global error for this secondary request
      }
    },
    
    async fetchForecast(lat, lon) {
      try {
        const response = await axios.get(`${API_URL}/forecast/${lat}/${lon}`);
        this.forecast = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching forecast:', error);
        // Don't set global error for this secondary request
      }
    },
    
    async getSavedLocations() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/locations`);
        this.savedLocations = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch saved locations';
        console.error('Error fetching locations:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async saveLocation(location) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/locations`, location);
        await this.getSavedLocations();
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to save location';
        console.error('Error saving location:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteLocation(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/locations/${id}`);
        await this.getSavedLocations();
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete location';
        console.error('Error deleting location:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Helper function to get AQI description
    getAqiDescription(aqi) {
      const descriptions = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
      };
      return descriptions[aqi] || 'Unknown';
    },
    
    // Helper function to get AQI color
    getAqiColor(aqi) {
      const colors = {
        1: '#4caf50', // Green
        2: '#8bc34a', // Light Green
        3: '#ffc107', // Yellow
        4: '#ff9800', // Orange
        5: '#f44336'  // Red
      };
      return colors[aqi] || '#9e9e9e'; // Grey for unknown
    }
  }
});
