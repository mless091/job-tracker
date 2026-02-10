// app/ai-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  generationConfig: { 
    responseMimeType: "application/json" 
  } 
});

export async function generateTailoredResume(jobId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const job = await prisma.job.findUnique({ where: { id: jobId, userId } });
  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });

  if (!job?.description) throw new Error("Job has no description.");
  if (!prefs?.masterResumeUrl) throw new Error("No master resume found.");

  const response = await fetch(prefs.masterResumeUrl);
  const arrayBuffer = await response.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);
  
  let resumeText = "";
  try {
    resumeText = await parsePdfBuffer(pdfBuffer);
  } catch (error) {
    throw new Error("Failed to read text from resume.");
  }

  // --- THE "SWEET SPOT" PROMPT ---
  const prompt = `
    You are an expert Resume Architect.
    
    GOAL: Create a DENSE, SINGLE-PAGE resume.
    The previous version was slightly too long. We need to tighten it up while keeping the "Experienced" feel.
    
    ADJUSTMENTS:
    1. **Bullet Count:** Generate **3-5 bullets** per role/project. (Aim for 4).
    2. **Conciseness:** Bullets should be impactful but not overly wordy. Focus on the result.
    3. **No Summary:** Do not include a summary.
    
    STRICT CLASSIFICATION:
    - **Experience:** Paid Work/Internships ONLY.
    - **Projects:** "CyBot", "Gameday App", "Class Scheduler", "Senior Design".
    
    CANDIDATE RESUME:
    ${resumeText}

    TARGET JOB DESCRIPTION:
    ${job.description}

    REQUIRED JSON STRUCTURE:
    {
      "fullName": "String",
      "contactInfo": "String (Phone | Email | Link)",
      "education": [
        {
          "school": "String",
          "degree": "String",
          "date": "String"
        }
      ],
      "experience": [
        {
          "company": "String",
          "role": "String",
          "date": "String",
          "bullets": ["String", "String", "String", "String"] 
        }
      ],
      "projects": [
        {
          "name": "String",
          "description": ["String", "String", "String", "String"]
        }
      ],
      "skills": ["String", "String", "String"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text(); 
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(`AI Generation Failed: ${error.message}`);
  }
}

function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}