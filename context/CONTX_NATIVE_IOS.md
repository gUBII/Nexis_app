# CONTX Native iOS Context

<div align="center">
  <span style="background:#111827;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">iOS</span>
  <span style="background:#2563eb;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">PODS + XCODE</span>
</div>

## 1. Core Files
- `/Users/moofasa/Nexis_app/ios/Podfile`
- `/Users/moofasa/Nexis_app/ios/app/AppDelegate.mm`
- `/Users/moofasa/Nexis_app/ios/app/Info.plist`
- `/Users/moofasa/Nexis_app/ios/app.xcodeproj/project.pbxproj`

## 2. Podfile Snapshot
- Uses RN helper scripts with fallback for nested CLI path.
- Includes RN permissions setup script:
  - `require_relative '../node_modules/react-native-permissions/scripts/setup'`
- `setup_permissions` currently enables handlers:
  - `LocationAlways`, `LocationWhenInUse`, `Microphone`, `Notifications`, `SpeechRecognition`
- Flipper is disabled via `FlipperConfiguration.disabled`.
- Uses `FirebaseCore` and `GoogleUtilities` as modular headers.

## 3. AppDelegate Snapshot
`AppDelegate.mm` now includes defensive Firebase init:
- Checks if Firebase default app exists.
- Looks for `GoogleService-Info.plist` in bundle.
- Calls `[FIRApp configure]` only when plist exists.
- Logs warning if missing plist (avoids hard crash path).

## 4. Info.plist Runtime Permissions
Key declarations present:
- `NSLocationAlwaysAndWhenInUseUsageDescription`
- `NSLocationAlwaysUsageDescription`
- `NSLocationWhenInUseUsageDescription`
- `NSMicrophoneUsageDescription`
- `NSSpeechRecognitionUsageDescription`
- `UIBackgroundModes`: `location`, `fetch`

## 5. Physical Device Signing Notes
If Xcode shows bundle registration failure:
- Ensure `PRODUCT_BUNDLE_IDENTIFIER` is globally unique for your personal team.
- Keep `Automatically manage signing` enabled.

## 6. iOS Build Commands
```bash
cd /Users/moofasa/Nexis_app/ios
bundle install
bundle exec pod install

cd /Users/moofasa/Nexis_app
npx react-native run-ios --device "Farhan’s iPhone"
```

## 7. iOS Runtime Troubleshooting
Permission handler error path:
```bash
cd /Users/moofasa/Nexis_app
rm -rf ios/Pods ios/Podfile.lock
cd ios && bundle exec pod install && cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData
```
Then uninstall/reinstall app.

Firebase default app error path:
- Add `ios/app/GoogleService-Info.plist`
- Rebuild app from Xcode or CLI.

