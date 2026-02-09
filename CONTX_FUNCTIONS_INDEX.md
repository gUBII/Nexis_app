# CONTX Functions Index (Architecture-Oriented)

<div align="center">
  <span style="background:#7c2d12;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">FUNCTION MAP</span>
  <span style="background:#1d4ed8;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">USE-CASE GROUPED</span>
  <span style="background:#15803d;color:#fff;padding:4px 10px;border-radius:999px;font-weight:700;">API-LINKED</span>
</div>

## 1. High-Impact Function Hubs

### `src/screens/tabs/Dashboard.js`
Major orchestration functions:
- `fetchDataAndSend` -> prepares POST body for WebView cookie bridge.
- `fetchProfileData` -> pulls user profile data.
- `fetchBocData`, `fetchEodData`, `fetchIncidentData` -> dashboard counters.
- `fetchJobs`, `handleClockIn`, `handleClockOut` -> job workflow.
- `fetchTasks`, `handleUpdateTaskStatus` -> task workflow.
- `fetchAttendanceData` -> completed jobs/timesheet blocks.
- `fetchRecentActivity` -> recent activity feed.

### `src/components/Header.js`
Major orchestration functions:
- `fetchModuleData`, `fetchMenuData`, `fetchStockData` -> dynamic menu tree.
- `handleToggle`, `handleToggles` -> dashboard preference persistence.
- `openSidebar`, `closeSidebar`, `toggleMenu`, `toggleSubMenu`, `toggleSubSubMenu`.
- `renderSidebar` -> active/solution/modules segmented menu panel.

### `src/screens/AttendanceRecord.js`
Major orchestration functions:
- `requestLocationPermission`, `getCurrentLocation`, `captureImage`.
- `handleClockIn` -> camera + geolocation + multipart upload + background tracking start.
- `handleClockOut` -> camera + geolocation + fields validation + upload + background tracking stop.

### `src/screens/Webview.js`
Major orchestration functions:
- `fetchEodData`, `fetchBocData`, `fetchIncidentData` (paginated views).
- `changePage`, `changePage1`, `changePage2` pagination state controls.
- `renderPagination*` renderers for each dataset.

## 2. Authentication Function Chain

### `src/screens/Onboarding.js`
- `checkUserStatus` -> reads `hasSeenOnboarding` + `userToken` and routes to SignIn/TabNavigator.
- `completeOnboardings` / `completeOnboarding` -> onboarding completion flags.

### `src/screens/auth/SignIn.js`
- `handleSignIn` -> `POST /api/signin`, writes identity data to AsyncStorage.
- `fetchSolutions` -> `GET /api/solutions`, stores application modules.

### `src/screens/auth/SignUp.js`
- `handleWebViewMessage` -> consumes WebView signup success message, stores identity fields.

## 3. Jobs / Tasks Function Families

### Job lists
- `src/screens/MyJobs.js`: `fetchStorageData`, `fetchJobs`, `handleAcceptJob`.
- `src/screens/tabs/Myjob.js`: same pattern in tab context.

### Task lists
- `src/screens/Task.js`: `fetchTasks`, `handleUpdateTaskStatus`.
- `src/screens/tabs/Mytask.js`: same pattern for tab context.

## 4. Document + Lead Suite Function Pattern
Many entity screens follow a repeating function triad:
1. `handle<Document|Entity>Submit` (create)
2. `fetch<Entities>` (list)
3. `handle<Entity>Edit` + dedicated edit screen `handleUpdate`

Examples:
- `Call.js` + `EditCall.js`
- `Email.js` + `EditEmail.js`
- `Minutes.js` + `EditMinutes.js`
- `Cases.js` + `EditCases.js`
- `Quote.js` + `EditQuote.js`
- `Deal.js` + `EditDeal.js`
- `Contract.js` + `EditContract.js`
- `CampaignForm.js` / `ViewCampaign.js` / `EditCampaignForm.js`
- `LeadForm.js` / `ViewLead.js` / `EditLeadForm.js`

## 5. Background and Device Functions

### `src/screens/BackgroundLocationService.js`
- `initBackgroundLocationTracking`
- `sendLocation`
- `resetLocationStage`

### `src/screens/BackgroundExample.js`
- `toggleBackgroundTask` demo control for background service lifecycle.

### `src/screens/Nexisbot.js` and `src/screens/Nextbot.js`
- speech-recognition lifecycle handlers: start, stop, results, timer/state transitions.

## 6. Utility and State Functions

### `src/navigation/TabNavigator.js`
- `renderStatusBar`, `renderHeader`, `renderScreen`, `renderBottomTab`.
- Reload-on-double-tap behavior through `reloadKey`.

### `src/store/tabSlice.js`
- `setScreen` reducer action controls current tab context.

### `src/services/notificationService.js`
- `requestUserPermission`, `getFcmToken`, `saveFcmTokenToServer`.

## 7. Function Density Notes
Largest function-heavy files:
- `src/screens/tabs/Dashboard.js`
- `src/screens/webview2.js` (legacy server-like script)
- `src/components/Header.js`
- `src/screens/LeadForm.js`
- `src/screens/EodForm.js`
- `src/screens/IncidentForm.js`
- `src/screens/AttendanceRecord.js`

## 8. API-to-Function Pair Highlights
| Function | API |
|---|---|
| `handleSignIn` (`auth/SignIn`) | `POST /api/signin` |
| `fetchSolutions` (`auth/SignIn`) | `GET /api/solutions` |
| `fetchJobs` (`tabs/Dashboard`, `MyJobs`, `tabs/Myjob`) | `GET /api/get-jobs` |
| `handleClockIn` (`tabs/Dashboard`) | `POST /api/accept-job` |
| `handleClockIn` (`AttendanceRecord`) | `POST /api/clock-in` |
| `handleClockOut` (`AttendanceRecord`) | `POST /api/clock-out` |
| `fetchTasks` (`Task`, `tabs/Mytask`, `tabs/Dashboard`) | `GET /api/get-tasks` |
| `handleUpdateTaskStatus` (`Task`, `tabs/Mytask`, `tabs/Dashboard`) | `POST /api/update-task-status` |
| `fetchEodData` (`Webview`) | `GET /api/eod-pagination` |
| `fetchBocData` (`Webview`) | `GET /api/boc-pagination` |
| `fetchIncidentData` (`Webview`) | `GET /api/incident-pagination` |

## 9. Raw Full Function Inventory
Complete, source-line-level extraction:
- `CONTX_FUNCTIONS_RAW.txt`
