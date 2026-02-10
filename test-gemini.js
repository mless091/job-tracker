// test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load env vars

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("Checking models for key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("✅ SUCCESS! Response:", result.response.text());
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

main();