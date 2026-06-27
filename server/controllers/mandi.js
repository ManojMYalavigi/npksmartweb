import axios from "axios";
import { cropsData } from "../data/crops.js";

// Coordinate list of main Indian agricultural mandis
const mandisList = [
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

// Haversine formula to compute distances in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const getMandiPrices = async (req, res) => {
  try {
    const { lat, lon, state } = req.query;

    const userLat = Number(lat);
    const userLon = Number(lon);

    let resolvedLocationName = "";
    let resolvedState = state;

    // Resolve real city and state names from coordinates using OSM Nominatim API
    if (!isNaN(userLat) && !isNaN(userLon)) {
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}&zoom=10&addressdetails=1`;
        const geoRes = await axios.get(geoUrl, {
          headers: { "User-Agent": "FarmverseAI-AgriculturePlatform/1.0" }
        });
        if (geoRes.data && geoRes.data.address) {
          const addr = geoRes.data.address;
          const city = addr.city || addr.town || addr.village || addr.suburb || "Local Region";
          const dist = addr.county || addr.district || "";
          const st = addr.state || "";
          resolvedLocationName = `${city}${dist ? ", " + dist : ""}${st ? ", " + st : ""}`;
          if (st && (!state || state.toLowerCase() !== "all")) {
            resolvedState = st; // Overrides query state parameter with high-precision reverse-geocoded state
          }
        }
      } catch (err) {
        console.warn("OSM Reverse Geocoding in Mandi API failed:", err.message);
        resolvedLocationName = `${userLat}°N, ${userLon}°E`;
      }
    }

    // 1. Compute nearby mandis if user GPS is available, fallback to default ordering
    let sortedMandis = [...mandisList];
    if (!isNaN(userLat) && !isNaN(userLon)) {
      sortedMandis = mandisList.map(mandi => ({
        ...mandi,
        distance: getDistance(userLat, userLon, mandi.lat, mandi.lon)
      })).sort((a, b) => a.distance - b.distance);
    } else {
      sortedMandis = mandisList.map(mandi => ({
        ...mandi,
        distance: 120 // mock distance
      }));
    }

    // Filter by state if requested and exists in list (support 'all' or empty state to skip filtering)
    if (resolvedState && resolvedState.toLowerCase() !== "all" && resolvedState.toLowerCase() !== "all india") {
      const stateFiltered = sortedMandis.filter(m => m.state.toLowerCase() === resolvedState.toLowerCase());
      if (stateFiltered.length > 0) {
        sortedMandis = stateFiltered;
      }
    }

    // 2. Generate prices for each crop in these mandis
    const mandiPrices = sortedMandis.map(mandi => {
      // Pick crops suitable or commonly traded
      const prices = cropsData.map(crop => {
        // Base crop price from MSP
        const baseMsp = crop.msp;
        // Fluctuates depending on Mandi location and demand (randomized 5-15% variance)
        const variance = (Math.sin(mandi.lat + crop.msp) * 0.08) + (Math.random() * 0.06 - 0.03);
        const modalPrice = Math.round(baseMsp * (1 + variance));
        const minPrice = Math.round(modalPrice * 0.92);
        const maxPrice = Math.round(modalPrice * 1.08);

        // Historical price trend (last 6 months)
        const history = [];
        for (let m = 5; m >= 0; m--) {
          const date = new Date();
          date.setMonth(date.getMonth() - m);
          const monthName = date.toLocaleString("default", { month: "short" });
          const monthTrend = Math.sin((m + crop.msp) * 0.5) * 0.05 + 0.02 * (5 - m);
          history.push({
            month: monthName,
            price: Math.round(baseMsp * (1 + monthTrend))
          });
        }

        return {
          cropId: crop.id,
          cropName: crop.name,
          minPrice,
          maxPrice,
          modalPrice,
          history
        };
      });

      return {
        mandiId: mandi.id,
        mandiName: mandi.name,
        city: mandi.city,
        state: mandi.state,
        distance: mandi.distance,
        prices
      };
    });

    // 3. Overall Market Trends & Demand & Exports
    const marketTrends = cropsData.slice(0, 15).map(crop => {
      // Export volumes: high category crops
      const exportVolume = crop.category === "Plantation" || crop.category === "Spices" 
        ? Math.round(crop.msp * 0.8) 
        : Math.round(crop.msp * 0.2);

      const trendDirection = Math.sin(crop.msp) > 0 ? "Up" : "Down";
      const trendPercent = Math.round(Math.abs(Math.sin(crop.msp) * 12) * 10) / 10;

      return {
        cropId: crop.id,
        cropName: crop.name,
        category: crop.category,
        msp: crop.msp,
        demand: crop.demand,
        exportTrend: crop.category === "Spices" || crop.category === "Plantation" ? "Increasing" : "Stable",
        exportVolume: `${exportVolume} Tons/yr`,
        priceTrend: {
          direction: trendDirection,
          percentage: trendPercent
        }
      };
    });

    res.json({
      success: true,
      locationName: resolvedLocationName,
      resolvedState: resolvedState,
      mandis: mandiPrices,
      trends: marketTrends
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
