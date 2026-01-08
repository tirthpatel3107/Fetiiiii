# Austin Rides Map

An interactive map application that visualizes ride-sharing data from Fetii, powered by AI analysis and real-time location tracking.

## Features

- **Interactive Map Visualization**: View ride destinations and popular locations on an interactive map
- **AI-Powered Analysis**: Uses Google Gemini AI to analyze responses and extract location data
- **Real-time Data**: Displays Fetii trip data with visit counts and location details
- **Conversational Interface**: Chat-based interface for querying ride data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React** 18.2.0 - UI framework
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 4.2.1 - React bindings for Leaflet
- **Vite** 5.0.0 - Build tool and dev server
- **Google Generative AI** - AI analysis service
- **Stadia Maps** - Map tile provider

## Stadia Maps Specification

This project uses [Stadia Maps](https://stadiamaps.com/) as the map tile provider for rendering the interactive map.

### Tile Layer Configuration

**Tile Style**: `alidade_smooth_dark`

**Base URL**: 
```
https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
```

### API Key Setup

The application requires a Stadia Maps API key for accessing map tiles. The API key is loaded from environment variables.

**Environment Variable**: `VITE_STADIAMAPS_API_KEY`

**Usage**: 
- When an API key is provided, it's appended to the tile URL as a query parameter: `?api_key={API_KEY}`
- If no API key is provided, the base URL is used without authentication (may have usage limits)

### Map Configuration

The map configuration is defined in `src/utils/constants.js`:

```javascript
MAP_CONFIG = {
  DEFAULT_CENTER: [30.2672, -97.7431], // Austin, TX coordinates
  DEFAULT_ZOOM: 13,
  MAX_ZOOM: 19,
  MIN_ZOOM: 3,
  ANIMATION_DURATION: 800, // milliseconds
  POPUP_DELAY: 700, // milliseconds
}

TILE_CONFIG = {
  BASE_URL: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  ATTRIBUTION: "",
}
```

### Tile URL Parameters

- `{z}` - Zoom level (0-19)
- `{x}` - Tile X coordinate
- `{y}` - Tile Y coordinate
- `{r}` - Optional retina/high-DPI suffix (@2x)

### Stadia Maps Integration

The Stadia Maps integration is implemented in `src/components/new/LeafletMap.jsx`:

```javascript
// Get Stadia Maps API key from environment variable
const stadiaMapsApiKey = import.meta.env.VITE_STADIAMAPS_API_KEY || "";

// Build tile URL with API key if available
const tileUrl = stadiaMapsApiKey
  ? `${TILE_CONFIG.BASE_URL}?api_key=${stadiaMapsApiKey}`
  : TILE_CONFIG.BASE_URL;

// Use in TileLayer component
<TileLayer
  attribution={TILE_CONFIG.ATTRIBUTION}
  url={tileUrl}
  maxZoom={MAP_CONFIG.MAX_ZOOM}
  minZoom={MAP_CONFIG.MIN_ZOOM}
/>
```

### Map Features

- **Zoom Controls**: Custom zoom controls with min/max limits (3-19)
- **Interactive Markers**: Custom purple circular markers with numbered indicators
- **Popup Information**: Location details, visit counts, and addresses
- **Bounds Fitting**: Automatically adjusts map bounds to show all markers
- **Animation**: Smooth pan and zoom animations when selecting markers

## API Services

### Google Gemini AI

The application uses Google Gemini AI (`gemini-2.5-flash` model) to analyze ride-sharing responses and extract location data. The Gemini service is implemented in `src/services/geminiAnalysisService.js`.

**Functionality**:
- Analyzes text responses to identify locations and addresses
- Extracts numerical data (trip counts, visit counts, etc.)
- Uses function calling to geocode addresses
- Returns structured JSON with location data and coordinates

**Environment Variable**: `VITE_GEMINI_API_KEY`

**Usage**:
```javascript
import { analyzeResponseWithGemini } from "./services/geminiAnalysisService";

const analysis = await analyzeResponseWithGemini(responseText);
// Returns: { visualizationType, mapData: [...], reasoning }
```

### Google Maps Geocoding API

The application uses Google Maps Geocoding API to convert addresses to latitude/longitude coordinates. This is called by Gemini AI as a function during the analysis process.

**Functionality**:
- Converts addresses to geographic coordinates (lat/lng)
- Returns formatted addresses and location data
- Used automatically by Gemini AI when addresses are detected in responses

**Environment Variable**: `VITE_GEOCODING_API_KEY`

**API Endpoint**:
```
https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}
```

**Usage**:
The geocoding is automatically handled by the Gemini service when it detects addresses in the response text. The Gemini AI makes function calls to geocode addresses during analysis.

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Stadia Maps API key (optional but recommended)
- Google Gemini API key (required for AI analysis)
- Google Maps Geocoding API key (required for coordinate lookup)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Fetiiiiii
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_STADIAMAPS_API_KEY=your_stadia_maps_api_key_here
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_GEOCODING_API_KEY=your_google_geocoding_api_key_here
VITE_WEBHOOK_PATH=your_webhook_path_here
VITE_INSTANCE_ID=your_instance_id_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── new/              # Current implementation
│   │   ├── LeafletMap.jsx    # Map component with Stadia Maps integration
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   └── old/              # Legacy implementation
├── pages/
│   ├── new/
│   │   └── Dashboard.jsx
│   └── old/
├── services/
│   └── geminiAnalysisService.js
├── utils/
│   └── constants.js      # Map and tile configuration
├── hooks/
└── assets/
    └── styles/
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_STADIAMAPS_API_KEY` | Stadia Maps API key for map tiles | Optional (recommended) |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI analysis and location extraction | Yes |
| `VITE_GEOCODING_API_KEY` | Google Maps Geocoding API key for converting addresses to coordinates | Yes |
| `VITE_WEBHOOK_PATH` | Webhook URL for API calls | Yes |
| `VITE_INSTANCE_ID` | Instance ID for API authentication | Yes |

## Acknowledgments

- [Stadia Maps](https://stadiamaps.com/) - Map tile provider
- [Leaflet](https://leafletjs.com/) - Open-source JavaScript library for mobile-friendly interactive maps
- [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps

