# CONTX Native Android Context

<div align="center">
  <span style="background:#3ddc84;color:#111;padding:4px 10px;border-radius:999px;font-weight:700;">ANDROID</span>
  <span style="background:#0f172a;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">GRADLE + MANIFEST</span>
</div>

## 1. Build Identity
- Namespace: `com.nexis365.saas`
- Application ID: `com.nexis365.saas`
- Compile SDK: `34`
- Target SDK: `34`
- Min SDK: `23`
- NDK: `25.1.8937393`
- Hermes: enabled

## 2. Build Config Notes
### Root Gradle
- Uses dynamic AGP/RN plugin coordinates from classpath entries.
- Kotlin plugin pinned to `1.8.0`.
- Google services plugin `4.3.14`.

### App Gradle
- Firebase BOM `33.5.1`
- Firebase Messaging `23.4.1`
- Flipper debug deps still enabled.
- Native modules gradle path fallback implemented:
  - first `node_modules/@react-native-community/cli-platform-android/native_modules.gradle`
  - fallback `node_modules/react-native/node_modules/...`

## 3. Android Manifest
Key permissions include:
- `INTERNET`
- `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`
- `FOREGROUND_SERVICE`
- `RECORD_AUDIO`
- `POST_NOTIFICATIONS`

Notable app flags:
- `android:usesCleartextTraffic="true"`
- `android:allowBackup="false"`

## 4. Known Android Caveats
- Release build type currently signs with debug keystore config.
- Cleartext traffic enabled globally (review before production).

## 5. Build Commands
```bash
cd /Users/moofasa/Nexis_app
npm run android
```

Clean:
```bash
cd /Users/moofasa/Nexis_app/android
./gradlew clean
```

