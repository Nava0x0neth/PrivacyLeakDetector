import { PrivacyReport } from "../types";

export async function analyzeApk(file: File): Promise<PrivacyReport> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  console.log("API STATUS:", response.status);
  console.log(
    "API CONTENT TYPE:",
    response.headers.get("content-type")
  );

  const responseText = await response.text();

  console.log("API RESPONSE:", responseText);

  if (!response.ok) {
    let errorData: any = {};

    try {
      errorData = JSON.parse(responseText);
    } catch { }

    throw new Error(
      errorData.detail || "Failed to analyze APK"
    );
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error("Backend returned invalid JSON");
  }
}