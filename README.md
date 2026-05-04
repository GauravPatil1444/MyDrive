# MyDrive 🗂️

A personal cloud storage web app built with React and Firebase — upload files, organize folders, and access your data from anywhere.

🔗 **Live Demo:** [mydrive-1444.web.app](https://mydrive-1444.web.app/)

---

## Features

- 🔐 **Authentication** — Sign up and log in with email & password via Firebase Auth
- 📁 **Folder Management** — Create nested folders to organize your files
- 📤 **File Upload** — Upload any file type with real-time progress tracking
- 📥 **File Download** — Download files with live download progress indicator
- 🗑️ **Delete Files & Folders** — Remove files or clear folder contents from cloud storage
- 🔍 **Search** — Instantly search files and folders by name
- 👤 **Profile** — Update display name and profile picture
- 🌙 **Dark / Light Mode** — Toggle between themes, persisted across sessions
- 📱 **Responsive Design** — Works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Backend / Auth | Firebase Authentication |
| Storage | Firebase Cloud Storage |
| Hosting | Firebase Hosting |
| Routing | React Router |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Firebase project with **Authentication** and **Storage** enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mydrive.git
cd mydrive

# Install dependencies
npm install
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Email/Password** sign-in under Authentication.
3. Enable **Cloud Storage** and set up rules.
4. Copy your Firebase config and create a `firebaseConfig.ts` in the project root:

```ts
// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Project Structure

```
src/
├── assets/               # Icons and images
├── components/
│   ├── Main.tsx          # Root component, context provider, file listing
│   ├── Navbar.tsx        # Main navbar with back navigation
│   ├── Navbar2.tsx       # Navbar for auth and profile pages
│   ├── Search.tsx        # Search bar, upload, and folder creation UI
│   ├── FileInfo.tsx      # File detail view with download/delete
│   ├── Authentication.tsx# Login and sign-up forms
│   └── Profile.tsx       # User profile and settings
firebaseConfig.ts         # Firebase initialization
```

