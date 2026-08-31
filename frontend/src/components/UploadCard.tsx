import { UploadCloud, File as FileIcon, X, AlertCircle, Beaker } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadCardProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  onDemo: () => void;
}

export function UploadCard({ file, onFileSelect, onAnalyze, onDemo }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.endsWith(".apk")) {
      setError("Please select a valid .apk file.");
      return false;
    }
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError("File size exceeds the 50MB limit.");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={cn(
          "glass-panel rounded-3xl p-8 md:p-12 transition-all duration-300 border-2 border-dashed",
          isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-white/10 hover:border-white/20",
          file ? "border-solid border-white/10" : ""
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center mb-6 shadow-lg border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Drop your APK here</h3>
            <p className="text-slate-400 mb-8">or click to browse from your device</p>
            
            <input 
              type="file" 
              accept=".apk" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
              >
                Choose APK
              </button>
              <button 
                onClick={onDemo}
                className="bg-surface hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-full font-medium transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95"
              >
                <Beaker className="w-4 h-4" />
                Try Demo Report
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-6">Accepted format: .apk • Max size: 50MB</p>

            {error && (
              <div className="mt-6 flex items-center gap-2 text-rose-400 bg-rose-500/10 px-4 py-3 rounded-xl text-sm w-full max-w-md animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 bg-surface/50 p-4 rounded-2xl border border-white/5 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <FileIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-slate-200">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => onFileSelect(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-8 flex gap-3 text-amber-200/90 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>
                <strong>Privacy Notice:</strong> We will only extract the <code className="bg-black/20 px-1 py-0.5 rounded text-amber-100">AndroidManifest.xml</code>. We do not claim to know which permissions are actually granted on your device.
              </p>
            </div>

            <button 
              onClick={onAnalyze}
              className="w-full bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Analyze APK
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
