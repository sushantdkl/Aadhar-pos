    # 🚀 Quick Start: Firebase Setup (5 Minutes)

## 1️⃣ Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com/
2. Click "**+ Add project**"
3. Name: `pos-admin-system`
4. Click through (disable Analytics)
5. Wait for project creation

## 2️⃣ Enable Firestore (1 min)

1. In left sidebar: **Build → Firestore Database**
2. Click "**Create database**"
3. Select "**Production mode**"
4. Choose location (e.g., `asia-south1` for India)
5. Click "**Enable**"

## 3️⃣ Get Firebase Config (1 min)

1. Click **gear icon** (⚙️) → **Project settings**
2. Scroll to "**Your apps**" section
3. Click **Web icon** (</>)
4. App nickname: `POS Admin`
5. **Copy the config object** (looks like this):

```javascript
{
  apiKey: "AIza...",
  authDomain: "pos-admin-system.firebaseapp.com",
  projectId: "pos-admin-system",
  storageBucket: "pos-admin-system.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
}
```

## 4️⃣ Get Service Account Key (1 min)

1. Still in **Project settings**
2. Click "**Service accounts**" tab
3. Click "**Generate new private key**"
4. Click "**Generate key**" (JSON file downloads)
5. Save as `firebase-service-account.json` in the `pos-admin-central` folder

## 5️⃣ Configure Environment Variables

1. Create `.env.local` file in `pos-admin-central`:

```env
# Paste your Firebase config values here:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pos-admin-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pos-admin-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pos-admin-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Open the downloaded JSON file and copy ENTIRE content (as single line):
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"pos-admin-system",...entire json here...}

NEXT_PUBLIC_ADMIN_SERVER_URL=http://localhost:3001
JWT_SECRET=change_this_to_random_string
```

## 6️⃣ Initialize Database

```bash
cd pos-admin-central
node init-firebase.js
```

You'll see:
```
🔥 Initializing Firebase Database...
✓ Admin user created
✓ Created: The Wild Stars (POS-2025-...)
✓ Created: Spice Garden (POS-2025-...)
✓ Created: Ocean View Cafe (POS-2025-...)
✅ Firebase initialization complete!
```

## 7️⃣ Test It!

```bash
npm run dev
```

Open browser: http://localhost:3001
Login: `admin` / `admin123`

## ✅ Done! 

Your admin panel is now using Firebase! 🎉

---

## 🔄 Migrate Existing Data (Optional)

If you already have restaurants in SQLite:

```bash
node migrate-to-firebase.js
```

This will copy all data from SQLite to Firebase.

---

## 🌐 Deploy to Production

### Quick Deploy (Vercel):
1. Push to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy!

Your admin panel will be live at: `https://your-app.vercel.app`

---

## 📱 Update POS Systems

After deploying, update each POS system's `.env.local`:

```env
ADMIN_SERVER_URL=https://your-app.vercel.app
```

Restart POS, and it will verify licenses from your cloud server! 🚀
