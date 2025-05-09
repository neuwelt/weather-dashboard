import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
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
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch weather data';
        console.error('Error fetching weather:', error);
      } finally {
        this.isLoading = false;
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
    }
  }
});