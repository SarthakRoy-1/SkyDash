# WA-Dash — Weather Analytics Dashboard

This is a minimal but functional Weather Analytics Dashboard built with:
- React (Vite)
- Redux Toolkit
- Axios for HTTP requests
- Recharts for charts

Features included:
- Dashboard with city cards
- Search with autocomplete (WeatherAPI)
- City detail view with 7-day + hourly forecast
- Favorites persisted in localStorage
- Celsius/Fahrenheit toggle
- Caching layer (localStorage) with 60s TTL to limit API calls
- Simple responsive UI

IMPORTANT: You must provide your WeatherAPI key.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the project root with:
```
VITE_WEATHERAPI_KEY=your_weatherapi_key_here
```

Sign up at https://www.weatherapi.com/ to get a free key.

3. Run dev server:
```
npm run dev
```

4. Open `http://localhost:5173` (Vite dev server default).

## Notes & Design Choices

- Caching TTL is 60 seconds for "real-time" requirement.
- Favorite cities and unit preference are in `localStorage`.
- Autocomplete uses WeatherAPI `search.json?q=...`.
- Forecast uses `forecast.json?days=7&aqi=no&alerts=no`.
- For Google Sign-In, a placeholder comment is included; you can plug Firebase or Google Identity as needed.

If you want the project packaged differently or with authentication wired up, tell me and I'll extend it.

Enjoy — and don't forget to replace the API key!
