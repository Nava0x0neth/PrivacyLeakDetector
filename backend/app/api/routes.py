from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import tempfile
from app.models.schemas import PrivacyReport
from app.analyzer.apk_parser import process_apk

router = APIRouter()

@router.post("/analyze", response_model=PrivacyReport)
async def analyze_apk(file: UploadFile = File(...)):
    if not file.filename.endswith('.apk'):
        raise HTTPException(status_code=400, detail="Only .apk files are allowed.")
    
    # Save uploaded file to a temporary file
    try:
        fd, temp_path = tempfile.mkstemp(suffix=".apk")
        with os.fdopen(fd, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save uploaded file.")
    
    try:
        # Process the APK
        report_data = process_apk(temp_path, file.filename)
        return PrivacyReport(**report_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during analysis.")
    finally:
        # Ensure temporary file is always deleted
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

