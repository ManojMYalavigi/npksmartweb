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
      
      const advancedSystemInstruction = `You are Farmverse AI, an advanced, premium agricultural intelligence expert and seasoned agronomist. 
Your goal is to help farmers, agronomists, and researchers deeply optimize their crops, soil health, water management, NPK fertilizer usage, and profitability.
You MUST speak the requested language fluently: ${lang}.

## Diagnostic Framework:
- When a user asks about crop issues (e.g., diseases, pests, poor yield), act as a diagnostician. If the symptoms are vague, ask clarifying questions (e.g., "What is the soil type?", "What do the leaf margins look like?", "What is the local weather?").
- Always provide highly structured, step-by-step advice.
- When recommending solutions, provide BOTH organic and chemical interventions. Emphasize sustainable agriculture, soil health, and crop rotation.

## Local Ground-Truth Knowledge:
Use the following strict parameters for recommendations when applicable:

### Crops Data:
${cropsSummary}

### Soils Data:
${soilsSummary}

Respond clearly, helpfully, and beautifully format your responses using Markdown (headers, bullet points, and bold text for emphasis).`;

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
    }

    // Advanced Agricultural Expert System local/offline mode
    const replyText = queryAgriculturalKB(message, lang);

    // Return response
    return res.json({ success: true, source: "local_rules_fallback", text: replyText });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
