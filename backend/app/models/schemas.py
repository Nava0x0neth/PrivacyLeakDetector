from enum import Enum
from pydantic import BaseModel
from typing import List, Literal

class Assessment(str, Enum):
    EXPECTED = "EXPECTED"
    CONTEXT_DEPENDENT = "CONTEXT-DEPENDENT"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_PRIVACY_CONCERN = "HIGH PRIVACY CONCERN"

class Permission(BaseModel):
    name: str
    category: str
    assessment: Assessment
    description: str
    declared: bool = True

class Finding(BaseModel):
    permission: str
    assessment: Assessment
    whatItAllows: str
    whyFlagged: str
    evidence: List[str]
    confidence: Literal["Low", "Medium", "High"]
    privacyImpact: str

class AppIdentity(BaseModel):
    name: str
    packageName: str
    version: str
    targetSdk: int
    minSdk: int
    sha256: str

class ReportSummary(BaseModel):
    high: int
    suspicious: int
    contextDependent: int
    expected: int

class RiskFactor(BaseModel):
    points: int
    reason: str

class ManifestStats(BaseModel):
    permissions: int
    activities: int
    services: int
    receivers: int
    providers: int

class PrivacyReport(BaseModel):
    app: AppIdentity
    riskScore: int
    riskLevel: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    summary: ReportSummary
    permissions: List[Permission]
    findings: List[Finding]
    factors: List[RiskFactor]
    manifestStats: ManifestStats
