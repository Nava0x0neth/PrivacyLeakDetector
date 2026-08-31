import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ScanningScreenProps {
  fileName: string;
  currentStep: number;
  steps: string[];
}

export function ScanningScreen({ fileName, currentStep, steps }: ScanningScreenProps) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      
      {/* Scanner Animation */}
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-4 border-surface rounded-2xl"></div>
        <motion.div 
          className="absolute inset-0 border-4 border-primary rounded-2xl"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />
        <div className="absolute inset-x-0 h-1 bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
        
        <div className="absolute inset-0 flex items-center justify-center text-primary/50">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-3">Analyzing APK...</h2>
      <p className="text-slate-400 mb-12 bg-surface/50 px-4 py-1.5 rounded-full font-mono text-sm border border-white/5">{fileName}</p>

      <div className="w-full max-w-md space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div 
              key={step} 
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-300 ${
                isCurrent ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="shrink-0">
                {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                {isCurrent && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
                {isPending && <CircleDashed className="w-6 h-6 text-slate-600" />}
              </div>
              <span className={`font-medium ${
                isCompleted ? 'text-slate-300' : 
                isCurrent ? 'text-white' : 
                'text-slate-500'
              }`}>
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
