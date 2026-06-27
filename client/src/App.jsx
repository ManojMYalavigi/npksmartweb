import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Download, 
  MapPin, 
  Search, 
  Sparkles, 
  HelpCircle,
  Map as MapIcon
} from "lucide-react";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";

import Farm3D from "./components/Farm3D";
import VoiceAssistant from "./components/VoiceAssistant";
import MandiCharts from "./components/MandiCharts";
import { translations } from "./data/translations";
import { translateRegistry } from "./data/translationsCropsSoils";

import { cropsData } from "../../server/data/crops.js";
import { soilsData } from "../../server/data/soils.js";
import { queryAgriculturalKB } from "../../server/data/kbData.js";


const staticMandisList = [
  // Karnataka
  { id: "m3", name: "Yeshwanthpur APMC", city: "Bangalore", state: "Karnataka", lat: 13.0235, lon: 77.5589 },
  { id: "m4", name: "Hubli Cotton Mandi", city: "Hubli", state: "Karnataka", lat: 15.3647, lon: 75.1240 },
  { id: "m20", name: "Belagavi APMC Market", city: "Belagavi", state: "Karnataka", lat: 15.8497, lon: 74.4977 },
  { id: "m21", name: "Davanagere Grain Mandi", city: "Davanagere", state: "Karnataka", lat: 14.4644, lon: 75.9218 },
  { id: "m22", name: "Shimoga Arecanut APMC", city: "Shimoga", state: "Karnataka", lat: 13.9299, lon: 75.5681 },
  // Maharashtra
  { id: "m1", name: "Pune APMC Market", city: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { id: "m2", name: "Nagpur Grain Mandi", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882 },
  { id: "m23", name: "Nashik Onion APMC", city: "Nashik", state: "Maharashtra", lat: 19.9975, lon: 73.7898 },
  { id: "m24", name: "Vashi APMC (Mumbai)", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0748, lon: 73.0013 },
  { id: "m25", name: "Jalgaon Banana Market", city: "Jalgaon", state: "Maharashtra", lat: 21.0077, lon: 75.5626 },
  // Punjab
  { id: "m5", name: "Ludhiana Central Mandi", city: "Ludhiana", state: "Punjab", lat: 30.9010, lon: 75.8573 },
  { id: "m6", name: "Amritsar Wheat APMC", city: "Amritsar", state: "Punjab", lat: 31.6340, lon: 74.8723 },
  { id: "m26", name: "Jalandhar Potato APMC", city: "Jalandhar", state: "Punjab", lat: 31.3260, lon: 75.5762 },
  // Rajasthan
  { id: "m7", name: "Jaipur Grain Market", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { id: "m8", name: "Jodhpur Spice Mandi", city: "Jodhpur", state: "Rajasthan", lat: 26.2389, lon: 73.0243 },
  { id: "m27", name: "Sri Ganganagar Wheat APMC", city: "Sri Ganganagar", state: "Rajasthan", lat: 29.9142, lon: 73.8829 },
  // Uttar Pradesh
  { id: "m9", name: "Lucknow Vegetable APMC", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { id: "m10", name: "Kanpur Grain Mandi", city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319 },
  { id: "m28", name: "Hapur Grain Market", city: "Hapur", state: "Uttar Pradesh", lat: 28.7237, lon: 77.7816 },
  // Gujarat
  { id: "m29", name: "Unjha Cumin Mandi", city: "Unjha", state: "Gujarat", lat: 23.8055, lon: 72.3995 },
  { id: "m30", name: "Gondal APMC Market", city: "Gondal", state: "Gujarat", lat: 21.9619, lon: 70.7937 },
  { id: "m31", name: "Rajkot Cotton Mandi", city: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022 },
  // Tamil Nadu
  { id: "m11", name: "Coimbatore Coconut Market", city: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558 },
  { id: "m12", name: "Koyambedu Wholesale Market", city: "Chennai", state: "Tamil Nadu", lat: 13.0732, lon: 80.1932 },
  // Madhya Pradesh
  { id: "m32", name: "Indore APMC (Choithram)", city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577 },
  { id: "m33", name: "Bhopal Grain APMC", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
  // Andhra Pradesh & Telangana
  { id: "m34", name: "Guntur Chilli Yard", city: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lon: 80.4365 },
  { id: "m35", name: "Warangal Grain Market", city: "Warangal", state: "Telangana", lat: 17.9689, lon: 79.5941 },
  // West Bengal
  { id: "m36", name: "Kolkata Koley Market", city: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  // Kerala
  { id: "m37", name: "Kochi Spice Market", city: "Kochi", state: "Kerala", lat: 10.0150, lon: 76.2295 },
  { id: "m38", name: "Trivandrum APMC", city: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366 },
  // Bihar
  { id: "m39", name: "Patna Grain Market", city: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376 },
  { id: "m40", name: "Gaya APMC", city: "Gaya", state: "Bihar", lat: 24.7914, lon: 85.0002 },
  // Odisha
  { id: "m41", name: "Bhubaneswar Market", city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245 },
  { id: "m42", name: "Cuttack APMC", city: "Cuttack", state: "Odisha", lat: 20.4625, lon: 85.8828 },
  // Assam
  { id: "m43", name: "Guwahati APMC", city: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362 },
  // Jharkhand
  { id: "m44", name: "Ranchi Market", city: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096 }
];

  const getBackendUrl = () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host !== "localhost" && host !== "127.0.0.1" && !host.includes("10.105.95.25")) {
        // If hosted on a real domain (like Vercel), the API is on the same domain at /api
        return `/api`;
      }
    }
    // For local development
    return "http://localhost:5000/api";
  };
  const BACKEND_URL = getBackendUrl();
  
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio not supported");
    }
  };

