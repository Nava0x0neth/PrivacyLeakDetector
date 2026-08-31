import { PrivacyReport, Permission } from "@/types";
import { AlertTriangle, ShieldAlert, ShieldCheck, Shield, ChevronDown, ChevronRight, Activity, Smartphone, Info, Copy, Check } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ReportDashboard({ report, onReset, isDemo }: { report: PrivacyReport, onReset: () => void, isDemo?: boolean }) {
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleFinding = (permission: string) => {
    setExpandedFindings(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const copyReportToClipboard = async () => {
    const text = `# Privacy Leak Detector Report
**App:** ${report.app.name} (${report.app.packageName})
**Version:** ${report.app.version}
**Risk Score:** ${report.riskScore}/100 (${report.riskLevel})

## Summary
- High Concern: ${report.summary.high}
- Suspicious: ${report.summary.suspicious}
- Context-Dependent: ${report.summary.contextDependent}
- Expected: ${report.summary.expected}

## Key Findings
${report.findings.map(f => `- **${f.permission.split('.').pop()}** (${f.assessment}): ${f.whyFlagged}`).join('\n')}

*Disclaimer: This analysis identifies permissions declared by the APK. It does not determine which permissions have actually been granted.*
`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'HIGH': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'LOW': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getAssessmentStyles = (assessment: string) => {
    switch (assessment) {
      case 'HIGH PRIVACY CONCERN': return 'text-status-high bg-status-high/10 border-status-high/20';
      case 'SUSPICIOUS': return 'text-status-suspicious bg-status-suspicious/10 border-status-suspicious/20';
      case 'CONTEXT-DEPENDENT': return 'text-status-context bg-status-context/10 border-status-context/20';
      case 'EXPECTED': return 'text-status-expected bg-status-expected/10 border-status-expected/20';
      default: return 'text-slate-400 bg-surface border-white/10';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
      
      {/* Top Header Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analysis Report</h1>
        <div className="flex gap-3">
          <button 
            onClick={copyReportToClipboard}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-surface hover:bg-surface/80 px-4 py-2 rounded-lg transition-colors border border-white/5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button 
            onClick={onReset}
            className="text-sm text-white bg-primary hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            Analyze Another APK
          </button>
        </div>
      </div>

      {isDemo && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">DEMO DATA — NOT A REAL SECURITY ANALYSIS</h4>
            <p className="text-sm opacity-90">This is an example report for a hypothetical &quot;Calculator&quot; app that requests excessive permissions, used to demonstrate the UI.</p>
          </div>
        </div>
      )}

      {/* Hero Dashboard Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* App Identity Card */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center border border-white/10">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{report.app.name}</h2>
                <p className="text-slate-400 font-mono text-sm">{report.app.packageName}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
            <div>
              <p className="text-xs text-slate-500 mb-1">Version</p>
              <p className="font-medium text-slate-200">{report.app.version}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Target SDK</p>
              <p className="font-medium text-slate-200">{report.app.targetSdk}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Min SDK</p>
              <p className="font-medium text-slate-200">{report.app.minSdk}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Permissions</p>
              <p className="font-medium text-slate-200">{report.manifestStats.permissions} Declared</p>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent"></div>
          <h3 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider relative z-10">Privacy Risk Score</h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-4 z-10">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" className="stroke-surface fill-none" strokeWidth="8" />
              <circle cx="64" cy="64" r="60" className="stroke-rose-500 fill-none transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * report.riskScore) / 100} strokeLinecap="round" />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-black text-white">{report.riskScore}</span>
              <span className="text-xs text-slate-500 block mt-1">/ 100</span>
            </div>
          </div>
          
          <div className={cn("px-4 py-1.5 rounded-full border font-bold tracking-wide z-10", getRiskColor(report.riskLevel))}>
            {report.riskLevel}
          </div>
        </div>
      </div>

      {/* Crucial Disclaimer */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-blue-200/90 text-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
        <p>
          <strong>Important Distinction:</strong> The permissions listed below are <strong>declared</strong> by the APK in its manifest file. This indicates what the application <em>can ask for</em>, but <strong>does not indicate whether the user has granted them</strong> on their device.
        </p>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "High Concern", count: report.summary.high, color: "text-status-high bg-status-high/5 border-status-high/20", icon: ShieldAlert },
          { label: "Suspicious", count: report.summary.suspicious, color: "text-status-suspicious bg-status-suspicious/5 border-status-suspicious/20", icon: Activity },
          { label: "Context-Dependent", count: report.summary.contextDependent, color: "text-status-context bg-status-context/5 border-status-context/20", icon: Shield },
          { label: "Expected", count: report.summary.expected, color: "text-status-expected bg-status-expected/5 border-status-expected/20", icon: ShieldCheck },
        ].map((item, i) => (
          <div key={i} className={cn("rounded-xl p-4 border flex items-center justify-between", item.color)}>
            <div className="flex items-center gap-2">
              <item.icon className="w-5 h-5 opacity-80" />
              <span className="font-medium text-sm opacity-90">{item.label}</span>
            </div>
            <span className="text-xl font-bold">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Findings Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-white/10 pb-4">Key Findings</h3>
        
        {report.findings.map((finding, idx) => (
          <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div 
              className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-start gap-4"
              onClick={() => toggleFinding(finding.permission)}
            >
              <div className="mt-1">
                {expandedFindings[finding.permission] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h4 className="font-mono font-semibold text-slate-200 break-all">{finding.permission.split('.').pop()}</h4>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getAssessmentStyles(finding.assessment))}>
                    {finding.assessment}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{finding.whatItAllows}</p>
              </div>
            </div>
            
            {expandedFindings[finding.permission] && (
              <div className="p-6 pt-0 border-t border-white/5 bg-black/20 text-sm">
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> 
                      Why we flagged it
                    </h5>
                    <p className="text-slate-400 leading-relaxed mb-6">{finding.whyFlagged}</p>
                    
                    <h5 className="font-semibold text-slate-300 mb-2">Privacy Impact</h5>
                    <p className="text-slate-400 leading-relaxed">{finding.privacyImpact}</p>
                  </div>
                  <div className="bg-surface/50 rounded-xl p-4 border border-white/5 h-fit">
                    <h5 className="font-semibold text-slate-300 mb-3 text-xs uppercase tracking-wider">Evidence & Meta</h5>
                    <ul className="space-y-3">
                      {finding.evidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2 text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Confidence: <strong className="text-slate-300">{finding.confidence}</strong></span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-400 pt-2 border-t border-white/5 mt-2">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-xs">Reminder: Declaring this permission does not prove that the application is currently using it or has been granted access by the user.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Permission Table */}
      <div className="space-y-6 mt-12 pt-12 border-t border-white/10">
        <h3 className="text-xl font-bold">All Declared Permissions</h3>
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface/80 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-300">Permission</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Assessment</th>
                <th className="px-6 py-4 font-semibold text-slate-300 w-full">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {report.permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-300 break-all whitespace-normal min-w-[200px]">{perm.name.split('.').pop()}</td>
                  <td className="px-6 py-4 text-slate-400">{perm.category}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded text-xs font-bold border", getAssessmentStyles(perm.assessment))}>
                      {perm.assessment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 whitespace-normal min-w-[300px] text-xs">
                    {perm.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future Code Analysis Teaser */}
      <div className="mt-12 bg-gradient-to-r from-surface to-primary/10 border border-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h3 className="text-xl font-bold mb-2 relative z-10">Code Analysis (Coming Soon)</h3>
        <p className="text-slate-400 max-w-2xl mx-auto mb-6 relative z-10">
          Future versions can inspect decompiled application code to determine whether sensitive APIs associated with declared permissions actually appear to be used in the codebase.
        </p>
        <button disabled className="bg-surface/50 border border-white/10 text-slate-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed relative z-10">
          Not available in this version
        </button>
      </div>
      
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
