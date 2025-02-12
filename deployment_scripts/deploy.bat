@echo off
setlocal enabledelayedexpansion

:: Define paths
set "FRONTEND_DIR=front-end\my-app"
set "API_DIR=back-end\RESTful API"
set "CLI_DIR=cli-client"

echo Starting deployment...

:: Check if directories exist
if not exist "%FRONTEND_DIR%" (
    echo Error: Frontend directory not found
    exit /b 1
)

if not exist "%API_DIR%" (
    echo Error: API directory not found
    exit /b 1
)

if not exist "%CLI_DIR%" (
    echo Error: CLI directory not found
    exit /b 1
)

:: Check for package.json files
if not exist "%FRONTEND_DIR%\package.json" (
    echo Error: package.json not found in frontend directory
    exit /b 1
)

if not exist "%API_DIR%\package.json" (
    echo Error: package.json not found in API directory
    exit /b 1
)

if not exist "%CLI_DIR%\package.json" (
    echo Error: package.json not found in CLI directory
    exit /b 1
)

:: Install dependencies
echo Installing API dependencies...
pushd "%API_DIR%"
call npm install
popd

echo Installing frontend dependencies...
pushd "%FRONTEND_DIR%"
call npm install
popd

echo Installing CLI dependencies...
pushd "%CLI_DIR%"
call npm install
popd

:: Start services
echo Starting API...
start "" /B cmd /c "pushd "%API_DIR%" && npm start"

:: Delay to let API start
timeout /t 5 /nobreak >nul

echo Starting frontend...
start "" /B cmd /c "pushd "%FRONTEND_DIR%" && npm start"

:: Delay to let Frontend start
timeout /t 5 /nobreak >nul

:: Link CLI
echo Linking CLI...
pushd "%CLI_DIR%"
call npm link
popd

:: Delay to let CLI start
timeout /t 5 /nobreak >nul

echo Deployment complete.
