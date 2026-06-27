import { cropsData } from "../data/crops.js";
import { soilsData } from "../data/soils.js";

export const getPrediction = (req, res) => {
  try {
    const {
      nitrogen,
      phosphorus,
      potassium,
      pH,
      moisture,
      rainfall,
      soilType
    } = req.body;

    // Validate inputs
    const N = Number(nitrogen) || 0;
    const P = Number(phosphorus) || 0;
    const K = Number(potassium) || 0;
    const phVal = Number(pH) || 7.0;
    const moistVal = Number(moisture) || 50;
    const rainVal = Number(rainfall) || 500;
    const size = 1.0; // defaulted land size to 1 Hectare

    // Default climate factors since forms are simplified
    const tempVal = 27; // Average optimal tropical temp
    const humVal = 65;  // Average optimal humidity

    // Find soil details
    const selectedSoil = soilsData.find(s => s.id === soilType) || soilsData[0];

    // Fertility multiplier based on soil
    let fertilityMul = 1.0;
    if (selectedSoil.fertility === "Extremely High") fertilityMul = 1.4;
    else if (selectedSoil.fertility === "Very High") fertilityMul = 1.3;
    else if (selectedSoil.fertility === "High") fertilityMul = 1.2;
    else if (selectedSoil.fertility === "Medium") fertilityMul = 1.0;
    else if (selectedSoil.fertility === "Low") fertilityMul = 0.7;
    else if (selectedSoil.fertility === "Very Low") fertilityMul = 0.5;

    // Predict score for each crop
    const predictions = cropsData.map(crop => {
      // 1. pH suitability (0 - 1)
      let phScore = 1.0;
      if (phVal < crop.soilPH.min) {
        phScore = Math.max(0, 1 - (crop.soilPH.min - phVal) * 0.4);
      } else if (phVal > crop.soilPH.max) {
        phScore = Math.max(0, 1 - (phVal - crop.soilPH.max) * 0.4);
      }

      // 2. Temp suitability (0 - 1)
      let tempScore = 1.0;
      if (tempVal < crop.temp.min) {
        tempScore = Math.max(0, 1 - (crop.temp.min - tempVal) * 0.1);
      } else if (tempVal > crop.temp.max) {
        tempScore = Math.max(0, 1 - (tempVal - crop.temp.max) * 0.1);
      }

      // 3. Humidity suitability (0 - 1)
      let humScore = 1.0;
      if (humVal < crop.humidity.min) {
        humScore = Math.max(0, 1 - (crop.humidity.min - humVal) * 0.04);
      } else if (humVal > crop.humidity.max) {
        humScore = Math.max(0, 1 - (humVal - crop.humidity.max) * 0.04);
      }

      // 4. Rainfall suitability (0 - 1)
      let rainScore = 1.0;
      if (rainVal < crop.rainfall.min) {
        rainScore = Math.max(0, 1 - (crop.rainfall.min - rainVal) * 0.002);
      } else if (rainVal > crop.rainfall.max) {
        rainScore = Math.max(0, 1 - (rainVal - crop.rainfall.max) * 0.001);
      }

      // 5. NPK suitability (0 - 1)
      const nRatio = Math.max(0, 1 - Math.abs(N - crop.npk.N) / crop.npk.N);
      const pRatio = Math.max(0, 1 - Math.abs(P - crop.npk.P) / crop.npk.P);
      const kRatio = Math.max(0, 1 - Math.abs(K - crop.npk.K) / crop.npk.K);
      const npkScore = (nRatio + pRatio + kRatio) / 3;

      // 6. Soil suitability bonus
      const isSuitableSoil = selectedSoil.suitableCrops.includes(crop.id);
      const soilBonus = isSuitableSoil ? 0.3 : 0.0;

      // 7. Combined weighted score
      // pH: 20%, Temp: 20%, Humidity: 10%, Rainfall: 10%, NPK: 20%, Soil Type Match: 20%
      let baseScore = (phScore * 0.20) + (tempScore * 0.20) + (humScore * 0.10) + (rainScore * 0.10) + (npkScore * 0.20) + (soilBonus * 0.20);
      
      // Cap at 1.0, scale to percentage
      const finalScore = Math.min(100, Math.round((baseScore + (isSuitableSoil ? 0.1 : 0)) * 100));

      // Calculate Expected Yield (tons per hectare)
      // Base yield * land size * soil fertility multiplier * NPK status
      const npkFactor = 0.7 + (npkScore * 0.3);
      const expectedYield = Math.round((crop.yield * size * fertilityMul * npkFactor) * 100) / 100;

      // Current Price estimate (MSP + random market offset)
      // MSP is per quintal (100 kg). 1 Ton = 10 quintals.
      const pricePerTon = crop.msp * 10;
      const grossRevenue = expectedYield * pricePerTon;
      
      // Expenses estimation: Fertilizer + Seed + Labor (approx 20000 INR per hectare)
      const baseCost = 25000 * size;
      const expectedProfit = Math.round(grossRevenue - baseCost);
      const roi = expectedProfit > 0 ? Math.round((expectedProfit / baseCost) * 100) : 0;

      // Fertilizer recommendation
      const nDeficit = Math.max(0, crop.npk.N - N);
      const pDeficit = Math.max(0, crop.npk.P - P);
      const kDeficit = Math.max(0, crop.npk.K - K);

      // Urea is 46% N, SSP is 16% P, MOP is 60% K
      const ureaReq = Math.round((nDeficit / 0.46) * size);
      const sspReq = Math.round((pDeficit / 0.16) * size);
      const mopReq = Math.round((kDeficit / 0.60) * size);

      const fertilizerPlan = {
        urea: ureaReq,
        ssp: sspReq,
        mop: mopReq,
        nDeficit: Math.round(nDeficit * size),
        pDeficit: Math.round(pDeficit * size),
        kDeficit: Math.round(kDeficit * size)
      };

      // Organic Recommendation
      const organicRec = [];
      if (nDeficit > 0) organicRec.push("Apply Neem cake or Farmyard Manure (FYM) to restore Nitrogen naturally.");
      if (pDeficit > 0) organicRec.push("Apply Bone Meal or Rock Phosphate to improve soil Phosphorus organic levels.");
      if (kDeficit > 0) organicRec.push("Incorporate Wood Ash or Seaweed liquid fertilizer to supply organic Potassium.");
      if (organicRec.length === 0) organicRec.push("Soil NPK parameters are excellent! Continue using vermicompost cover-cropping to preserve organic carbon.");

      // Disease Risk
      let diseaseRisk = "Low";
      let recommendedPrevention = "Maintain standard weed management and crop rotation.";
      let predictedDisease = "None";

      if (humVal > 75 && tempVal > 22 && tempVal < 32) {
        diseaseRisk = "High";
        predictedDisease = crop.diseases[0] || "Fungal infection";
        recommendedPrevention = `Preventive spray of Trichoderma viride or standard organic fungicide. Ensure proper field drainage to reduce high humidity pockets.`;
      } else if (humVal > 60 || (tempVal > 30 && moistVal > 70)) {
        diseaseRisk = "Medium";
        predictedDisease = crop.diseases[1] || "Bacterial Leaf Spot";
        recommendedPrevention = `Monitor field borders weekly. Apply neem oil spray (3% concentration) as a biological deterrent.`;
      }

      // Carbon Footprint rating
      let carbonFootprint = "Low (0.15 tons CO2e/ha)";
      if (crop.category === "Plantation" || crop.category === "Fruit") {
        carbonFootprint = "Negative (Net Carbon Sink: -1.2 tons CO2e/ha)";
      } else if (crop.id === "rice") {
        carbonFootprint = "High (1.8 tons CO2e/ha due to anaerobic methane emissions)";
      }

      return {
        id: crop.id,
        name: crop.name,
        botanicalName: crop.botanicalName,
        category: crop.category,
        score: finalScore,
        expectedYield,
        expectedProfit,
        roi,
        harvestTime: crop.duration,
        waterRequirement: Math.round(crop.water.min * size * 10), // cubic meters
        diseaseRisk,
        predictedDisease,
        recommendedPrevention,
        fertilizerPlan,
        organicRecommendation: organicRec.join(" "),
        carbonFootprint,
        msp: crop.msp,
        demand: crop.demand
      };
    });

    // Sort by compatibility score
    const topPredictions = predictions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json({
      success: true,
      soil: selectedSoil,
      predictions: topPredictions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
