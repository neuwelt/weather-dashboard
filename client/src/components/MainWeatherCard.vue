<template>
  <div class="main-weather-container">
    <div class="weather-illustration-container">
      <img
        src="@/assets/icons/girl-with-fan.png"
        alt="Weather illustration"
        class="weather-illustration"
      >
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
</template>