# Privacy Leak Detector

Privacy Leak Detector is a modern, static Android APK privacy analyzer. It analyzes an uploaded APK's `AndroidManifest.xml` without executing the application, identifying declared permissions and evaluating their potential privacy risks based on context and sensitive permission combinations.

## Features

- **No Execution Required:** Pure static analysis using `pyaxmlparser`.
- **Explainable Results:** Clearly distinguishes between *declared* permissions and *granted* permissions.
- **Risk Scoring Engine:** Categorizes permissions as `EXPECTED`, `CONTEXT-DEPENDENT`, `SUSPICIOUS`, or `HIGH PRIVACY CONCERN`.
- **Modern UI:** Built with Next.js and Tailwind CSS featuring a cybersecurity-inspired glassmorphic design and micro-animations.
- **FastAPI Backend:** Secure, fast backend built in Python.

## Project Structure

This is a monorepo containing both the frontend and backend applications.

- `frontend/`: Next.js React application.
- `backend/`: Python FastAPI application.

## Getting Started

### 1. Start the Backend (FastAPI)

Requires Python 3.9+

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend API will run at `http://127.0.0.1:8000`. You can view the interactive documentation at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend (Next.js)

Requires Node.js 18+

```bash
cd frontend
npm install
npm run dev
```
The frontend UI will run at `http://localhost:3000`. Open this URL in your browser, drag and drop an APK, and view the privacy report!

## Disclaimer

This tool performs static analysis. It identifies permissions that are requested/declared by the APK in its manifest. **It does not determine which permissions have actually been granted by the user on their device.**
