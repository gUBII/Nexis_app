# CONTX Gaps And Risks

<div align="center">
  <span style="background:#991b1b;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">RISK REGISTER</span>
  <span style="background:#b91c1c;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">SECURITY + MAINTAINABILITY</span>
</div>

## 1. Critical / High-Risk Findings

### A. Legacy server code and credentials in app repo
- `/Users/moofasa/Nexis_app/src/screens/webview2.js` contains server-style code and sensitive literals.
- Risk: accidental credential leakage and audit failures.

### B. Hardcoded local/LAN API URLs in tracked source
- `http://192.168.1.195:3000/api/update-fcm`
- `http://192.168.1.105:3000/api/*`
- Risk: non-portable builds and insecure/local-network assumptions.

### C. Android cleartext traffic enabled
- `android:usesCleartextTraffic="true"` in manifest.
- Risk: plaintext transport allowed.

### D. Android release signing still uses debug keystore
- `android/app/build.gradle` release block points to debug signing config.
- Risk: non-production signing posture.

## 2. Medium-Risk Findings

### A. iOS Firebase setup is optional but required for push features
- App now avoids crash when plist is missing, but push features remain degraded until:
  - `/Users/moofasa/Nexis_app/ios/app/GoogleService-Info.plist` is added.

### B. One remaining npm advisory in RN transitive tree
- `GHSA-37qj-frw5-hhjh` (`fast-xml-parser`) remains under RN CLI transitive dependency chain.
- Risk: security gate noise and compliance friction.

### C. API surface still distributed
- Endpoints are still hardcoded across many screens/components.
- Risk: weak environment management and inconsistent error handling.

### D. Large monolithic screens/components
- Several high-churn files remain large and hard to test/change safely.

## 3. Reliability Risks
- Attendance flow couples location, background work, and API updates.
- Runtime stability depends on consistent native permission setup and platform-specific rebuild hygiene.

## 4. Test Coverage Risks
- Baseline test coverage remains limited.
- Critical flows (auth/session/attendance/error handling) still need dedicated tests.

## 5. Current Priority Queue
| Priority | Item |
|---|---|
| P0 | Remove sensitive backend-style code/secrets from client repo. |
| P1 | Replace LAN/hardcoded endpoints with centralized environment config. |
| P1 | Harden Android transport/signing for production. |
| P1 | Decide advisory policy for transitive `fast-xml-parser` issue (waive/override/upgrade path). |
| P2 | Expand targeted tests for auth, attendance, notifications, and navigation. |

