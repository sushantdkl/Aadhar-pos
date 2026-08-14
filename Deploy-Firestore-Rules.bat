@echo off
echo ==========================================
echo   Deploying Firestore Security Rules
echo ==========================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Firebase CLI is not installed!
    echo Please install it with: npm install -g firebase-tools
    echo Then run: firebase login
    pause
    exit /b 1
)

echo Checking Firebase login status...
firebase projects:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo You need to login to Firebase first.
    echo Running: firebase login
    firebase login
)

echo.
echo Deploying Firestore security rules...
firebase deploy --only firestore:rules

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo   SUCCESS: Firestore rules deployed!
    echo ==========================================
    echo.
    echo Your security rules are now active.
    echo Blog and Careers pages should now work properly.
) else (
    echo.
    echo ==========================================
    echo   ERROR: Failed to deploy rules
    echo ==========================================
    echo.
    echo Please check:
    echo 1. You are logged in to Firebase
    echo 2. Firebase project is initialized (run: firebase init)
    echo 3. The project ID matches your Firebase project
)

echo.
pause
