# CONTX How To Run (Root-Level Comprehensive)

<div align="center">
  <span style="background:#1f6feb;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">RUNBOOK</span>
  <span style="background:#2ea043;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">ANDROID + IOS</span>
  <span style="background:#d29922;color:#111;padding:4px 10px;border-radius:999px;font-weight:700;">RN 0.73.x</span>
</div>

## 1. Prerequisites

### Mandatory
- Node.js `18` recommended (`.node-version`)
- npm (lockfile managed)
- Watchman (recommended on macOS)
- Xcode + iOS SDK (for iOS)
- Android Studio + Android SDK + platform tools (for Android)

### Native toolchains
- Ruby `>= 2.6.10` (`ios/Gemfile`)
- Bundler (`bundle install`)
- CocoaPods (`bundle exec pod install`)

## 2. Install Dependencies
```bash
cd /Users/moofasa/Nexis_app
npm install
```

Install iOS pods:
```bash
cd /Users/moofasa/Nexis_app/ios
bundle install
bundle exec pod install
cd /Users/moofasa/Nexis_app
```

## 3. Start Metro
```bash
cd /Users/moofasa/Nexis_app
npm start
```

## 4. Run Android
```bash
cd /Users/moofasa/Nexis_app
npm run android
```

## 5. Run iOS (Simulator or Physical Device)
Generic:
```bash
cd /Users/moofasa/Nexis_app
npm run ios
```

Physical device (example):
```bash
cd /Users/moofasa/Nexis_app
npx react-native run-ios --device "Farhan’s iPhone"
```

## 6. Required iOS Setup Notes

### A) Bundle identifier must be unique
If Xcode shows `Failed Registering Bundle Identifier`, set a unique bundle id in Signing settings (for your Apple Team).

### B) Firebase iOS config
If runtime logs show:
- `No Firebase App '[DEFAULT]' has been created`

Add:
- `/Users/moofasa/Nexis_app/ios/app/GoogleService-Info.plist`

Then rebuild the app.

### C) RN Permissions handler setup
Podfile already contains `setup_permissions(...)`. If runtime still shows:
- `No permission handler detected`

Run a clean reinstall:
```bash
cd /Users/moofasa/Nexis_app
rm -rf ios/Pods ios/Podfile.lock
cd ios && bundle exec pod install && cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData
```
Uninstall app from phone/simulator and rebuild.

## 7. First-Run Functional Checks
1. Launch flow: Splash -> Onboarding -> SignIn.
2. Auth writes AsyncStorage session keys.
3. Dashboard data loads from `https://app.nexis365.com/api/*`.
4. Notification permission prompt appears.
5. Attendance/location flow works without permission-module crash.

## 8. Known Security/Audit State
- Current production dependency audit state is typically:
  - `1 high` vulnerability (`fast-xml-parser`) transitive under React Native CLI chain.
- This may remain until RN transitive dependency graph changes or is overridden/waived.

## 9. Troubleshooting

### Metro cache reset
```bash
cd /Users/moofasa/Nexis_app
npx react-native start --reset-cache
```

### Android clean
```bash
cd /Users/moofasa/Nexis_app/android
./gradlew clean
```

### iOS clean
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
cd /Users/moofasa/Nexis_app/ios
rm -rf Pods Podfile.lock
bundle exec pod install
```

## 10. Useful Scripts
- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run lint`
- `npm run test`
- `npm run audit:ci`

