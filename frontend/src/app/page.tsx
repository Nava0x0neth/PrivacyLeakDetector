"use client";

import { useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { ScanningScreen } from "@/components/ScanningScreen";
import { ReportDashboard } from "@/components/ReportDashboard";
import { demoReport } from "@/lib/demoData";
import { analyzeApk } from "@/lib/api";
import { PrivacyReport } from "@/types";
import { Shield } from "lucide-react";

type AppState = "LANDING" | "SCANNING" | "REPORT" | "ERROR";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("LANDING");
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<PrivacyReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [scanStep, setScanStep] = useState<number>(0);

  const SCAN_STEPS = [
    "APK received & validated",
    "Uploading to analyzer...",
    "Analyzing AndroidManifest.xml & evaluating permissions",
    "Generating privacy report"
  ];

  const handleAnalyze = async () => {
    if (!file) return;
    setAppState("SCANNING");
    setScanStep(0); // Validated

    const startTime = Date.now();
    
    try {
      // Small artificial delay for UI transition smoothness, move to step 1
      await new Promise(r => setTimeout(r, 400));
      setScanStep(1); // Uploading
      
      const uploadPromise = analyzeApk(file);
      
      // We assume step 2 (Analyzing) starts very quickly after upload starts
      setTimeout(() => {
        if (appState === "SCANNING" && scanStep < 2) setScanStep(2);
      }, 800);

      const liveReport = await uploadPromise;
      
      setScanStep(3); // Generating report
      
      const elapsed = Date.now() - startTime;
      const minDisplayTime = 1500;
      if (elapsed < minDisplayTime) {
        await new Promise(r => setTimeout(r, minDisplayTime - elapsed));
      }

      setReport(liveReport);
      setAppState("REPORT");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to communicate with the server. Is the FastAPI backend running?");
      setAppState("ERROR");
    }
  };

  const handleDemo = async () => {
    setAppState("SCANNING");
    setScanStep(0);
    
    // Simulate real steps for demo
    for (let i = 1; i <= 3; i++) {
      await new Promise(r => setTimeout(r, 600));
      setScanStep(i);
    }
    await new Promise(r => setTimeout(r, 400));

    setReport(demoReport);
    setAppState("REPORT");
  };

  const handleReset = () => {
    setFile(null);
    setAppState("LANDING");
  };

  return (
    <main className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">Privacy Leak Detector</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        {appState === "LANDING" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Know what your Android app is asking for.
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Upload an APK and discover sensitive permissions, potential privacy concerns, and the evidence behind each finding.
              </p>
            </div>

            <UploadCard 
              file={file} 
              onFileSelect={setFile} 
              onAnalyze={handleAnalyze} 
              onDemo={handleDemo} 
            />

            {/* How it works section */}
            <div className="mt-32">
              <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "01", title: "Upload APK", desc: "Select an Android package file from your device." },
                  { step: "02", title: "Read Manifest", desc: "We extract and parse the AndroidManifest.xml." },
                  { step: "03", title: "Analyze Permissions", desc: "Our engine reviews declared permissions against context." },
                  { step: "04", title: "Explain Risks", desc: "We generate a transparent, explainable privacy report." }
                ].map((item, i) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="text-5xl font-black text-white/5 absolute -top-2 -right-2 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 relative z-10">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-24 text-center pb-8 border-t border-white/10 pt-8">
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                Analysis is based on the APK you provide. We do not claim to know which permissions are granted on your device. 
                Static analysis reflects what the application is capable of requesting, not necessarily its active behavior.
              </p>
            </div>
          </div>
        )}

        {appState === "SCANNING" && (
          <ScanningScreen 
            fileName={file?.name || "Example Calculator Demo"} 
            currentStep={scanStep}
            steps={SCAN_STEPS}
          />
        )}

        {appState === "ERROR" && (
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Analysis Failed</h2>
            <p className="text-slate-400 mb-8 max-w-md">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="bg-surface hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-full font-medium transition-all border border-white/10"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === "REPORT" && report && (
          <ReportDashboard report={report} onReset={handleReset} isDemo={!file} />
        )}
      </div>
    </main>
  );
}
