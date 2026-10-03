# AI Health Analyzer

A complete, polished React + Vite web application that helps users understand their health information, symptoms, and medical lab reports using AI-assisted informational analysis with a guaranteed local clinical-rules fallback.

## What Was Built

- Landing page with hero, disclaimer, how-it-works sections
- Multi-section analysis form (personal info, symptoms, vitals)
- Auto-calculated BMI with category display
- Drag-and-drop medical report upload (PDF, JPG, PNG, max 10MB)
- PDF text extraction via PDF.js
- Image OCR via Tesseract.js
- 20+ medical parameter extraction engine
- Reference range comparison (report-first + general reference fallback)
- Responsive parameter table with expandable plain-language explanations
- AI analysis with guaranteed rule-based fallback (no API key needed)
- 6-step realistic loading modal
- Symptom rule-based engine with emergency red flags
- Overall informational health status
- Result dashboard with KPI cards
- History page with localStorage persistence
- About page with disclaimers
- Responsive navbar with mobile drawer menu
- Vercel serverless API endpoint for safe AI key proxying
- Production build with zero errors

## How to Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
copy .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `AI_API_KEY` | Optional | Server-side OpenAI-compatible API key for enhanced AI insights |
| `VITE_AI_API_KEY` | Optional | Client-side fallback key (not recommended for production) |

The application works 100% reliably without any API key using the built-in local clinical rules engine.

## Deploy to Vercel

**Option 1: Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option 2: GitHub Import**
1. Push repository to GitHub
2. Go to vercel.com -> New Project -> Import from GitHub
3. Vercel auto-detects Vite - no build configuration needed
4. Optionally add `AI_API_KEY` in Vercel dashboard for AI-enhanced insights

The included `vercel.json` handles SPA routing and serverless API routing automatically.

## Faculty Demo Flow (3-5 minutes)

1. Open the app -> Landing page
2. Click "Try Demo" -> Auto-populates all form fields with Demo User + 18-parameter lab report
3. Verify BMI auto-calculates (23.5 kg/m2 - Normal Weight)
4. Click "Analyze My Health" -> 6-step progress modal runs
5. View Results:
   - Overall status: "Needs Attention"
   - ~18 parameters analyzed
   - Click "Explain" on Fasting Glucose (108 mg/dL - Above Range) for plain-language explanation
   - Click "Explain" on LDL Cholesterol (120 mg/dL - Above Range)
   - Vitamin D (22 ng/mL - Below Range)
6. Open History tab -> Shows saved analysis
7. Emergency Safety: Go to Analyze -> type "chest pain" -> Red emergency banner appears

## Known Limitations

- OCR accuracy: Tesseract.js performs well on clean printed medical reports but may struggle with handwritten notes or low-contrast scans. The demo report text is pre-populated for reliable demonstration.
- Bundle size: Large JS chunk (~805 KB, gzipped ~240 KB) due to tesseract.js and pdfjs-dist. For production, consider lazy-loading these libraries.
- No real backend: Client-side prototype using browser localStorage. Not suitable for storing real patient data.

## Project Structure

```
src/
  components/
    Footer.jsx               App footer
    LoadingAnalysisModal.jsx 6-step progress modal
    MedicalDisclaimer.jsx    Reusable safety disclaimer
    Navbar.jsx               Responsive navigation
    ParameterTable.jsx       Lab parameter table with explanations
  data/
    referenceRanges.js       20+ medical parameter definitions
    sampleReport.js          Demo patient and report data
  pages/
    AboutPage.jsx            About & methodology
    AnalysisPage.jsx         Analysis input form
    HistoryPage.jsx          Saved analyses
    LandingPage.jsx          Landing hero & features
    ResultDashboard.jsx      Full results view
  services/
    aiService.js             AI/fallback insights engine
    healthAnalyzer.js        BMI, vitals, payload builder
    ocrService.js            PDF.js + Tesseract OCR
    reportAnalyzer.js        Parameter extraction & comparison
    symptomAnalyzer.js       Rule-based symptom engine
  utils/
    historyStorage.js        localStorage CRUD
  App.jsx                    Main app + routing state
api/
  analyze.js                 Vercel serverless AI proxy function
```

AI Health Analyzer is an educational prototype. It does not provide medical diagnosis or treatment.
