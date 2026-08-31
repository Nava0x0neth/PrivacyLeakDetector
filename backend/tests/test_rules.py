from app.rules.permissions import analyze_permissions
from app.models.schemas import Assessment

def test_analyze_calculator_with_contacts():
    # Calculator app requesting contacts
    declared = ["android.permission.READ_CONTACTS", "android.permission.INTERNET"]
    package = "com.example.calculator"
    
    result = analyze_permissions(declared, package)
    
    assert result["riskLevel"] in ["HIGH", "CRITICAL"]
    assert result["summary"]["high"] == 1
    assert result["summary"]["expected"] == 1
    
    # Check that contact permission was flagged properly
    contact_finding = next(f for f in result["findings"] if f["permission"] == "android.permission.READ_CONTACTS")
    assert contact_finding["assessment"] == Assessment.HIGH_PRIVACY_CONCERN

def test_analyze_camera_app():
    # Camera app requesting camera
    declared = ["android.permission.CAMERA"]
    package = "com.example.camera"
    
    result = analyze_permissions(declared, package)
    
    # Because it's a camera app, the camera permission should be expected and risk should be low
    assert result["riskLevel"] == "LOW"
    assert result["summary"]["expected"] == 1
    
    # It shouldn't generate a finding since it's EXPECTED
    assert len(result["findings"]) == 0
