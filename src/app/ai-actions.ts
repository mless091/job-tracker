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

  // --- PROMPT ---
  const prompt = `
    You are an expert Resume Architect, with the goal of creating a perfectly constructed, optimized Resume for the candidate for the particular role.
    
    GOAL: Create a DENSE, SINGLE-PAGE resume.
    
    ADJUSTMENTS:
    1. **Bullet Count:** Generate **3-5 bullets** per role/project. (Aim for 4).
    2. **Conciseness:** Bullets should be impactful but not overly wordy. Focus on the result, and optimize to contain keywords from the job description.
    3. **No Summary:** Do not include a summary.
    4. **ATS:** Ensure the resume is optimzied to score highly on any ATS software
    5. **No Lying:** Do not create skills or roles for the candidate. Focus on optimizing what they have
    
    STRICT CLASSIFICATION:
    - **Experience:** Paid Work/Internships ONLY.
    - **Projects:** Any Non-paid work or outside projects. 
    
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

export async function generateInterviewPrep(jobId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const job = await prisma.job.findUnique({ where: { id: jobId, userId } });
  if (!job?.description) throw new Error("Job has no description.");

  const prompt = `
    You are an expert Hiring Manager. 
    Based on the following Job Description, generate 4 challenging and realistic interview questions (mix of technical and behavioral).
    For each question, provide "Key Talking Points" (a concise hint on what the candidate should mention).
    

    JOB DESCRIPTION:
    ${job.description.substring(0, 3000)}

    OUTPUT JSON FORMAT:
    {
      "questions": [
        {
          "question": "The interview question",
          "hint": "Bullet points or advice on how to answer"
        }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateInterviewAnswer(jobId: string, question: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const job = await prisma.job.findUnique({ where: { id: jobId, userId } });
  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  
  if (!job?.description) throw new Error("Job has no description.");
  if (!prefs?.masterResumeUrl) throw new Error("No resume found.");

  // 1. Fetch & Parse Resume (Reusing logic for context)
  const response = await fetch(prefs.masterResumeUrl);
  const arrayBuffer = await response.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);
  let resumeText = await parsePdfBuffer(pdfBuffer); // Reusing the helper function we made earlier

  // 2. The "STAR Method" Prompt
  const prompt = `
    You are an expert Interview Coach.
    
    TASK: Write a perfect interview answer for the User based on their Resume.
    
    THE QUESTION: "${question}"
    
    CONTEXT:
    - User's Resume: ${resumeText.substring(0, 3000)}
    - Job Description: ${job.description.substring(0, 1000)}
    
    INSTRUCTIONS:
    - Use the STAR Method (Situation, Task, Action, Result) but weave it into a natural response.
    - CITE SPECIFIC PROJECTS or EXPERIENCES from the resume. Do not make things up.
    - Keep it under 150 words. Conversational but professional.
    
    OUTPUT: 
    Just the answer text. No "Here is the answer:" prefix.
  `;

  const result = await model.generateContent(prompt);
  const aiResponse = await result.response;
  return aiResponse.text();
}