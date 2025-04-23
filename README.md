# Weather Dashboard - Server

This is the backend for the Weather Dashboard application.

## Dev Stack
1. Frontend
   - Node.js (v22)
   - Vue (v3.5)
   - AJAX - Fetch

2. Backend
   - Node.js
   - REST
   - Express

3. Database
   - pg.js
   - JSON
   - Postgres (v15)


## Dev Environment
- Repo: https://github.com/osama1994-dotcom/weather-dashboard
- UI Design: `Figma`
- REST Client: `Postman`
- External API in `Express`: https://stackoverflow.com/questions/39301227/external-api-calls-with-express-node-js-and-require-module
- `Docker` for Postres-dbs
- `nvm`: Manage NodeJS - v22
- `npm`: Package Manager - v11


## Docker Container
1. Create .env file in your root
   - copy and paste the information from the whatsapp group there.
2. Run docker composer from root
```
docker compose up
```
This will do the following:
- create postres, client & server images
- create and run postres, client & server containers
- start the server
- start the postres dbms
- Note: you have to start the front end manually by running
```
npm install
npm run serve
```
The following frontend & backend setups can be ingored.


 ## Setup Frontend - client
1. Install dependences
   ```
   npm install
   ```

2. Compiles and hot-reloads for development
   ```
   npm run serve
   ```

3. Compiles and minifies for production
   ```
   npm run build
   ```

4. Lints and fixes files
   ```
   npm run lint
   ```

5. Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## Setup Backend - server
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
