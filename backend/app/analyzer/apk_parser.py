import os
import shutil
import tempfile
import hashlib
from typing import Dict, Any
from pyaxmlparser import APK
from app.rules.permissions import analyze_permissions

def get_file_hash(filepath: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def process_apk(filepath: str, original_filename: str) -> Dict[str, Any]:
    """
    Parses the APK safely without execution using pyaxmlparser.
    """
    try:
        # Initialize APK parser (this extracts Manifest and parses it)
        apk = APK(filepath)
        
        sha256 = get_file_hash(filepath)
        package_name = apk.package
        version = apk.version_name
        
        # pyaxmlparser might not have targetSdk directly as int easily if it's missing,
        # but usually it's in get_target_sdk_version()
        target_sdk = 0
        min_sdk = 0
        try:
            target_sdk = int(apk.get_target_sdk_version() or 0)
            min_sdk = int(apk.get_min_sdk_version() or 0)
        except:
            pass

        app_name = apk.application
        if not app_name:
            app_name = original_filename

        declared_permissions = apk.get_permissions()
        
        # Count components
        activities = len(apk.get_activities())
        services = len(apk.get_services())
        receivers = len(apk.get_receivers())
        providers = len(apk.get_providers())
        
        manifest_stats = {
            "permissions": len(declared_permissions),
            "activities": activities,
            "services": services,
            "receivers": receivers,
            "providers": providers
        }

        # Use rules engine to analyze permissions
        analysis = analyze_permissions(declared_permissions, package_name)
        
        return {
            "app": {
                "name": app_name,
                "packageName": package_name,
                "version": version or "Unknown",
                "targetSdk": target_sdk,
                "minSdk": min_sdk,
                "sha256": sha256
            },
            "riskScore": analysis["riskScore"],
            "riskLevel": analysis["riskLevel"],
            "summary": analysis["summary"],
            "manifestStats": manifest_stats,
            "factors": analysis["factors"],
            "permissions": analysis["permissions"],
            "findings": analysis["findings"]
        }

    except Exception as e:
        raise ValueError(f"Failed to parse APK: {str(e)}")
