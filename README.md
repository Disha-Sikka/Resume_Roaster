# Resume Roaster AI 🚀🔥

A modern, responsive, and full-stack web application that audits, parses, and roasts resumes with humor and professional precision, powered by Google Gemini.

---

## 🛠️ Features

### 1. Landing Page
- Elegant and responsive dark-mode display layout with animated gradient backgrounds.
- High-impact statistics on resumes parsed, rating points, and career results.
- Staggered animation cards explaining key functional modes (AI Roasting, ATS Checker, Custom summaries).

### 2. Resume File Uploader
- Supports **PDF**, **DOCX**, and plain **TXT** files up to 10MB.
- Dynamic file reader extracting raw characters using browser-side sandboxed libraries (`pdf.js` & `mammoth.js` via CDN) for seamless build stability.
- Fallback manual text copy-paste option.

### 3. Structural Metadata Audits
- Renders extracted profile fields (Name, Email, Skills, Experience, Education) in an interactive review card.
- Allows candidates to refine or edit extracted fields before applying heat.

### 4. AI Roast Styles
- 😊 **Friendly Roast**: Lighthearted teasing and encouraging hints.
- 🔥 **Savage Roast**: Biting, sarcastic, and hilarious audits of career clichés.
- 💀 **Brutal Roast**: Extreme high-temperature roasting targeting formatting, credentials, and experience.
- 🎯 **HR Recruiter Roast**: Polite but passive-aggressive corporate recruiter sarcasm.
- 🤖 **ATS Robot Roast**: Mechanical console logs treating your format like a crash error.

### 5. Multi-Tab Analytics Dashboard
- **Score Indicators**: Overall, ATS Rate, Grammar, Design, Skills, and Experience gauges.
- **Bar Chart**: Custom-designed SVG animated indicator charting these categories.
- **Interactive Inspect Page**: Renders a mock resume layout displaying floating pulsing mistake flags. Click on a flag to read why it's a mistake and how to fix it!
- **Action Plan**: Outlines detailed, side-by-side mistakes, humorous comments, professional recommendations, and career impact descriptions.
- **Aesthetic Checklist**: Missing keywords list, suggested career summary statement, interview readiness, and final career verdicts.

### 6. Archive & Export
- Exporters to copy or download reports as Markdown (.md) or complete JSON payloads.
- Local archive history allowing user search, delete, and inline file renaming.

---

## 💻 Tech Stack
- **Framework**: React 19 + Vite 6 (Single Page Application)
- **Backend Server**: Full-stack Express.js 4 (Vite middleware integration in development, compiled standalone Node server in production)
- **AI integration**: Modern `@google/genai` TypeScript SDK (Lazily initialized server-side to hide secrets from the browser)
- **Styling & Theme**: Tailwind CSS v4, Inter & JetBrains Mono Google Fonts
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide Icons

---

## ⚙️ Local Development Setup

### 1. Requirements
Ensure you have Node.js v18+ installed on your system.

### 2. Secrets Configuration
Copy the `.env.example` file and create a `.env` file in the root folder, defining your Google Gemini API key:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### 3. Dependencies Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The application and local Express + Vite server will start on http://localhost:3000.

### 5. Production Compilation
```bash
npm run build
```
This builds the client application and bundles `/server.ts` into a self-contained CommonJS Node server `/dist/server.cjs` using `esbuild`.

### 6. Start Production Server
```bash
npm run start
```
This launches the compiled production environment.

---

## ☁️ Vercel Deployment

This project is fully ready for Vercel. 
To configure a custom Serverless/Edge endpoint on Vercel:
1. Define `GEMINI_API_KEY` inside Vercel's Environment Variables panel.
2. Deploy the project directory as a standard Vite/React template or configure the production scripts to serve client files in a serverless function structure.
