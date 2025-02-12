@echo off
setlocal enabledelayedexpansion

:: Function to kill node processes listening on a specific port
:kill_node_process_by_port
set PORT=%1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    set PID=%%a
    echo Killing node process listening on port %PORT% with PID !PID!...
    taskkill /F /PID !PID! >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        echo Failed to kill process on port %PORT%
    )
)
exit /b

:: Stop node processes running on specific ports
call :kill_node_process_by_port 3000
call :kill_node_process_by_port 9115

echo All specified ports have been checked.
exit /b
