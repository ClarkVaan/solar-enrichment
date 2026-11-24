# Solar Lookup

Small React app. Type an address, pick it from the dropdown and it shows the
house on a satellite map along with roof / solar info from Google's Solar API.

## Setup

1. In Google Cloud, enable these APIs for your project:
   - Maps JavaScript API
   - Places API (New)
   - Solar API
2. Create an API key. Restrict it to your domain (HTTP referrers) since it
   ends up in the browser.
3. Copy `.env.example` to `.env` and paste the key in.

```
npm install
npm run dev
```

Open http://localhost:5173

## Notes

- The map uses `DEMO_MAP_ID` unless you set `VITE_GOOGLE_MAP_ID`. Fine for
  testing, make your own map ID for production.
- Solar data isn't available everywhere. The app asks for HIGH quality
  imagery first and falls back to MEDIUM then LOW.
- Numbers from the Solar API are estimates, not a quote.
