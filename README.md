# 🌾 Farmverse AI - Your Intelligent Farming Companion

Farmverse AI is a complete, full-stack Smart Agriculture Platform that marries an immersive 3D countryside farm simulation with professional, data-driven agricultural utilities.

## 🚀 Key Features

1. **3D Interactive Farm World**: Built procedurally using native Three.js, rendering dynamic lighting transitions (Morning, Afternoon, Evening, Night) and real-time weather simulations (Rain, Snow, Fog, Thundershower with lightning overlays).
2. **AI Crop Predictor**: Inputs soil indicators (Nitrogen, Phosphorus, Potassium, pH, Moisture) and climate metadata (Temp, Humidity, Rainfall) to score compatibility across **100+ crops** and **28 soil varieties**.
3. **Fertilizer Action Plan**: Computes Urea, SSP, and MOP requirements to correct NPK deficits, and offers organic manure amendments (bone meal, neem cake, wood ash).
4. **Live Mandi Prices & GPS Proximity**: Renders commodity wholesale market rates, charts historical pricing trends (Chart.js), and applies the Haversine formula to compute physical distance to the nearest regional APMC mandis.
5. **Speech Voice Assistant**: Integrates Web Speech Recognition (Speech-to-Text) and Speech Synthesis (Text-to-Speech) in regional Indian languages (English, Hindi, Kannada, Tamil, Telugu, Marathi).
6. **Agro-Weather Forecasts & NDVI Satellite**: Simulated Sentinel-2 NDVI vegetative indices and comprehensive 7-day weather matrices.
7. **Document Exporters**: Built-in compilers for downloading high-fidelity PDF reports (`jspdf`) and raw CSV datasets.

---

## 📂 Project Architecture

```
farmverse-ai/
├── client/                 # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Farm3D.jsx         # Three.js 3D Procedural Farm Scene
│   │   │   ├── MandiCharts.jsx    # Chart.js Price Trend Visualizer
│   │   │   └── VoiceAssistant.jsx # Speech Recognition & Text-to-Speech Hook
│   │   ├── data/
│   │   │   └── translations.js    # Multi-language translation maps
│   │   ├── App.jsx                # Main Application Layout
│   │   ├── index.css              # Global Vanilla CSS Glassmorphic Styling
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                 # Node.js + Express Backend
│   ├── controllers/
│   │   ├── assistant.js           # Gemini AI Chat & regional language fallback
│   │   ├── mandi.js               # APMC markets pricing & GPS routing
│   │   ├── prediction.js          # Agronomic matching scoring engine
│   │   └── weather.js             # Weather parameters & regional climates
│   ├── data/
│   │   ├── crops.js               # 100+ Crops agronomic parameters
│   │   └── soils.js               # 28 Soils agricultural attributes
│   ├── .env                       # Environment credentials
│   ├── package.json
│   └── server.js
├── README.md
└── package.json            # Root workspace orchestrator
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)

### Setup & Run
1. **Clone/Navigate** to the repository folder:
   ```bash
   cd E:\farmverse-ai
   ```

2. **Install all packages** (Root orchestrator, Client, and Server packages):
   ```bash
   npm run install-all
   ```

3. **Configure API Keys (Optional)**:
   Rename/edit `server/.env` and add your credentials:
   - `GEMINI_API_KEY`: Hook up the Google Gemini generative model.
   - `WEATHER_API_KEY`: Retrieve live weather feeds from OpenWeatherMap.

4. **Launch Dev Server**:
   Start both client and server simultaneously using the root launcher:
   ```bash
   npm run dev
   ```
   - Frontend runs on: [http://localhost:5173](http://localhost:5173)
   - Backend runs on: [http://localhost:5000](http://localhost:5000)
