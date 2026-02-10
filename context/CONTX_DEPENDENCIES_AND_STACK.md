# CONTX Dependencies And Stack

<div align="center">
  <span style="background:#0f172a;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">STACK PROFILE</span>
  <span style="background:#0369a1;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">CURRENT SNAPSHOT</span>
</div>

## 1. Runtime Platform Versions
- React: `18.2.0`
- React Native: `0.73.x` (`0.73.11` resolved)
- Node target: `18` (recommended)
- Android compile/target SDK: `34`
- Min SDK: `23`
- Hermes: enabled

## 2. Dependency Groups

### Core app/runtime
- `react`
- `react-native`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@reduxjs/toolkit`
- `react-redux`

### Data + forms + storage
- `axios@1.13.5`
- `@react-native-async-storage/async-storage`
- `formik`
- `yup`
- `uuid`
- `react-native-uuid`

### UI + rendering
- `react-native-paper`
- `react-native-svg`
- `react-native-vector-icons`
- `react-native-fast-image`
- `react-native-linear-gradient`
- `react-native-modal`
- `react-native-snap-carousel`
- `@gorhom/bottom-sheet`

### Device/file/media
- `react-native-image-picker`
- `react-native-document-picker`
- `react-native-file-viewer`
- `react-native-fs`
- `react-native-html-to-pdf`
- `react-native-share`

### Location/background/permissions
- `react-native-location`
- `react-native-background-fetch`
- `react-native-background-actions`
- `@supersami/rn-foreground-service`
- `react-native-permissions`
- `@react-native-community/geolocation`
- `@react-native-community/netinfo`

### Messaging/notifications
- `@react-native-firebase/app@^20.0.0`
- `@react-native-firebase/messaging@^20.0.0`
- `react-native-push-notification`
- `@react-native-community/push-notification-ios@1.12.0`

### Web and voice
- `react-native-webview`
- `@react-native-voice/voice@^3.1.5`

## 3. Dev Toolchain
- `@react-native/metro-config`
- Babel/Jest/ESLint/TypeScript toolchain
- `audit-ci`
- `patch-package`

## 4. Script Surface (`package.json`)
- `android`: `react-native run-android`
- `ios`: `react-native run-ios`
- `start`: `react-native start`
- `lint`: `eslint .`
- `test`: `jest`
- `audit:ci`: `audit-ci --config ./audit-ci.jsonc`
- `postinstall`: `patch-package`

## 5. Current Dependency Security Note
- `npm audit --omit=dev` currently reports:
  - `1 high` advisory (`GHSA-37qj-frw5-hhjh`)
- Path is transitive under RN CLI tree:
  - `react-native -> @react-native-community/cli-platform-android/ios -> fast-xml-parser@4.5.3`
- Direct app dependency includes `fast-xml-parser@5.3.5`, but this does not replace RN’s nested transitive copy.

## 6. Removed/Deprecated Prior Claims (No Longer True)
- App dependency set no longer includes earlier junk entries like `"-"`, `pod`, `force`.
- Baseline is no longer RN `0.71.6`.

