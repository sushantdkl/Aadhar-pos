@echo off
echo.
echo ========================================
echo   Firebase Composite Index Creator
echo ========================================
echo.
echo This will deploy the required Firestore indexes.
echo.
echo Creating indexes for:
echo - blog_posts collection (status + publishedAt)
echo - job_postings collection (status + postedAt)
echo - payments collection (shop_id + payment_date)
echo - payments collection (restaurant_id + payment_date)
echo.
pause
echo.
echo Checking for Firebase CLI...
where firebase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install Firebase CLI.
        echo Please install manually: npm install -g firebase-tools
        echo Then run this script again.
        pause
        exit /b 1
    )
)

echo.
echo Deploying indexes from firestore.indexes.json...
call firebase deploy --only firestore:indexes --project nexus-d0c28

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo Indexes are being created in the background.
    echo This may take 5-10 minutes to complete.
    echo.
    echo You can check progress at:
    echo https://console.firebase.google.com/project/nexus-d0c28/firestore/indexes
) else (
    echo.
    echo ========================================
    echo   Deployment Failed
    echo ========================================
    echo.
    echo ALTERNATIVE: Create indexes manually
    echo 1. Open: https://console.firebase.google.com/project/nexus-d0c28/firestore/indexes
    echo 2. Click "Add Index" and create each index from firestore.indexes.json
    echo.
    echo OR click the link from the error message in your console
)
echo.
pause
