import { PrivacyReport } from '../types';

export const demoReport: PrivacyReport = {
  app: {
    name: "Example Calculator",
    packageName: "com.example.calculator.demo",
    version: "1.0.42",
    targetSdk: 34,
    minSdk: 24,
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  riskScore: 72,
  riskLevel: 'HIGH',
  summary: {
    high: 1,
    suspicious: 1,
    contextDependent: 2,
    expected: 2
  },
  manifestStats: {
    permissions: 6,
    activities: 2,
    services: 1,
    receivers: 1,
    providers: 0
  },
  factors: [
    { points: 15, reason: "Contact access declared by a calculator app" },
    { points: 15, reason: "Microphone access declared" },
    { points: 10, reason: "Precise location requested" },
    { points: 5, reason: "Network access requested" },
    { points: -8, reason: "Camera permission appears contextually relevant for OCR calculator features" }
  ],
  permissions: [
    {
      name: "android.permission.READ_CONTACTS",
      category: "Contacts",
      assessment: "HIGH PRIVACY CONCERN",
      description: "Allows the application to read contacts stored on the device.",
      declared: true
    },
    {
      name: "android.permission.RECORD_AUDIO",
      category: "Microphone",
      assessment: "SUSPICIOUS",
      description: "Allows the application to access microphone input.",
      declared: true
    },
    {
      name: "android.permission.ACCESS_FINE_LOCATION",
      category: "Location",
      assessment: "CONTEXT-DEPENDENT",
      description: "Allows access to precise device location.",
      declared: true
    },
    {
      name: "android.permission.INTERNET",
      category: "Network",
      assessment: "CONTEXT-DEPENDENT",
      description: "Allows network communication. This permission is common and is not inherently suspicious.",
      declared: true
    },
    {
      name: "android.permission.CAMERA",
      category: "Camera",
      assessment: "EXPECTED",
      description: "Camera access may be expected depending on the application's purpose (e.g., scanning math problems).",
      declared: true
    },
    {
      name: "android.permission.VIBRATE",
      category: "Other",
      assessment: "EXPECTED",
      description: "Allows access to the vibrator.",
      declared: true
    }
  ],
  findings: [
    {
      permission: "android.permission.READ_CONTACTS",
      assessment: "HIGH PRIVACY CONCERN",
      whatItAllows: "Allows the application to read contacts stored on the device.",
      whyFlagged: "This application appears to be a calculator. Contact access is not obviously required for its core functionality and is highly unusual.",
      evidence: ["Declared in AndroidManifest.xml"],
      confidence: "High",
      privacyImpact: "Potential exposure of complete address book and social graph if the permission is actually granted by the user."
    },
    {
      permission: "android.permission.RECORD_AUDIO",
      assessment: "SUSPICIOUS",
      whatItAllows: "Allows the application to access microphone input.",
      whyFlagged: "Audio recording is rarely needed for a calculator. While it could be for voice commands, it warrants scrutiny.",
      evidence: ["Declared in AndroidManifest.xml"],
      confidence: "Medium",
      privacyImpact: "Potential exposure of ambient audio conversations when the app is active and permission is granted."
    },
    {
      permission: "android.permission.ACCESS_FINE_LOCATION",
      assessment: "CONTEXT-DEPENDENT",
      whatItAllows: "Allows access to precise device location.",
      whyFlagged: "Location access can be legitimate for targeted ads or localized math conventions, but should be reviewed whether it is necessary for advertised functionality.",
      evidence: ["Declared in AndroidManifest.xml"],
      confidence: "High",
      privacyImpact: "Tracking of user's precise physical movements."
    }
  ]
};
