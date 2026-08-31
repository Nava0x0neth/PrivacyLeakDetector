import { PrivacyReport } from "../types";

export async function analyzeApk(file: File): Promise<PrivacyReport> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to analyze APK");
  }

  return response.json();
}