export default function App() {
  // Page Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("English");
  const [newsItems, setNewsItems] = useState([]);

  // Global Click Sound
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest("button") || e.target.tagName.toLowerCase() === "button" || e.target.role === "button") {
        playClickSound();
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  // Fetch Live News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using a public RSS-to-JSON API to get live agriculture news (Hindu BusinessLine)
        const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.thehindubusinessline.com/economy/agri-business/feeder/default.rss");
        const data = await res.json();
        if (data && data.items) {
          setNewsItems(data.items.slice(0, 3));
        } else {
          throw new Error("Invalid format");
        }
      } catch (e) {
        console.warn("Failed to load live news, using fallback", e);
        setNewsItems([
          { title: "Govt Announces New MSP for Kharif Crops", categories: ["Govt Policy"], pubDate: new Date().toISOString() },
          { title: "Drone Subsidy Scheme Extended for 2026", categories: ["Subsidy"], pubDate: new Date(Date.now() - 86400000).toISOString() },
          { title: "Heavy Rains Predicted in Central India", categories: ["Alert"], pubDate: new Date(Date.now() - 172800000).toISOString() }
        ]);
      }
    };
    fetchNews();
  }, [language]);

  
  // Environment Configurations
  const [timeOfDay, setTimeOfDay] = useState("Afternoon");
  const [weather, setWeather] = useState("Sunny");
  
  // Geolocation Coordinate State - DEFAULT SET TO KITTUR, BELAGAVI, KARNATAKA
  const [gpsCoords, setGpsCoords] = useState({ lat: 15.6027, lon: 74.7894 }); 
  const [locationName, setLocationName] = useState("Kittur, Belagavi, Karnataka");
  const [resolvedState, setResolvedState] = useState("all");

  // Telemetry Inputs (Simplified to exactly N, P, K, pH, Moisture, Rainfall, Soil Type)
  const [nitrogen, setNitrogen] = useState(85);
  const [phosphorus, setPhosphorus] = useState(48);
  const [potassium, setPotassium] = useState(42);
  const [soilPH, setSoilPH] = useState(6.5);
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [rainfall, setRainfall] = useState(850);
  const [selectedSoilType, setSelectedSoilType] = useState("loamy");
  const [connectedSensorName, setConnectedSensorName] = useState(null);

  // Loaded Data States
  const [weatherData, setWeatherData] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [predictionsResult, setPredictionsResult] = useState(null);
  const [selectedPredictedCrop, setSelectedPredictedCrop] = useState(null);
  
  // Search Filters
  const [wikiSearch, setWikiSearch] = useState("");
  const [wikiCategory, setWikiCategory] = useState("All");
  const [mandiSearchQuery, setMandiSearchQuery] = useState("");
  
  const [selectedStateFilter, setSelectedStateFilter] = useState("all");
  const [selectedCityFilter, setSelectedCityFilter] = useState("");

  useEffect(() => {
    if (resolvedState) {
      setSelectedStateFilter(resolvedState);
    }
  }, [resolvedState]);

  // Auto-select first crop of state/city APMC on data load and sync filters
  useEffect(() => {
    if (mandiPrices.length > 0) {
      const initialState = selectedStateFilter || resolvedState || "Karnataka";
      const stateMandis = mandiPrices.filter(m => 
        initialState === "all" || m.state.toLowerCase() === initialState.toLowerCase()
      );
      const stateCities = Array.from(new Set(stateMandis.map(m => m.city))).sort();
      
      const userCity = locationName.split(",")[0].trim();
      const matchedCity = stateCities.find(c => c.toLowerCase() === userCity.toLowerCase());
      const defaultCity = selectedCityFilter || matchedCity || (stateCities.length > 0 ? stateCities[0] : "");
      
      if (!selectedCityFilter) {
        setSelectedCityFilter(defaultCity);
      }
      
      const defaultMandi = stateMandis.find(m => m.city === defaultCity) || stateMandis[0];
      if (defaultMandi && defaultMandi.prices && defaultMandi.prices.length > 0 && !selectedPredictedCrop) {
        setSelectedPredictedCrop({
          cropId: defaultMandi.prices[0].cropId,
          name: getCropName(defaultMandi.prices[0].cropId, defaultMandi.prices[0].cropName),
          msp: Math.round(defaultMandi.prices[0].modalPrice / 10),
          history: defaultMandi.prices[0].history
        });
      }
    }
  }, [mandiPrices, resolvedState]);

  // AI Chat Assistant States
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Hello! I am your Farmverse AI Companion. Ask me anything about soil health, crop selections, disease prevention, or fertilizer dosage." }
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [lastBotResponse, setLastBotResponse] = useState("");

  const t = translations[language] || translations.English;

  // Poll weather and mandi prices based on location parameters
  useEffect(() => {
    fetchWeather();
    fetchMandiPrices();
  }, [gpsCoords]);

  // Translate helper utilities
  const getCropName = (cropId, fallbackName) => {
    const langReg = translateRegistry[language];
    if (langReg && langReg.crops && langReg.crops[cropId]) {
      return langReg.crops[cropId];
    }
    return fallbackName;
  };

  const getCategoryName = (cat) => {
    const langReg = translateRegistry[language];
    if (langReg && langReg.categories && langReg.categories[cat]) {
      return langReg.categories[cat];
    }
    return cat;
  };

  const getSoilName = (soilId, fallbackName) => {
    const langReg = translateRegistry[language];
    if (langReg && langReg.soils && langReg.soils[soilId]) {
      return langReg.soils[soilId];
    }
    return fallbackName;
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/weather?lat=${gpsCoords.lat}&lon=${gpsCoords.lon}&state=${resolvedState}`
      );
      const resData = await response.json();
      if (resData.success) {
        setWeatherData(resData);
        if (resData.locationName) {
          setLocationName(resData.locationName);
        }
        if (resData.resolvedState) {
          setResolvedState(resData.resolvedState);
        }
        // Automatically sync weather systems in map to real weather condition
        const cond = resData.current.condition;
        if (cond === "Rainy" || cond === "Rain") setWeather("Rain");
        else if (cond === "Storm") setWeather("Storm");
        else if (cond === "Fog" || cond === "Cloudy") setWeather("Fog");
        else if (cond === "Winter") setWeather("Winter");
        else setWeather("Sunny");
      }
    } catch (err) {
      console.warn("Express backend offline. Running weather simulator client-side.");
      simulateClientWeather();
    }
  };

  const simulateClientWeather = () => {
    const mockTemp = 28.5;
    const mockHum = 62;
    const mockWind = 14.5;
    setWeatherData({
      success: true,
      locationName: locationName,
      resolvedState: resolvedState,
      current: {
        temp: mockTemp,
        humidity: mockHum,
        windSpeed: mockWind,
        windDirection: "WNW",
        pressure: 1010,
        uvIndex: 7,
        airQuality: 52,
        description: "Scattered clouds with tropical breeze",
        condition: "Sunny",
        sunrise: "05:45 AM",
        sunset: "06:48 PM"
      },
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: `${(i % 12 || 12)} ${i >= 12 ? 'PM' : 'AM'}`,
        temp: Math.round(mockTemp + Math.sin(i * 0.25) * 4),
        humidity: Math.round(mockHum - Math.sin(i * 0.25) * 8),
        pop: mockHum > 70 ? 40 : 10
      })),
      daily: ["Today", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((d, i) => ({
        day: d,
        tempMin: 22,
        tempMax: 32,
        condition: i === 2 ? "Light Rain" : "Sunny",
        humidity: 60,
        rainfall: i === 2 ? 8 : 0
      }))
    });
  };

  const fetchMandiPrices = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/mandi?lat=${gpsCoords.lat}&lon=${gpsCoords.lon}&state=all`
      );
      const resData = await response.json();
      if (resData.success) {
        setMandiPrices(resData.mandis);
        setMarketTrends(resData.trends);
        if (resData.locationName) {
          setLocationName(resData.locationName);
        }
      }
    } catch (err) {
      console.warn("Express backend offline. Running mandi price generator client-side.");
      simulateClientMandi();
    }
  };

  const simulateClientMandi = () => {
    const computedPrices = staticMandisList.map(m => {
      const prices = cropsData.map(c => {
        const baseMsp = c.msp;
        const variance = (Math.sin(m.lat + c.msp) * 0.08) + (Math.random() * 0.06 - 0.03);
        const modal = Math.round(baseMsp * (1 + variance));
        return {
          cropId: c.id,
          cropName: c.name,
          minPrice: Math.round(modal * 0.92),
          maxPrice: Math.round(modal * 1.08),
          modalPrice: modal,
          history: Array.from({ length: 6 }, (_, idx) => ({
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx],
            price: Math.round(c.msp * (1 + (idx * 0.02)))
          }))
        };
      });
      return {
        mandiId: m.id,
        mandiName: m.name,
        city: m.city,
        state: m.state,
        distance: 120, // default placeholder
        prices
      };
    });
    setMandiPrices(computedPrices);

    const trends = cropsData.slice(0, 10).map(c => ({
      cropId: c.id,
      cropName: c.name,
      category: c.category,
      msp: c.msp,
      demand: c.demand,
      exportTrend: "Stable",
      exportVolume: "1500 Tons/yr",
      priceTrend: { direction: "Up", percentage: 4.8 }
    }));
    setMarketTrends(trends);
  };

  // Run Crop prediction API
  const handleRunPrediction = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen, phosphorus, potassium,
          pH: soilPH,
          moisture: soilMoisture,
          rainfall,
          soilType: selectedSoilType
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setPredictionsResult(resData);
        if (resData.predictions.length > 0) {
          setSelectedPredictedCrop(resData.predictions[0]);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.warn("Express backend offline. Running mathematical prediction client-side.");
      simulateClientPrediction();
    }
  };

  const simulateClientPrediction = () => {
    const N = Number(nitrogen);
    const P = Number(phosphorus);
    const K = Number(potassium);
    const phVal = Number(soilPH);
    const rainVal = Number(rainfall);

    const scores = cropsData.map(crop => {
      let phScore = 1.0 - (phVal < crop.soilPH.min ? (crop.soilPH.min - phVal) * 0.4 : phVal > crop.soilPH.max ? (phVal - crop.soilPH.max) * 0.4 : 0);
      let rainScore = 1.0 - (rainVal < crop.rainfall.min ? (crop.rainfall.min - rainVal) * 0.002 : rainVal > crop.rainfall.max ? (rainVal - crop.rainfall.max) * 0.001 : 0);

      const nMatch = Math.max(0, 1 - Math.abs(N - crop.npk.N) / crop.npk.N);
      const pMatch = Math.max(0, 1 - Math.abs(P - crop.npk.P) / crop.npk.P);
      const kMatch = Math.max(0, 1 - Math.abs(K - crop.npk.K) / crop.npk.K);
      const npkScore = (nMatch + pMatch + kMatch) / 3;

      let score = (Math.max(0, phScore) * 0.4) + (Math.max(0, rainScore) * 0.3) + (npkScore * 0.3);
      const finalScore = Math.min(100, Math.round(score * 100));

      const expectedYield = Math.round((crop.yield * (0.8 + npkScore * 0.2)) * 100) / 100;
      const expectedProfit = Math.round((expectedYield * crop.msp * 10) - 20000);

      const nDeficit = Math.max(0, crop.npk.N - N);
      const pDeficit = Math.max(0, crop.npk.P - P);
      const kDeficit = Math.max(0, crop.npk.K - K);

      return {
        id: crop.id,
        name: crop.name,
        botanicalName: crop.botanicalName,
        category: crop.category,
        score: finalScore,
        expectedYield,
        expectedProfit,
        roi: expectedProfit > 0 ? Math.round((expectedProfit / 20000) * 100) : 0,
        harvestTime: crop.duration,
        waterRequirement: Math.round(crop.water.min * 10),
        diseaseRisk: "Low",
        predictedDisease: crop.diseases[0],
        recommendedPrevention: `Apply organic bio-fungicide and check soil NPK balance.`,
        fertilizerPlan: {
          urea: Math.round(nDeficit / 0.46),
          ssp: Math.round(pDeficit / 0.16),
          mop: Math.round(kDeficit / 0.6)
        },
        organicRecommendation: `Add farmyard compost and neem cake to replenish Nitrogen levels naturally.`,
        carbonFootprint: "Low (0.2 tons CO2e/ha)",
        msp: crop.msp,
        demand: crop.demand
      };
    }).sort((a, b) => b.score - a.score).slice(0, 10);

    setPredictionsResult({
      soil: soilsData.find(s => s.id === selectedSoilType) || soilsData[0],
      predictions: scores
    });
    if (scores.length > 0) {
      setSelectedPredictedCrop(scores[0]);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  // Browser Geolocation Grabber
  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setGpsCoords({ lat, lon });
        },
        () => alert("Unable to retrieve coordinates. Please check browser permission settings.")
      );
    } else {
      alert("GPS Geolocation is not supported by your browser.");
    }
  };

  // PDF Report Builder
  const handleExportPDF = () => {
    if (!predictionsResult) return;
    const doc = new jsPDF();
    
    doc.setFillColor(11, 28, 21);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FARMVERSE AI Prediction Report", 14, 25);
    
    doc.setFontSize(10);
    doc.text("Your Intelligent Farming Companion", 14, 32);

    doc.setTextColor(11, 28, 21);
    doc.setFontSize(14);
    doc.text("Soil Analysis & Crop Telemetry Results", 14, 52);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Location: ${locationName}`, 14, 60);
    doc.text(`Soil Type: ${getSoilName(predictionsResult.soil.id, predictionsResult.soil.name)}`, 14, 66);
    doc.text(`NPK Input Matrix: N: ${nitrogen} | P: ${phosphorus} | K: ${potassium} | pH: ${soilPH}`, 14, 72);

    doc.setFont("helvetica", "bold");
    doc.text("Top Recommended Match:", 14, 85);
    
    if (selectedPredictedCrop) {
      const c = selectedPredictedCrop;
      doc.setFont("helvetica", "normal");
      doc.text(`1. Crop Name: ${getCropName(c.id, c.name)} (${c.botanicalName})`, 14, 93);
      doc.text(`   - Compatibility Score: ${c.score}%`, 14, 99);
      doc.text(`   - Expected Yield: ${c.expectedYield} Tons`, 14, 105);
      doc.text(`   - Expected Net Profit: Rs. ${c.expectedProfit.toLocaleString()}`, 14, 111);
      doc.text(`   - Estimated Return on Investment (ROI): ${c.roi}%`, 14, 117);
      doc.text(`   - Water Required: ${c.waterRequirement} Cubic Meters`, 14, 123);
      
      doc.setFont("helvetica", "bold");
      doc.text("Nutrient Adjustment Correction Plan:", 14, 135);
      doc.setFont("helvetica", "normal");
      doc.text(`   - Urea Fertilizer needed: ${c.fertilizerPlan.urea} kg`, 14, 143);
      doc.text(`   - Single Super Phosphate (SSP) needed: ${c.fertilizerPlan.ssp} kg`, 14, 149);
      doc.text(`   - Muriate of Potash (MOP) needed: ${c.fertilizerPlan.mop} kg`, 14, 155);

      doc.setFont("helvetica", "bold");
      doc.text("Pest & Disease Advisory:", 14, 168);
      doc.setFont("helvetica", "normal");
      doc.text(`   - Risk Level: ${c.diseaseRisk} (${c.predictedDisease})`, 14, 176);
      doc.text(`   - Prevention: ${c.recommendedPrevention}`, 14, 182, { maxWidth: 180 });
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Generated by Farmverse AI Platform. Supported under India Digital Agriculture Initiative.", 14, 280);

    doc.save("FarmverseAI_SoilReport.pdf");
    confetti({ particleCount: 60, colors: ["#fbbf24", "#10b981"] });
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (!predictionsResult) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rank,Crop Name,Botanical Name,Score,Expected Yield (Tons),Expected Profit (INR),ROI (%),Water (m3),Carbon Footprint\n";
    
    predictionsResult.predictions.forEach((c, idx) => {
      csvContent += `${idx + 1},${getCropName(c.id, c.name)},${c.botanicalName},${c.score},${c.expectedYield},${c.expectedProfit},${c.roi},${c.waterRequirement},${c.carbonFootprint}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "FarmverseAI_Predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Chat Messenger Handler
  const handleSendChatMessage = async (textToSend) => {
    const input = textToSend || chatInput;
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoadingChat(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          language,
          history: chatHistory.slice(-6)
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setChatHistory(prev => [...prev, { role: "assistant", text: resData.text }]);
        setLastBotResponse(resData.text);
      }
    } catch (err) {
      console.warn("Express backend offline. Running rules assistant client-side.");
      simulateClientChat(input);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const simulateClientChat = (msg) => {
    const reply = queryAgriculturalKB(msg, language);
    setChatHistory(prev => [...prev, { role: "assistant", text: reply }]);
    setLastBotResponse(reply);
    setIsLoadingChat(false);
  };

  // Sync parameter inputs when clicking on interactive 3D farm plots
  const handleMapFieldSelect = (fieldInfo) => {
    setConnectedSensorName(fieldInfo.name);
    // Auto populate telemetry inputs from coordinates properties
    if (fieldInfo.id === "f1") { // Wheat
      setNitrogen(110); setPhosphorus(55); setPotassium(38); setSoilPH(6.2); setSoilMoisture(40); setRainfall(650); setSelectedSoilType("loamy");
    } else if (fieldInfo.id === "f2") { // Corn
      setNitrogen(135); setPhosphorus(70); setPotassium(55); setSoilPH(7.5); setSoilMoisture(65); setRainfall(800); setSelectedSoilType("black_cotton");
    } else if (fieldInfo.id === "f3") { // Rice
      setNitrogen(120); setPhosphorus(60); setPotassium(40); setSoilPH(5.8); setSoilMoisture(85); setRainfall(1500); setSelectedSoilType("clay");
    } else if (fieldInfo.id === "f4") { // Vegetable
      setNitrogen(95); setPhosphorus(58); setPotassium(78); setSoilPH(6.8); setSoilMoisture(50); setRainfall(900); setSelectedSoilType("alluvial");
    } else if (fieldInfo.id === "f5") { // Mango
      setNitrogen(80); setPhosphorus(35); setPotassium(75); setSoilPH(5.5); setSoilMoisture(45); setRainfall(1000); setSelectedSoilType("laterite");
    } else if (fieldInfo.id === "f6") { // Sugarcane
      setNitrogen(240); setPhosphorus(75); setPotassium(110); setSoilPH(6.6); setSoilMoisture(75); setRainfall(1800); setSelectedSoilType("river_basin");
    }
    confetti({ particleCount: 30, colors: ["#10b981"] });
  };

  // Filtered Wiki List
  const filteredWikiCrops = cropsData.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(wikiSearch.toLowerCase()) || 
                          c.category.toLowerCase().includes(wikiSearch.toLowerCase());
    const matchesCat = wikiCategory === "All" || c.category === wikiCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 3D Farm Fullscreen Fixed Background Backdrop */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          pointerEvents: "none"
        }}
      >
        <Farm3D 
          timeOfDay={timeOfDay} 
          weather={weather}
        />
      </div>

      {/* 1. Header Bar */}
      <header className="glass-panel app-header">
        <div style={styles.headerBrand} onClick={() => setActiveTab("dashboard")}>
          <div style={styles.logoCircle}>
            <Sprout size={24} color="#fbbf24" className="animate-float" />
          </div>
          <div>
            <h1 className="text-gradient-emerald" style={styles.brandTitle}>{t.brand}</h1>
            <p style={styles.brandSubtitle}>{t.tagline}</p>
          </div>
        </div>

        {/* Global Environment & Controls Toolbar */}
        <div style={styles.controlsBar}>
          <div style={styles.controlItem}>
            <label style={styles.controlLabel}>{t.timeLabel}</label>
            <select 
              value={timeOfDay} 
              onChange={(e) => setTimeOfDay(e.target.value)}
              style={styles.selectInput}
            >
              <option value="Morning">🌅 Morning</option>
              <option value="Afternoon">☀️ Afternoon</option>
              <option value="Evening">🌇 Evening</option>
              <option value="Night">🌑 Night</option>
            </select>
          </div>

          <div style={styles.controlItem}>
            <label style={styles.controlLabel}>{t.weatherLabel}</label>
            <select 
              value={weather} 
              onChange={(e) => setWeather(e.target.value)}
              style={styles.selectInput}
            >
              <option value="Sunny">☀️ Sunny</option>
              <option value="Rain">🌧️ Rain</option>
              <option value="Storm">⚡ Storm</option>
              <option value="Fog">🌫️ Fog</option>
              <option value="Winter">❄️ Winter</option>
            </select>
          </div>

          <div style={styles.controlItem}>
            <label style={styles.controlLabel}>{t.langLabel}</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.selectInput}
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Marathi">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </header>

      {/* 2. Navigation Tabs */}
      <nav className="app-nav-bar">
        <div 
          onClick={() => setActiveTab("dashboard")}
          className={`app-nav-link ${activeTab === "dashboard" ? "app-nav-link-active" : ""}`}
        >
          <LayoutDashboard size={18} />
          <span>{t.navDashboard}</span>
        </div>
        <div 
          onClick={() => setActiveTab("predictor")}
          className={`app-nav-link ${activeTab === "predictor" ? "app-nav-link-active" : ""}`}
        >
          <Sparkles size={18} />
          <span>{t.navPredictor}</span>
        </div>
        <div 
          onClick={() => setActiveTab("market")}
          className={`app-nav-link ${activeTab === "market" ? "app-nav-link-active" : ""}`}
        >
          <TrendingUp size={18} />
          <span>{t.navMarket}</span>
        </div>
        <div 
          onClick={() => setActiveTab("wiki")}
          className={`app-nav-link ${activeTab === "wiki" ? "app-nav-link-active" : ""}`}
        >
          <BookOpen size={18} />
          <span>{t.navWiki}</span>
        </div>
        <div 
          onClick={() => setActiveTab("chatbot")}
          className={`app-nav-link ${activeTab === "chatbot" ? "app-nav-link-active" : ""}`}
        >
          <MessageSquare size={18} />
          <span>{t.navChatbot}</span>
        </div>
      </nav>

      {/* Main content body pages */}
      <main className="app-main">
        
        {/* PAGE 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dashboard-grid">
              {/* Live Weather Widget */}
              <div className="glass-panel" style={styles.card}>
                <h3 style={styles.cardHeader}>{t.secWeatherWidget}</h3>
                {weatherData ? (
                  <div style={styles.weatherBody}>
                    <div style={styles.weatherMain}>
                      <div>
                        <div style={{ fontSize: "36px", fontWeight: "800", color: "#fbbf24" }}>
                          {weatherData.current.temp}°C
                        </div>
                        <div style={{ color: "#94a3b8" }}>{weatherData.current.description}</div>
                      </div>
                      {/* Location Badge */}
                      <div style={styles.gpsBadge}>
                        <MapPin size={14} style={{ marginRight: "4px" }} />
                        <span>{locationName}</span>
                      </div>
                    </div>
                    <div style={styles.weatherGrid}>
                      <div>💧 <strong>Humidity:</strong> {weatherData.current.humidity}%</div>
                      <div>💨 <strong>Wind:</strong> {weatherData.current.windSpeed} km/h</div>
                      <div>☀️ <strong>UV Index:</strong> {weatherData.current.uvIndex}</div>
                      <div>🏭 <strong>AQI:</strong> {weatherData.current.airQuality}</div>
                      <div>🌅 <strong>Sunrise:</strong> {weatherData.current.sunrise}</div>
                      <div>🌇 <strong>Sunset:</strong> {weatherData.current.sunset}</div>
                    </div>
                    {/* Weather forecast row */}
                    <div style={styles.forecastRow}>
                      {weatherData.daily.slice(0, 5).map((d, i) => (
                        <div key={i} style={styles.forecastDay}>
                          <div>{d.day}</div>
                          <div style={{ fontSize: "14px", color: "#fbbf24" }}>{d.tempMax}°</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8" }}>{d.condition}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ padding: "16px" }}>Loading local environmental telemetry...</p>
                )}
              </div>

              {/* News alerts */}
              <div className="glass-panel" style={styles.card}>
                <h3 style={styles.cardHeader}>{t.secNews}</h3>
                <div style={styles.newsBody}>
                  {newsItems && newsItems.length > 0 ? (
                    newsItems.map((item, index) => {
                      const badgeStyle = index % 3 === 0 ? styles.newsBadge : (index % 3 === 1 ? styles.newsBadgeGreen : styles.newsBadgeAlert);
                      const category = (item.categories && item.categories.length > 0) ? item.categories[0] : (index % 3 === 0 ? "Govt Policy" : (index % 3 === 1 ? "Subsidy" : "Alert"));
                      const dateText = item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "";
                      return (
                        <div style={styles.newsItem} key={index}>
                          <span style={badgeStyle}>{category}</span>
                          <strong>{item.title}</strong>
                          <p style={{ fontSize: "11px", color: "#94a3b8" }}>{dateText}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div style={styles.newsItem}>
                      <strong>Loading news...</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: AI CROP PREDICTOR */}
        {activeTab === "predictor" && (
          <div className="predictor-grid">
            
            {/* Input Telemetry Form */}
            <div className="glass-panel" style={{ ...styles.card, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>Soil Sensors</h3>
                <button 
                  onClick={handleAutoGPS}
                  style={styles.gpsBtn}
                  title="Auto locate coords"
                >
                  <MapPin size={16} /> GPS
                </button>
              </div>

              {/* Interactive click sensor binding */}
              {connectedSensorName && (
                <div style={styles.sensorAlert}>
                  📡 Synced with 3D Field Sensor: <strong>{connectedSensorName}</strong>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formN} ({nitrogen})</label>
                <input 
                  type="range" min="0" max="250" 
                  value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formP} ({phosphorus})</label>
                <input 
                  type="range" min="0" max="150" 
                  value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formK} ({potassium})</label>
                <input 
                  type="range" min="0" max="200" 
                  value={potassium} onChange={(e) => setPotassium(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formPH} ({soilPH})</label>
                <input 
                  type="range" min="3.5" max="9.5" step="0.1"
                  value={soilPH} onChange={(e) => setSoilPH(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formMoisture} ({soilMoisture}%)</label>
                <input 
                  type="range" min="0" max="100" 
                  value={soilMoisture} onChange={(e) => setSoilMoisture(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formRain} ({rainfall} mm)</label>
                <input 
                  type="range" min="200" max="2500" step="50"
                  value={rainfall} onChange={(e) => setRainfall(e.target.value)} 
                  style={styles.rangeInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t.formSoil}</label>
                <select 
                  value={selectedSoilType} 
                  onChange={(e) => setSelectedSoilType(e.target.value)}
                  style={styles.selectInputFull}
                >
                  {soilsData.map(s => (
                    <option key={s.id} value={s.id}>{getSoilName(s.id, s.name)}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleRunPrediction} 
                className="btn-3d" 
                style={{ width: "100%", marginTop: "10px" }}
              >
                {t.btnPredict}
              </button>
            </div>

            {/* Prediction Outputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {predictionsResult ? (
                <>
                  <div className="glass-panel" style={{ ...styles.card, padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0 }}>📊 Match Compatibility Standings</h3>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleExportPDF} className="btn-3d-secondary" style={{ padding: "8px 16px", fontSize: "12px" }}>
                          <Download size={14} style={{ marginRight: "6px" }} /> PDF
                        </button>
                        <button onClick={handleExportCSV} className="btn-3d-secondary" style={{ padding: "8px 16px", fontSize: "12px" }}>
                          <Download size={14} style={{ marginRight: "6px" }} /> CSV
                        </button>
                      </div>
                    </div>

                    <div className="table-container">
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th>{t.colRank}</th>
                            <th>{t.colCrop}</th>
                            <th>{t.colScore}</th>
                            <th>{t.colYield}</th>
                            <th>{t.colProfit}</th>
                            <th>{t.colWater}</th>
                            <th>{t.colRisk}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {predictionsResult.predictions.map((p, idx) => (
                            <tr 
                              key={p.id} 
                              onClick={() => setSelectedPredictedCrop(p)}
                              style={{
                                ...styles.tableRow,
                                backgroundColor: selectedPredictedCrop?.id === p.id ? "rgba(16, 185, 129, 0.15)" : "transparent",
                                borderColor: selectedPredictedCrop?.id === p.id ? "var(--emerald-green)" : "rgba(255,255,255,0.05)"
                              }}
                            >
                              <td>#{idx + 1}</td>
                              <td>
                                <strong>{getCropName(p.id, p.name)}</strong>
                                <div style={{ fontSize: "10px", color: "#94a3b8" }}>{p.botanicalName}</div>
                              </td>
                              <td>
                                <span style={{ 
                                  color: p.score > 80 ? "var(--emerald-green)" : p.score > 60 ? "var(--golden-yellow)" : "#f87171",
                                  fontWeight: "bold" 
                                }}>
                                  {p.score}%
                                </span>
                              </td>
                              <td>{p.expectedYield} Tons</td>
                              <td>Rs. {p.expectedProfit.toLocaleString()}</td>
                              <td>{p.waterRequirement} m³</td>
                              <td>
                                <span style={{
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                  backgroundColor: p.diseaseRisk === "High" ? "rgba(239,35,60,0.2)" : "rgba(16,185,129,0.2)",
                                  color: p.diseaseRisk === "High" ? "#f87171" : "var(--emerald-green)"
                                }}>
                                  {p.diseaseRisk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Highlight Detail Cards */}
                  {selectedPredictedCrop && (
                    <div style={styles.predictionDetailsGrid}>
                      {/* Fertilizer Plan */}
                      <div className="glass-panel" style={{ ...styles.card, padding: "16px" }}>
                        <h4 style={{ color: "var(--emerald-green)", marginBottom: "10px" }}>🧪 {t.cardFertilizer}</h4>
                        <div style={styles.metricRow}>
                          <div>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>{selectedPredictedCrop.fertilizerPlan.urea} kg</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Urea (Nitrogen 46%)</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>{selectedPredictedCrop.fertilizerPlan.ssp} kg</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>SSP (Phosphorus 16%)</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>{selectedPredictedCrop.fertilizerPlan.mop} kg</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>MOP (Potash 60%)</div>
                          </div>
                        </div>
                      </div>

                      {/* Organic recommendations */}
                      <div className="glass-panel" style={{ ...styles.card, padding: "16px" }}>
                        <h4 style={{ color: "var(--golden-yellow)", marginBottom: "10px" }}>🌱 {t.cardOrganic}</h4>
                        <p style={{ fontSize: "13px" }}>{selectedPredictedCrop.organicRecommendation}</p>
                      </div>

                      {/* Financial statistics */}
                      <div className="glass-panel" style={{ ...styles.card, padding: "16px" }}>
                        <h4 style={{ color: "var(--harvest-orange)", marginBottom: "10px" }}>💰 {t.cardEconomics}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                          <div><strong>MSP Rate:</strong> Rs. {selectedPredictedCrop.msp}/quintal</div>
                          <div><strong>ROI Index:</strong> +{selectedPredictedCrop.roi}%</div>
                          <div><strong>Category Demand:</strong> {selectedPredictedCrop.demand}</div>
                        </div>
                      </div>

                      {/* Carbon score */}
                      <div className="glass-panel" style={{ ...styles.card, padding: "16px" }}>
                        <h4 style={{ color: "#38bdf8", marginBottom: "10px" }}>🌍 {t.cardCarbon}</h4>
                        <p style={{ fontSize: "13px" }}>{selectedPredictedCrop.carbonFootprint}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="glass-panel" style={{ ...styles.card, padding: "40px", textAlign: "center" }}>
                  <HelpCircle size={48} color="#94a3b8" style={{ marginBottom: "16px" }} />
                  <h3>Run AI prediction scanner</h3>
                  <p style={{ color: "#94a3b8", maxWidth: "400px", margin: "8px auto" }}>
                    Configure the soil test indicators and land parameters on the left to compute compatibility scores for all 100+ crops.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAGE 3: MANDI MARKET PRICES */}
        {activeTab === "market" && (
          <div className="market-grid">
            
            {/* Price Explorer */}
            <div className="glass-panel" style={{ ...styles.card, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: 0 }}>📍 Mandi Price Dashboard</h3>
                  <div style={{ fontSize: "11px", color: "var(--emerald-green)", marginTop: "4px" }}>
                    Showing pricing database for: <strong>{selectedCityFilter ? `${selectedCityFilter}, ${selectedStateFilter}` : selectedStateFilter}</strong>
                  </div>
                </div>
                <div style={styles.searchContainer}>
                  <Search size={16} color="#94a3b8" />
                  <input 
                    type="text" 
                    placeholder="Search crop commodity..." 
                    value={mandiSearchQuery}
                    onChange={(e) => setMandiSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              {/* State & City Selection Dropdown Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", borderBottom: "1px dashed rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  
                  {/* Filter State */}
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Select State</label>
                    <select
                      value={selectedStateFilter}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedStateFilter(newState);
                        
                        // Dynamically resolve cities for this state
                        const stateMandis = mandiPrices.filter(m => 
                          newState === "all" || m.state.toLowerCase() === newState.toLowerCase()
                        );
                        const stateCities = Array.from(new Set(stateMandis.map(m => m.city))).sort();
                        const defaultCity = stateCities.length > 0 ? stateCities[0] : "";
                        setSelectedCityFilter(defaultCity);

                        // Select first crop of the target mandi in chart
                        const defaultMandi = stateMandis.find(m => m.city === defaultCity) || stateMandis[0];
                        if (defaultMandi && defaultMandi.prices && defaultMandi.prices.length > 0) {
                          setSelectedPredictedCrop({
                            cropId: defaultMandi.prices[0].cropId,
                            name: getCropName(defaultMandi.prices[0].cropId, defaultMandi.prices[0].cropName),
                            msp: Math.round(defaultMandi.prices[0].modalPrice / 10),
                            history: defaultMandi.prices[0].history
                          });
                        }
                      }}
                      style={styles.selectInputFull}
                    >
                      <option value="all">🇮🇳 All India</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Assam">Assam</option>
                      <option value="Jharkhand">Jharkhand</option>
                    </select>
                  </div>

                  {/* Select City */}
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Select City</label>
                    <select
                      value={selectedCityFilter}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setSelectedCityFilter(newCity);
                        
                        const stateMandis = mandiPrices.filter(m => 
                          selectedStateFilter === "all" || m.state.toLowerCase() === selectedStateFilter.toLowerCase()
                        );
                        const selectedM = stateMandis.find(m => m.city === newCity);
                        if (selectedM && selectedM.prices.length > 0) {
                          setSelectedPredictedCrop({
                            cropId: selectedM.prices[0].cropId,
                            name: getCropName(selectedM.prices[0].cropId, selectedM.prices[0].cropName),
                            msp: Math.round(selectedM.prices[0].modalPrice / 10),
                            history: selectedM.prices[0].history
                          });
                        }
                      }}
                      style={styles.selectInputFull}
                    >
                      {(() => {
                        const stateMandis = mandiPrices.filter(m => 
                          selectedStateFilter === "all" || m.state.toLowerCase() === selectedStateFilter.toLowerCase()
                        );
                        const stateCities = Array.from(new Set(stateMandis.map(m => m.city))).sort();
                        return stateCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ));
                      })()}
                    </select>
                  </div>

                </div>
              </div>

              {mandiPrices.length > 0 ? (
                (() => {
                  const filteredStateMandis = mandiPrices.filter(m => 
                    selectedStateFilter === "all" || m.state.toLowerCase() === selectedStateFilter.toLowerCase()
                  );
                  
                  const targetMandi = filteredStateMandis.find(m => m.city === selectedCityFilter) || filteredStateMandis[0];

                  if (!targetMandi) {
                    return <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>No markets match your filter criteria.</p>;
                  }

                  const filteredCrops = targetMandi.prices.filter(p => 
                    getCropName(p.cropId, p.cropName).toLowerCase().includes(mandiSearchQuery.toLowerCase())
                  );

                  return (
                    <div key={targetMandi.mandiId} className="glass-panel" style={{ ...styles.mandiBox, borderColor: "var(--emerald-green)", borderWidth: "1px", background: "rgba(16, 185, 129, 0.03)", padding: "20px" }}>
                      <div style={styles.mandiHeader}>
                        <div>
                          <span style={{ fontSize: "10px", color: "var(--emerald-green)", fontWeight: "bold", display: "block", textTransform: "uppercase", marginBottom: "2px" }}>Active Mandi APMC</span>
                          <strong style={{ fontSize: "18px" }}>{targetMandi.mandiName}</strong>
                          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{targetMandi.city}, {targetMandi.state}</div>
                        </div>
                        <span style={styles.mandiDist}>APMC Market Yard</span>
                      </div>

                      <div style={styles.pricesGrid}>
                        {filteredCrops.map((price) => (
                          <div 
                            key={price.cropId} 
                            style={{
                              ...styles.priceRow,
                              backgroundColor: selectedPredictedCrop?.cropId === price.cropId ? "rgba(16, 185, 129, 0.15)" : "transparent"
                            }}
                            onClick={() => setSelectedPredictedCrop({
                              cropId: price.cropId,
                              name: getCropName(price.cropId, price.cropName),
                              msp: Math.round(price.modalPrice / 10),
                              history: price.history
                            })}
                          >
                            <span style={{ fontSize: "14px", fontWeight: "500" }}>{getCropName(price.cropId, price.cropName)}</span>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontWeight: "bold", color: "var(--golden-yellow)", fontSize: "15px" }}>Rs. {price.modalPrice}</div>
                              <div style={{ fontSize: "10px", color: "#94a3b8" }}>{price.minPrice} - {price.maxPrice} / quintal</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p>Retrieving mandi rates...</p>
              )}
            </div>

            {/* Trends and Charts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {selectedPredictedCrop && selectedPredictedCrop.history ? (
                <div className="glass-panel" style={{ ...styles.card, padding: "20px" }}>
                  <h3>📈 Price Trends: {selectedPredictedCrop.name}</h3>
                  <div style={{ marginTop: "16px" }}>
                    <MandiCharts historyData={selectedPredictedCrop.history} cropName={selectedPredictedCrop.name} />
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={{ ...styles.card, padding: "20px", textAlign: "center" }}>
                  <TrendingUp size={36} color="#94a3b8" style={{ marginBottom: "10px" }} />
                  <h4>Select a commodity price row to load historical charts.</h4>
                </div>
              )}

              {/* Global Trends Analytics */}
              <div className="glass-panel" style={{ ...styles.card, padding: "20px" }}>
                <h3>🌍 {t.mandiTrends}</h3>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {marketTrends.slice(0, 5).map(trend => (
                    <div key={trend.cropId} style={styles.trendRow}>
                      <div>
                        <strong>{getCropName(trend.cropId, trend.cropName)}</strong>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Export Vol: {trend.exportVolume}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: trend.priceTrend.direction === "Up" ? "var(--emerald-green)" : "#ef233c" }}>
                          {trend.priceTrend.direction === "Up" ? "▲" : "▼"} {trend.priceTrend.percentage}%
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Demand: {trend.demand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: FULL MAP */}
        {activeTab === "map3d" && (
          <div style={{ padding: "0 24px", textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>
              Interact directly by rotating coordinates using your cursor movements. Click on any field plot to test sensor inputs.
            </p>
          </div>
        )}

        {/* PAGE 5: WIKI LIBRARY */}
        {activeTab === "wiki" && (
          <div style={{ padding: "0 24px" }}>
            <div style={styles.wikiHeader}>
              <div style={styles.searchContainerLarge}>
                <Search size={18} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search 100+ crops or 25+ soil types (e.g. Rice, Alluvial, Spices)..." 
                  value={wikiSearch}
                  onChange={(e) => setWikiSearch(e.target.value)}
                  style={styles.searchInputLarge}
                />
              </div>

              <div style={styles.filterRow}>
                {["All", "Cereal", "Pulse", "Vegetable", "Fruit", "Spices", "Oilseed", "Plantation", "Millets"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setWikiCategory(cat)}
                    style={{
                      ...styles.filterTab,
                      backgroundColor: wikiCategory === cat ? "var(--leaf-green)" : "rgba(255,255,255,0.05)",
                      borderColor: wikiCategory === cat ? "var(--emerald-green)" : "rgba(255,255,255,0.1)"
                    }}
                  >
                    {getCategoryName(cat)}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.wikiGrid}>
              {filteredWikiCrops.map(crop => (
                <div key={crop.id} className="glass-panel" style={{ ...styles.card, padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ color: "var(--golden-yellow)", fontSize: "16px" }}>{getCropName(crop.id, crop.name)}</h4>
                      <em style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>{crop.botanicalName}</em>
                    </div>
                    <span style={styles.categoryBadge}>{getCategoryName(crop.category)}</span>
                  </div>

                  <div style={styles.wikiDetails}>
                    <div>🌡️ <strong>Temp:</strong> {crop.temp.min}°C - {crop.temp.max}°C</div>
                    <div>🌧️ <strong>Rainfall:</strong> {crop.rainfall.min} - {crop.rainfall.max} mm</div>
                    <div>🧪 <strong>pH Range:</strong> {crop.soilPH.min} - {crop.soilPH.max}</div>
                    <div>📉 <strong>NPK Ratio:</strong> {crop.npk.N}:{crop.npk.P}:{crop.npk.K}</div>
                    <div>🌾 <strong>Yield:</strong> {crop.yield} tons/ha</div>
                    <div>💰 <strong>MSP support:</strong> Rs. {crop.msp}/q</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 6: AI CHATBOT & VOICE ASSISTANT */}
        {activeTab === "chatbot" && (
          <div style={{ padding: "0 24px", maxWidth: "800px", margin: "0 auto" }}>
            <div className="glass-panel" style={styles.chatContainer}>
              <div style={styles.chatHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={20} color="var(--emerald-green)" />
                  <div>
                    <strong style={{ fontSize: "16px" }}>Farmverse AI Specialist</strong>
                    <div style={{ fontSize: "10px", color: "var(--emerald-green)" }}>Online - Powered by Gemini Model</div>
                  </div>
                </div>

                {/* Voice assistant toggler */}
                <VoiceAssistant 
                  language={language}
                  onSpeechResult={(txt) => handleSendChatMessage(txt)}
                  lastBotReply={lastBotResponse}
                />
              </div>

              {/* Chat log */}
              <div style={styles.chatLog}>
                {chatHistory.map((chat, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.chatBubble,
                      alignSelf: chat.role === "user" ? "flex-end" : "flex-start",
                      backgroundColor: chat.role === "user" ? "var(--leaf-green)" : "rgba(255,255,255,0.05)",
                      borderRadius: chat.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      borderColor: chat.role === "user" ? "var(--emerald-green)" : "rgba(255,255,255,0.1)"
                    }}
                  >
                    <div style={{ whiteSpace: "pre-line" }}>{chat.text}</div>
                  </div>
                ))}
                {isLoadingChat && (
                  <div style={{ ...styles.chatBubble, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.02)" }}>
                    Thinking agricultural strategy...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={styles.chatInputRow}>
                <input 
                  type="text" 
                  placeholder="Ask any question about agriculture, fertilizer, pests, markets..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  style={styles.chatTextInput}
                />
                <button 
                  onClick={() => handleSendChatMessage()}
                  className="btn-3d"
                  style={{ padding: "10px 20px" }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer style={styles.footer}>
        <p>© 2026 Farmverse AI Platform. All rights reserved. Commercial Smart Agriculture Suite.</p>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    margin: "12px 24px",
    zIndex: 10,
    flexWrap: "wrap",
    gap: "16px"
  },
  headerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer"
  },
  logoCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(16, 185, 129, 0.3)"
  },
  brandTitle: {
    fontSize: "22px",
    margin: 0,
    fontWeight: "800"
  },
  brandSubtitle: {
    fontSize: "10px",
    color: "#a7f3d0",
    marginTop: "-2px"
  },
  controlsBar: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
  },
  controlItem: {
    display: "flex",
    flexDirection: "column"
  },
  controlLabel: {
    fontSize: "10px",
    color: "#94a3b8",
    marginBottom: "4px",
    fontWeight: "500"
  },
  selectInput: {
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    outline: "none",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif"
  },
  selectInputFull: {
    background: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    outline: "none",
    fontSize: "13px",
    width: "100%",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif"
  },
  navBar: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "0 24px 16px 24px",
    flexWrap: "wrap"
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s ease"
  },
  navLinkActive: {
    background: "rgba(16, 185, 129, 0.15)",
    color: "var(--emerald-green)",
    boxShadow: "0 2px 10px rgba(16,185,129,0.1)"
  },
  card: {
    minHeight: "150px",
    border: "1px solid var(--glass-border)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  cardHeader: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "16px",
    color: "#a7f3d0"
  },
  weatherBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1
  },
  weatherMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  gpsBadge: {
    display: "flex",
    alignItems: "center",
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid var(--glass-border)",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    color: "var(--emerald-green)"
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    fontSize: "12px"
  },
  forecastRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px dashed rgba(255,255,255,0.08)",
    paddingTop: "12px",
    marginTop: "4px"
  },
  forecastDay: {
    textAlign: "center",
    fontSize: "11px"
  },
  newsBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1
  },
  newsItem: {
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },
  newsBadge: {
    fontSize: "9px",
    backgroundColor: "rgba(249, 115, 22, 0.2)",
    color: "var(--harvest-orange)",
    padding: "2px 6px",
    borderRadius: "4px",
    marginRight: "8px"
  },
  newsBadgeGreen: {
    fontSize: "9px",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "var(--emerald-green)",
    padding: "2px 6px",
    borderRadius: "4px",
    marginRight: "8px"
  },
  newsBadgeAlert: {
    fontSize: "9px",
    backgroundColor: "rgba(239, 35, 60, 0.2)",
    color: "#f87171",
    padding: "2px 6px",
    borderRadius: "4px",
    marginRight: "8px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px"
  },
  formLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "4px"
  },
  rangeInput: {
    cursor: "pointer",
    accentColor: "var(--emerald-green)"
  },
  sensorAlert: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid var(--emerald-green)",
    color: "var(--emerald-green)",
    fontSize: "11px",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "14px",
    textAlign: "center"
  },
  gpsBtn: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid var(--emerald-green)",
    color: "var(--emerald-green)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px"
  },
  tableRow: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },
  predictionDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px"
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    padding: "4px 10px",
    gap: "6px"
  },
  searchInput: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "12px",
    outline: "none"
  },
  mandiBox: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px"
  },
  mandiHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "8px",
    marginBottom: "8px"
  },
  mandiDist: {
    fontSize: "10px",
    color: "var(--golden-yellow)",
    background: "rgba(251,191,36,0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    height: "fit-content"
  },
  pricesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background 0.2s ease",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.03)"
    }
  },
  trendRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderBottom: "1px dashed rgba(255,255,255,0.05)"
  },
  wikiHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px"
  },
  searchContainerLarge: {
    display: "flex",
    alignItems: "center",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    gap: "12px",
    boxShadow: "0 0 15px rgba(16,185,129,0.05)"
  },
  searchInputLarge: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    fontFamily: "'Inter', sans-serif"
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  filterTab: {
    border: "1px solid",
    color: "white",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "500",
    fontFamily: "'Outfit', sans-serif"
  },
  wikiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px"
  },
  wikiDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    fontSize: "12px",
    marginTop: "12px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: "12px"
  },
  categoryBadge: {
    fontSize: "10px",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "var(--emerald-green)",
    padding: "2px 8px",
    borderRadius: "20px",
    border: "1px solid rgba(16, 185, 129, 0.2)"
  },
  chatContainer: {
    border: "1px solid var(--glass-border)",
    display: "flex",
    flexDirection: "column",
    height: "550px",
    overflow: "hidden"
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,28,21,0.2)"
  },
  chatLog: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  chatBubble: {
    maxWidth: "80%",
    padding: "12px 16px",
    fontSize: "13px",
    lineHeight: "1.5",
    border: "1px solid",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  chatInputRow: {
    display: "flex",
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    gap: "12px",
    background: "rgba(0,0,0,0.2)"
  },
  chatTextInput: {
    flex: 1,
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "white",
    fontSize: "13px",
    outline: "none",
    fontFamily: "'Inter', sans-serif"
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: "11px",
    color: "#64748b",
    marginTop: "24px"
  }
};
