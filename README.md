# 🔥 POS Admin Central - Firebase Edition

Central admin panel for managing POS restaurant subscriptions with **cloud-based Firebase backend**.

## ✨ Features

- 🏢 Restaurant Management (Cloud-based)
- 🔑 License Generation & Tracking
- 💰 Payment Management
- 📊 Dashboard Analytics
- 🔐 Secure Admin Access
- ☁️ Firebase Firestore Database
- 🌍 Remote License Verification
- 📱 Mobile-Responsive Dashboard

## 🚀 Quick Start (5 Minutes)

### Option 1: Firebase Setup (Recommended)

**See [QUICK_START.md](./QUICK_START.md) for detailed 5-minute setup!**

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase (follow QUICK_START.md)
# - Create Firebase project
# - Get config and service account
# - Create .env.local

# 3. Initialize database
npm run firebase:init

# 4. Start server
npm run dev
```

### Option 2: SQLite (Legacy)

```bash
npm install
node init-db.js
npm run dev
```

Default login: **admin** / **admin123**

## 📁 Documentation

- 📖 [QUICK_START.md](./QUICK_START.md) - **Start here!** (5 min setup)
- 🔥 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed Firebase guide
- 🎉 [FIREBASE_MIGRATION_COMPLETE.md](./FIREBASE_MIGRATION_COMPLETE.md) - What's been done
- 🔄 Migration: `npm run firebase:migrate` (if you have existing SQLite data)

## 🌐 API Endpoints

### Firebase APIs (New)
- `POST /api/verify-license` - ✅ Verify POS license (Firebase)
- `GET /api/restaurants-firebase` - List restaurants (Firebase)
- `POST /api/restaurants-firebase` - Add restaurant (Firebase)

### Legacy APIs (Still work with SQLite)
- `POST /api/auth/login` - Admin login
- `GET /api/dashboard` - Dashboard stats
- `GET /api/restaurants` - List restaurants
- `POST /api/restaurants` - Add restaurant
- `POST /api/licenses/renew` - Renew license

## 🗄️ Database Options

### Firebase (Recommended for Production)
- ☁️ Cloud-hosted
- 🌍 Remote access
- 📈 Scalable
- 🔐 Secure
- 💾 Auto-backup

**Database:** Firebase Firestore  
**Collections:** `restaurants`, `licenses`, `payments`, `verification_logs`, `admin_users`

### SQLite (Legacy/Development)
- 💻 Local only
- 🏠 No internet needed
- 🛠️ Good for testing

**Database:** `databases/admin_central.db`

## 🎯 Port Configuration

- **Admin Panel:** Port **3001**
- **POS System:** Port **3000**

## 📦 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run firebase:init    # Initialize Firebase database
npm run firebase:migrate # Migrate SQLite to Firebase
```

## 🔐 Environment Variables

Create `.env.local`:

```env
# Firebase Config (Required for cloud features)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Admin Server URL (for POS systems)
NEXT_PUBLIC_ADMIN_SERVER_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your_secret_key
```

## 🚀 Deployment

### Deploy to Vercel (Easiest)
1. Push code to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📊 Firebase Collections Structure

```javascript
restaurants/
  {restaurantId}/
    name, location, contact_number, owner_name, status

licenses/
  {licenseKey}/  // Document ID = License Key
    restaurant_id, plan_type, expiry_date, status

payments/
  {paymentId}/
    restaurant_id, license_key, amount, payment_date

verification_logs/
  {logId}/
    license_key, ip_address, timestamp

admin_users/
  admin/
    username, password, email, role
```

## 🔄 Migration from SQLite

Already have data in SQLite? Easy migration:

```bash
npm run firebase:migrate
```

## 🎓 License Verification Flow

```
POS System → Activation Screen → Enter License Key
     ↓
Admin Server (Firebase) → Verify License
     ↓
Returns: Restaurant Info (name, location, contact, owner)
     ↓
POS System → Creates Unique Database → Ready to Use!
```

## 🆘 Support

- 📖 Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- 🐛 Test API with curl/Postman
- 📱 Verify Firebase Console
- 🔍 Check browser console for errors

## ✅ Production Checklist

- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Environment variables configured
- [ ] Service account key added
- [ ] Database initialized (`npm run firebase:init`)
- [ ] Admin credentials changed
- [ ] Deployed to cloud (Vercel/Firebase)
- [ ] POS systems updated with production URL
- [ ] Tested license activation end-to-end

---

**🎉 Now with Firebase! Manage your restaurants from anywhere!**
