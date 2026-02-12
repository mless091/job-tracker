# JobFlow AI - Intelligent Career Copilot

**JobFlow AI** is a full-stack application designed to modernize the job search process. It combines a kanban-style application tracker with a Generative AI engine that autonomously rewrites user resumes to match specific job descriptions.

![Dashboard Preview](./public/dashboard-preview.png) *(Note: Add a screenshot here later)*

## 🚀 Key Features

* **AI Resume Architect:** Uses Google Gemini to analyze job descriptions and rewrite resume bullet points for ATS optimization (PDF-to-PDF generation).
* **Visual Pipeline:** A "Command Center" dashboard with velocity charts and status metrics.
* **AI Interview Coach:** Analyzes the job description to generate 4 targeted interview questions (Technical & Behavioral). Also can generate sample answers for you to review, based on your resume using the STAR method.
* **Smart Filtering:** Instant search and filtering across application statuses (Applied, Interview, Offer).
* **Secure Storage:** Cloud-based resume storage with secure user authentication via Clerk.

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
* **UI Library:** Shadcn UI, Lucide Icons, Recharts (Data Viz).
* **Backend:** Server Actions, Prisma ORM.
* **Database:** PostgreSQL (Neon/Supabase).
* **AI:** Google Gemini 1.5 Flash (Generative Content & Text Analysis).
* **PDF Processing:** `pdf2json` for parsing, `@react-pdf/renderer` for generation.

## 🏗️ Architecture Highlight: The "Resume Architect"

One of the core technical challenges was maintaining the formatting of a user's resume while rewriting the content.

1.  **Extraction:** The app parses the "Master Resume" PDF into raw text using `pdf2json`.
2.  **Constraint Generation:** A prompt engineering layer instructs Gemini to keep factual history (dates, companies) immutable while strictly optimizing the *descriptions* for keyword matching.
3.  **Regeneration:** The new content is fed into a dynamic React-PDF template that re-renders a downloadable, polished PDF in real-time.

## 📦 Getting Started

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/mless091/job-tracker.git](https://github.com/mless091/job-tracker.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file with your keys (Clerk, Database URL, Gemini API Key, Blob Storage).
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🔮 Future Improvements

* **Cover Letter Generation:** Using the same context engine to draft personalized cover letters.
* **Browser Extension:** To "Clip" jobs directly from LinkedIn into the dashboard.
* **Resume Builder:** Allow users to input their experience, education, etc and build a resume for them.