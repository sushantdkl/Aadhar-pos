# Firebase Setup Guide for POS Admin Panel

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `pos-admin-system` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

## 📱 Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Enter app nickname: `POS Admin Central`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need this!

```javascript
// Example configuration (yours will be different)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pos-admin-system.firebaseapp.com",
  projectId: "pos-admin-system",
  storageBucket: "pos-admin-system.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## 🔐 Step 3: Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll set rules later)
4. Select location: Choose closest to your users (e.g., `asia-south1` for India)
5. Click "Enable"

## 🛡️ Step 4: Set Firestore Security Rules

1. Go to **Firestore Database → Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection - only authenticated admins
    match /admin_users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Restaurants collection - allow read for license verification
    match /restaurants/{restaurantId} {
      allow read: if true; // Public read for license verification
      allow write: if request.auth != null; // Only admins can write
    }
    
    // Licenses collection - allow read for verification
    match /licenses/{licenseKey} {
      allow read: if true; // Public read for license verification
      allow write: if request.auth != null; // Only admins can write
    }
    
    // Payments collection - admin only
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }
    
    // Verification logs - allow write for logging
    match /verification_logs/{logId} {
      allow read: if request.auth != null;
      allow write: if true; // Allow POS systems to log verifications
    }
  }
}
```

3. Click "Publish"

## 🔑 Step 5: Generate Service Account Key

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. **Keep this file safe!** It contains admin credentials

## ⚙️ Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase config:

```env
# From Firebase Web App Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pos-admin-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pos-admin-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pos-admin-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Service Account (paste as single line, no line breaks)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"pos-admin-system",...}

# Or set database URL
FIREBASE_DATABASE_URL=https://pos-admin-system.firebaseio.com

# Admin Server URL
NEXT_PUBLIC_ADMIN_SERVER_URL=http://localhost:3001

# JWT Secret (change this!)
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
```

## 🗄️ Step 7: Initialize Database

Run the initialization script to create sample data:

```bash
node init-firebase.js
```

This will create:
- Admin user (username: `admin`, password: `admin123`)
- 3 sample restaurants with licenses
- Initial payment records

## 🧪 Step 8: Test the Setup

1. Start the admin server:
   ```bash
   npm run dev
   ```

2. Test the verify-license API:
   ```bash
   curl -X POST http://localhost:3001/api/verify-license \
     -H "Content-Type: application/json" \
     -d '{"license_key": "POS-2025-1-XXXXXX"}'
   ```

3. Expected response:
   ```json
   {
     "valid": true,
     "status": "active",
     "expiry_date": "2026-01-12T...",
     "days_remaining": 365,
     "restaurant": {
       "name": "The Wild Stars",
       "location": "Mumbai, Maharashtra",
       "contact_number": "+91 98765 43210",
       "contact_email": "contact@thewildstars.com",
       "owner_name": "Rajesh Kumar"
     },
     "plan_type": "monthly"
   }
   ```

## 🚀 Step 9: Deploy to Production (Optional)

### Option 1: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize hosting:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Option 2: Vercel/Netlify

1. Push code to GitHub
2. Import project in Vercel/Netlify
3. Add environment variables from `.env.local`
4. Deploy!

## 🔄 Step 10: Update POS System

Update the POS system's environment variable:

```env
# In pos-restaurent-system/.env.local
ADMIN_SERVER_URL=https://your-deployed-admin-url.com
# or
ADMIN_SERVER_URL=http://localhost:3001  # for local testing
```

## 📊 Firebase Collections Structure

### `restaurants` collection
```javascript
{
  id: "auto-generated-id",
  name: "Restaurant Name",
  location: "City, State",
  contact_number: "+91 98765 43210",
  contact_email: "email@restaurant.com",
  owner_name: "Owner Name",
  status: "active", // active, suspended, inactive
  created_at: "ISO date",
  updated_at: "ISO date"
}
```

### `licenses` collection (document ID = license_key)
```javascript
{
  restaurant_id: "restaurant-doc-id",
  license_key: "POS-2025-1-XXXXXX",
  plan_type: "monthly", // monthly, semi_annual, annual
  start_date: "ISO date",
  expiry_date: "ISO date",
  status: "active",
  grace_period_days: 5,
  last_verified: "ISO date",
  created_at: "ISO date"
}
```

### `payments` collection
```javascript
{
  restaurant_id: "restaurant-doc-id",
  license_key: "POS-2025-1-XXXXXX",
  amount: 999,
  plan_type: "monthly",
  payment_date: "ISO date",
  payment_method: "cash", // cash, card, upi, initial
  status: "completed",
  created_at: "ISO date"
}
```

### `verification_logs` collection
```javascript
{
  license_key: "POS-2025-1-XXXXXX",
  restaurant_id: "restaurant-doc-id",
  verification_status: "valid", // valid, expired
  ip_address: "192.168.1.1",
  timestamp: "ISO date"
}
```

### `admin_users` collection
```javascript
{
  username: "admin",
  password: "bcrypt-hashed-password",
  email: "admin@possystem.com",
  role: "super_admin",
  created_at: "ISO date"
}
```

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Firestore database enabled
- [ ] Security rules configured
- [ ] Service account key downloaded
- [ ] Environment variables set
- [ ] Firebase packages installed (`npm install`)
- [ ] Database initialized (`node init-firebase.js`)
- [ ] Admin server running
- [ ] License verification tested
- [ ] POS system connected to admin server

## 🐛 Troubleshooting

### Error: "Firebase app not initialized"
- Check `.env.local` has all required variables
- Restart the dev server after adding env variables

### Error: "Permission denied"
- Check Firestore security rules
- Verify service account key is correct

### Error: "CORS error"
- Add CORS headers to API routes (already included)
- Check admin server URL is correct

### License verification fails
- Verify admin server is running
- Check Firebase collections have data
- Test API endpoint directly with curl/Postman

## 📞 Support

For issues:
1. Check Firebase Console for errors
2. Review server logs
3. Test API endpoints individually
4. Verify environment variables

---

**🎉 Setup Complete!** Your POS system is now using Firebase for cloud-based license management!
