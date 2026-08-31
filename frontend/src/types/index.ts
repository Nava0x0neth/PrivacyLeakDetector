export type Assessment = 'EXPECTED' | 'CONTEXT-DEPENDENT' | 'SUSPICIOUS' | 'HIGH PRIVACY CONCERN';

export interface Permission {
  name: string;
  category: string;
  assessment: Assessment;
  description: string;
  declared: boolean; // Must always be true since this is static analysis
}

export interface Finding {
  permission: string;
  assessment: Assessment;
  whatItAllows: string;
  whyFlagged: string;
  evidence: string[];
  confidence: 'Low' | 'Medium' | 'High';
  privacyImpact: string;
}

export interface AppIdentity {
  name: string;
  packageName: string;
  version: string;
  targetSdk: number;
  minSdk: number;
  sha256: string;
}

export interface ReportSummary {
  high: number;
  suspicious: number;
  contextDependent: number;
  expected: number;
}

export interface RiskFactor {
  points: number;
  reason: string;
}

export interface PrivacyReport {
  app: AppIdentity;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: ReportSummary;
  permissions: Permission[];
  findings: Finding[];
  factors: RiskFactor[];
  manifestStats: {
    permissions: number;
    activities: number;
    services: number;
    receivers: number;
    providers: number;
  };
}
