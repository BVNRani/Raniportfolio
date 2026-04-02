# 🎓 Dr. Venkata Naga Rani Bandaru – Academic Portfolio

A full-stack Academic Web Portfolio (AWP) application built with **React + Vite + Firebase**.

---

## ✨ Features

- **Dashboard** – Hero profile card, stats, recent publications & awards
- **Profile Management** – Edit bio, photo, contact info, research areas
- **Publications CRUD** – Add/Edit/Delete journals, conferences, book chapters
- **Patents CRUD** – Manage granted and filed patents
- **Awards & Achievements** – With photo/certificate upload per award
- **Research Projects & Grants** – Track project status and funding
- **Professional Experience** – Timeline view with full CRUD
- **Photo Gallery** – Drag-and-drop upload, lightbox view, delete
- **PDF Export** – One-click professional multi-page PDF portfolio
- **Firebase Auth** – Secure login to protect your admin panel

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies
```bash
cd dr-rani-portfolio
npm install
```

### Step 2: Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it (e.g. `dr-rani-portfolio`)
3. Enable **Google Analytics** (optional) → Create Project

### Step 3: Configure Firebase Services
In your Firebase project console:

**A) Authentication:**
- Go to **Authentication → Get Started**
- Enable **Email/Password** provider
- Go to **Users → Add User**
- Add your email (e.g. `venkatanagarani.b@vishnu.edu.in`) and set a password

**B) Firestore Database:**
- Go to **Firestore Database → Create Database**
- Choose **Start in Production Mode**
- Select nearest region (e.g. `asia-south1` for India)

**C) Storage:**
- Go to **Storage → Get Started**
- Follow prompts to enable

### Step 4: Add Firebase Config
1. In Firebase Console → **Project Settings** (⚙️ gear icon)
2. Scroll to **Your Apps** → Click **Web App** icon (`</>`)
3. Register app → Copy the `firebaseConfig` object
4. Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← your value
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Run the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) and log in with the credentials you set in Step 3A.

---

## 📦 Build for Production
```bash
npm run build
```
Output goes to `/dist` — deploy to Firebase Hosting, Netlify, or Vercel.

### Deploy to Firebase Hosting (optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select dist as public folder, SPA=yes
npm run build
firebase deploy
```

---

## 🗂️ Project Structure

```
dr-rani-portfolio/
├── src/
│   ├── firebase/
│   │   ├── config.js        ← 🔧 Your Firebase keys go here
│   │   └── services.js      ← All CRUD + Storage functions
│   ├── hooks/
│   │   └── useAuth.jsx      ← Authentication context
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── CrudModal.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PublicationsPage.jsx
│   │   ├── PatentsPage.jsx
│   │   ├── AwardsPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── GalleryPage.jsx
│   │   └── LoginPage.jsx
│   ├── utils/
│   │   └── generatePDF.js   ← Professional PDF generator
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            ← Deep Navy & Gold theme
├── firestore.rules
├── storage.rules
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔒 Security Notes
- All Firestore and Storage rules require authentication
- Never commit your `firebaseConfig` API keys to a public repository
- Consider using `.env` variables for production deployments

---

## 📄 PDF Export
Click **Export PDF** in the top bar at any time. The PDF includes:
- Cover page with photo, name, title, stats
- Professional Summary & Education
- Full Experience timeline
- All Publications (by type)
- Patents
- Awards & Achievements
- Research Projects & Grants
- Professional Memberships & Contact

---

## 🛠️ Tech Stack
- **React 18** + **Vite 5**
- **Firebase 10** (Firestore, Storage, Auth)
- **jsPDF** + **jspdf-autotable** for PDF generation
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Cormorant Garamond** + **Nunito Sans** typography

---

*Built with ❤️ for Dr. Venkata Naga Rani Bandaru, Associate Professor, Vishnu Institute of Technology, Bhimavaram*
