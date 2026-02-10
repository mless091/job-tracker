// check-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // This asks Google: "Give me the list of every model this key can touch"
    // Note: We access the model manager via the generic client if available, 
    // or we construct a fetch request manually if the SDK version is quirky.
    
    // Attempt 1: Standard SDK method
    console.log("...Fetching available models...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("---------------------------------");
    const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    generateModels.forEach(model => {
      console.log(`Name: ${model.name}`); // This is exactly what we need
      console.log(`Description: ${model.description}`);
      console.log("---------------------------------");
    });

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

listModels();