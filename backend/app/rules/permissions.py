from typing import Dict, Any
from app.models.schemas import Assessment

# This is a scalable rule database for Android permissions.
# It can be expanded or loaded from an external JSON file in the future.

PERMISSION_DB: Dict[str, Dict[str, Any]] = {
    "android.permission.CAMERA": {
        "category": "Camera",
        "assessment": Assessment.CONTEXT_DEPENDENT,
        "whatItAllows": "Allows the application to capture images or video.",
        "whyFlagged": "Camera access can expose visual information. It is expected for camera apps but suspicious for others.",
        "privacyImpact": "Potential exposure of the user's surroundings and face.",
        "base_risk": 5
    },
    "android.permission.RECORD_AUDIO": {
        "category": "Microphone",
        "assessment": Assessment.CONTEXT_DEPENDENT,
        "whatItAllows": "Allows the application to access microphone input.",
        "whyFlagged": "Audio recording can eavesdrop on conversations.",
        "privacyImpact": "Potential exposure of ambient audio and conversations.",
        "base_risk": 8
    },
    "android.permission.ACCESS_FINE_LOCATION": {
        "category": "Location",
        "assessment": Assessment.CONTEXT_DEPENDENT,
        "whatItAllows": "Allows access to precise device location.",
        "whyFlagged": "Precise location allows detailed tracking of user movements.",
        "privacyImpact": "Tracking of user's precise physical movements and routines.",
        "base_risk": 7
    },
    "android.permission.ACCESS_COARSE_LOCATION": {
        "category": "Location",
        "assessment": Assessment.CONTEXT_DEPENDENT,
        "whatItAllows": "Allows access to approximate device location.",
        "whyFlagged": "Location access can be used to profile users geographically.",
        "privacyImpact": "Tracking of user's general city/neighborhood.",
        "base_risk": 4
    },
    "android.permission.READ_CONTACTS": {
        "category": "Contacts",
        "assessment": Assessment.HIGH_PRIVACY_CONCERN,
        "whatItAllows": "Allows the application to read contacts stored on the device.",
        "whyFlagged": "Contact access is often harvested for social graphing and spam.",
        "privacyImpact": "Exposure of complete address book and social graph.",
        "base_risk": 10
    },
    "android.permission.READ_SMS": {
        "category": "SMS",
        "assessment": Assessment.HIGH_PRIVACY_CONCERN,
        "whatItAllows": "Allows the application to read SMS messages.",
        "whyFlagged": "SMS access can intercept 2FA codes and private conversations.",
        "privacyImpact": "Exposure of private text messages and potential account takeover via 2FA interception.",
        "base_risk": 10
    },
    "android.permission.INTERNET": {
        "category": "Network",
        "assessment": Assessment.EXPECTED,
        "whatItAllows": "Allows network communication.",
        "whyFlagged": "This permission is extremely common and not inherently suspicious.",
        "privacyImpact": "Allows data to be sent off-device.",
        "base_risk": 0
    },
    "android.permission.READ_EXTERNAL_STORAGE": {
        "category": "Storage",
        "assessment": Assessment.SUSPICIOUS,
        "whatItAllows": "Allows reading from shared storage.",
        "whyFlagged": "Grants access to all user photos, documents, and downloads.",
        "privacyImpact": "Exposure of personal files and media.",
        "base_risk": 6
    },
    "android.permission.SYSTEM_ALERT_WINDOW": {
        "category": "System",
        "assessment": Assessment.HIGH_PRIVACY_CONCERN,
        "whatItAllows": "Allows an app to draw over other apps.",
        "whyFlagged": "Often used by malware to create fake login screens or tapjacking.",
        "privacyImpact": "High risk of phishing and screen overlay attacks.",
        "base_risk": 10
    }
}

DEFAULT_PERMISSION = {
    "category": "Other",
    "assessment": Assessment.EXPECTED,
    "whatItAllows": "Unknown permission.",
    "whyFlagged": "This permission is not in our sensitive database.",
    "privacyImpact": "Unknown",
    "base_risk": 0
}

def analyze_permissions(declared_permissions: list[str], package_name: str) -> dict:
    """
    Analyzes a list of permissions and returns the structured findings, risk score, etc.
    """
    permissions_out = []
    findings_out = []
    factors_out = []
    
    total_risk = 0
    counts = {"high": 0, "suspicious": 0, "contextDependent": 0, "expected": 0}
    
    # Simple context logic: if the package name implies the permission is normal
    is_calc = "calc" in package_name.lower()
    is_cam = "cam" in package_name.lower()
    
    for perm in declared_permissions:
        info = PERMISSION_DB.get(perm, DEFAULT_PERMISSION)
        
        assessment = info["assessment"]
        risk_score = info["base_risk"]
        
        # Contextual adjustments (very basic rule engine)
        if perm == "android.permission.CAMERA" and is_cam:
            assessment = Assessment.EXPECTED
            risk_score = 0
            factors_out.append({"points": -5, "reason": "Camera permission expected for camera apps."})
            
        if is_calc and risk_score > 0 and perm != "android.permission.INTERNET":
            # A calculator shouldn't need much
            if assessment != Assessment.HIGH_PRIVACY_CONCERN:
                assessment = Assessment.SUSPICIOUS
            risk_score += 5
            factors_out.append({"points": 5, "reason": f"{perm.split('.')[-1]} requested by a calculator app."})
        elif risk_score > 0:
            factors_out.append({"points": risk_score, "reason": f"Declared {perm.split('.')[-1]}"})

        permissions_out.append({
            "name": perm,
            "category": info["category"],
            "assessment": assessment,
            "description": info["whatItAllows"],
            "declared": True
        })
        
        if assessment in [Assessment.HIGH_PRIVACY_CONCERN, Assessment.SUSPICIOUS, Assessment.CONTEXT_DEPENDENT]:
            findings_out.append({
                "permission": perm,
                "assessment": assessment,
                "whatItAllows": info["whatItAllows"],
                "whyFlagged": info["whyFlagged"],
                "evidence": ["Declared in AndroidManifest.xml"],
                "confidence": "High",
                "privacyImpact": info["privacyImpact"]
            })
            
        # Update counts
        if assessment == Assessment.HIGH_PRIVACY_CONCERN:
            counts["high"] += 1
        elif assessment == Assessment.SUSPICIOUS:
            counts["suspicious"] += 1
        elif assessment == Assessment.CONTEXT_DEPENDENT:
            counts["contextDependent"] += 1
        else:
            counts["expected"] += 1
            
        total_risk += risk_score

    # Normalize risk score to 0-100
    final_score = min(max(total_risk * 2, 0), 100)
    
    if final_score > 75:
        risk_level = "CRITICAL"
    elif final_score > 50:
        risk_level = "HIGH"
    elif final_score > 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    return {
        "permissions": permissions_out,
        "findings": findings_out,
        "factors": factors_out,
        "summary": counts,
        "riskScore": final_score,
        "riskLevel": risk_level
    }
