import { GoogleGenerativeAI } from "@google/generative-ai";
import { queryAgriculturalKB } from "../data/kbData.js";
import { cropsData } from "../data/crops.js";
import { soilsData } from "../data/soils.js";

export const chatAssistant = async (req, res) => {
  try {
    const { message, language, history } = req.body;
    const lang = language || "English";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Create a summarized context of local knowledge bases
      const cropsSummary = cropsData.map(c => `${c.name} (${c.category}): NPK ${c.npk.N}-${c.npk.P}-${c.npk.K}, pH ${c.soilPH.min}-${c.soilPH.max}, Water ${c.water.min}-${c.water.max}mm, Diseases: ${c.diseases.join(', ')}`).join('\n');
      const soilsSummary = soilsData.map(s => `${s.name}: ${s.npkSuitability}, pH ${s.phRange.min}-${s.phRange.max}, Crops: ${s.suitableCrops.join(', ')}`).join('\n');
      
      const advancedSystemInstruction = `You are Farmverse AI, a state-of-the-art agricultural intelligence expert and veteran agronomist. 
Your core mission is to help farmers, crop researchers, and agro-consultants maximize crop yields, restore soil fertility, optimize NPK fertilizer metrics, plan water consumption, and identify crop diseases with high accuracy.
You MUST speak the requested language fluently: ${lang}.

## Agronomic Expert Guidelines:
- **Precision Fertilization**: Calculate chemical and organic corrections when NPK deficiencies are raised. Distinguish active crop growth phases (seedling, vegetative, flowering, yield). Recommend specific nitrogen (Urea), phosphorus (SSP/DAP), and potassium (MOP) dosage targets when deficiencies are described.
- **Diagnostics Protocol**: 
  - Treat disease queries systematically. Analyze description -> Suggest potential pathogens -> Propose immediate mitigation (chemical fungicides/insecticides) and sustainable long-term biology (Trichoderma viride, Pseudomonas fluorescens, Neem Oil).
  - Actively prompt for missing metrics: soil pH, humidity, leaf coloration patterns, or soil moisture if the description is vague.
- **Sustainable Farming**: Emphasize soil organic carbon preservation, green manuring, crop rotation sequences (e.g., leguminous nitrogen-fixers after heavy feeders), and Integrated Pest Management (IPM).
- **Format Requirements**: Structure responses cleanly with markdown:
  - Use headers (###), bold text, bullet points, and highlight recommendations.
  - Separate advice into distinct sections: **Diagnostic Analysis**, **Immediate Countermeasures (Organic & Chemical)**, and **Preventive Agronomic Practices**.

## Local Ground-Truth Knowledge:
Use the following parameters for recommendations when applicable:

### Crops Data:
${cropsSummary}

### Soils Data:
${soilsSummary}

Respond clearly, helpfully, and beautifully format your responses using Markdown.`;

      try {
        // Initialize Gemini SDK with correct class name
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: advancedSystemInstruction
        });

        // Format history for Gemini chat
        const chat = model.startChat({
          history: (history || []).map(h => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          }))
        });

        const result = await chat.sendMessage(message);
        const reply = await result.response.text();
        return res.json({ success: true, source: "gemini_api", text: reply });
      } catch (geminiError) {
        console.warn("Gemini API failed or invalid key, falling back to local expert system:", geminiError.message);
      }
    }

    // Advanced Agricultural Expert System local/offline mode
    const replyText = queryAgriculturalKB(message, lang);

    // Return response
    return res.json({ success: true, source: "local_rules_fallback", text: replyText });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const translateNews = async (req, res) => {
  try {
    const { items, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Items array is required" });
    }

    if (language === "English" || !apiKey) {
      return res.json({ success: true, items });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert translator. Translate the following array of agricultural news items (specifically the 'title' and the array elements inside 'categories') into the language: ${language}.
Return the output strictly in the exact same JSON array structure. Do not translate dates, links, or technical codes unless appropriate.

JSON Input:
${JSON.stringify(items)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    const translatedItems = JSON.parse(text);
    res.json({ success: true, items: translatedItems });
  } catch (error) {
    console.warn("Gemini translateNews API failed, returning original items:", error.message);
    res.json({ success: false, error: error.message, items });
  }
};
