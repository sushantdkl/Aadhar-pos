# Firestore Rules Deployment Guide

## ⚠️ IMPORTANT: Deploy Security Rules to Fix Blog & Careers Pages

The blog and careers pages require public read access to work. You need to deploy the updated Firestore security rules to Firebase.

## Quick Deploy (Windows)

Just double-click this file:
```
Deploy-Firestore-Rules.bat
```

## Manual Deploy

### Option 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database → Rules**
4. Copy the content from `firestore.rules` file
5. Paste it into the rules editor
6. Click **Publish**

### Option 2: Using Firebase CLI

1. Make sure Firebase CLI is installed:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):
```bash
firebase init firestore
```
- Select your Firebase project
- Accept the default `firestore.rules` file
- Accept the default `firestore.indexes.json` file

4. Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

## What the Rules Do

The updated `firestore.rules` file includes:

✅ **Public Read Access** for:
- `blog_posts` collection (all users can read published posts)
- `job_postings` collection (all users can read active jobs)

✅ **Admin-Only Write Access** for:
- All collections (only authenticated admins can create/modify)

✅ **Public Read for License Verification**:
- `restaurants` collection
- `licenses` collection

## Verification

After deploying, test by visiting:
- http://localhost:3000/blog
- http://localhost:3000/careers

You should no longer see "Missing or insufficient permissions" errors.

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Make sure you deployed the rules successfully
- Check Firebase Console → Firestore → Rules to verify they're published
- Wait a few seconds for rules to propagate

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Error: "No Firebase project selected"
```bash
firebase use --add
# Select your project from the list
```

## Security Notes

- Public read access is safe for blog posts and job listings
- Write access requires authentication (admin login)
- Sensitive collections (payments, leads, contacts) remain admin-only
- Each blog post and job can be filtered by status (published/draft, active/closed)
