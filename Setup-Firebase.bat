@echo off
cls
echo ========================================
echo    Firebase Setup Helper
echo    POS Admin Central
echo ========================================
echo.

echo This script will help you set up Firebase for the admin panel.
echo.
echo STEP 1: Create Firebase Project
echo   - Go to https://console.firebase.google.com/
echo   - Create a new project
echo   - Enable Firestore Database
echo.
echo STEP 2: Get Firebase Config
echo   - Add a Web App in Firebase Console
echo   - Copy the configuration
echo.
echo STEP 3: Download Service Account
echo   - Go to Project Settings ^> Service Accounts
echo   - Click "Generate new private key"
echo   - Save the JSON file as "firebase-service-account.json"
echo.
pause

echo.
echo Checking Firebase packages...
call npm list firebase firebase-admin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing Firebase packages...
    call npm install firebase firebase-admin
) else (
    echo Firebase packages already installed!
)

echo.
echo Creating .env.local file...
if not exist .env.local (
    copy .env.example .env.local
    echo Created .env.local - Please fill in your Firebase credentials!
) else (
    echo .env.local already exists!
)

echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Edit .env.local and add your Firebase config
echo 2. Place firebase-service-account.json in this folder
echo 3. Run: node init-firebase.js (to initialize database)
echo 4. Run: npm run dev (to start server)
echo.
echo See FIREBASE_SETUP.md for detailed instructions!
echo.
pause
