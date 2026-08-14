# Firebase Index Auto-Creation

## Problem
Firebase requires composite indexes for queries that filter by one field and sort by another.

Error: `The query requires an index`

## Solution Options

### Option 1: Auto-Create via Error Link (EASIEST)
When you see the error, it includes a direct link to create the index:

1. Copy the full error URL from terminal
2. Paste in browser
3. Click "Create Index"
4. Wait 5-10 minutes for build

### Option 2: Manual Creation
1. Run: `Create-Firebase-Indexes.bat`
2. Follow on-screen instructions
3. Go to: https://console.firebase.google.com/project/nexus-d0c28/firestore/indexes
4. Click "Add Index"
5. Create these indexes:

**Index 1: Shop Payments**
- Collection: `payments`
- Fields:
  - `shop_id` (Ascending)
  - `payment_date` (Descending)

**Index 2: Restaurant Payments**
- Collection: `payments`
- Fields:
  - `restaurant_id` (Ascending)
  - `payment_date` (Descending)

### Option 3: Firebase CLI (if installed)
```bash
firebase deploy --only firestore:indexes
```

## Index Status Check
After creating, check status at:
https://console.firebase.google.com/project/nexus-d0c28/firestore/indexes

**Status States:**
- 🟡 Building (5-10 minutes)
- 🟢 Enabled (Ready to use)
- 🔴 Error (Check configuration)

## Current Indexes Needed
See `firestore.indexes.json` for the complete configuration:
- shop_id + payment_date (DESC)
- restaurant_id + payment_date (DESC)

These indexes enable:
- Fast payment history queries
- Sorted by most recent first
- Filtered by business ID
