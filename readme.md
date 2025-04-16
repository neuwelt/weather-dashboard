# Weather Dashboard - Server

This is the backend for the Weather Dashboard application.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file with the following variables:

   ```
   WEATHER_API_KEY=your_openweathermap_api_key
   DB_CONNECTION_STRING=postgresql://username:password@localhost:5432/weather_app
   ```

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `GET /`: Test route
- `GET /api/weather/:city`: Get current weather for a city
- `GET /api/forecast/:city`: Get 5-day weather forecast for a city
- `GET /api/locations`: Get all saved locations
- `POST /api/locations`: Save a new location
- `DELETE /api/locations/:id`: Delete a saved location

## Database

The application uses PostgreSQL for persistence. Make sure to have PostgreSQL installed and running.

The `database.js` file handles:

- Connection to the database
- Creating the necessary tables
- Providing helper functions for CRUD operations
