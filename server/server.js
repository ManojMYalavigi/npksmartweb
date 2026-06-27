import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getPrediction } from "./controllers/prediction.js";
import { getWeather } from "./controllers/weather.js";
import { getMandiPrices } from "./controllers/mandi.js";
import { chatAssistant } from "./controllers/assistant.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date(), service: "Farmverse AI Backend" });
});

app.post("/api/predict", getPrediction);
app.get("/api/weather", getWeather);
app.get("/api/mandi", getMandiPrices);
app.post("/api/chat", chatAssistant);

// Start Server (Only in non-Vercel environment)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[FARMVERSE SERVER] Running on port ${PORT}`);
  });
}

export default app;
