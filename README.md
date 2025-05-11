````markdown
# Triply Onboard — Multi-Step User Onboarding Flow

A Vue 3 + Vite project demonstrating a robust, three-step onboarding wizard for SaaS dashboards. Features include:

- **Step 1:** Personal details + profile image upload (JPG/PNG ≤ 2 MB)
- **Step 2:** Business details + logo upload + industry dropdown (fetched from mock API) + document upload (PDF ≤ 5 MB)
- **Step 3:** Email verification code flow + summary + final submission + success panel
- **Global state:** Pinia store (current step, payload, loading & error states)
- **Validation:** Zod schemas for all form inputs
- **Autosave:** LocalStorage persistence of form state (excluding raw file blobs)
- **Testing:** Vitest + Vue Test Utils unit tests for Step 1

---

## 🛠️ Setup & Run

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
````

---

## 🔌 Mock API Strategy

All API interactions are mocked in [`src/api/mockApi.ts`](src/api/mockApi.ts):

* `fetchIndustriesMock()` simulates a 500 ms fetch of industry names.
* `sendCodeMock()` simulates sending a 6-digit email code (success/failure toggle).
* `submitOnboardingMock()` simulates final payload submission (success/failure toggle).

These mocks are orchestrated by Pinia actions in `store/onboarding.ts`. You can override `simulateError` flags to test error-handling flows. No external service calls are made.

---

## 💾 Autosave Behavior

We persist Pinia state (excluding raw `File`/`Blob` objects) to `localStorage` via a Pinia plugin:

* **What’s saved:** All form fields *except* actual file binaries.
* **On reload:** Stored text, selections, and boolean flags rehydrate the UI.
* **Limitation:** Browsers cannot JSON-stringify `File`/`Blob` objects. Users must re-upload logo/profile/document files after a page refresh. We surface a gentle “Please re-upload…” prompt when the plugin restores a non-`File` placeholder.

---

## 🧪 Testing Instructions

### Unit Tests

We use **Vitest** & **Vue Test Utils** to validate:

* Zod schema enforcement (required fields, format, file size/type)
* Prop-driven `complete` emits on valid data
* File-input error handling (wrong type, oversized)

#### Run all tests

```bash
# Run in watch mode
yarn test

# Run once, CI-style
yarn test --run
```

Test files live under `tests/`, for example `tests/Step1PersonalDetails.spec.ts`.

---

### Project Structure

```
src/
├── api/                   # mockApi.ts
├── components/            # Step1, Step2, Step3, Layout, SidebarStepper
├── composables/           # useEmailVerification.ts
├── schemas/               # Zod validators
├── store/                 # Pinia onboarding store & plugin
├── utils/                 # localStorage helpers
└── App.vue, main.ts, etc.
tests/                     # Vitest + Vue Test Utils specs
```

