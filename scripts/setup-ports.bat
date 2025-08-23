@echo off
REM FixMyEvent Port Configuration Setup Script for Windows
REM This script sets up the new port configuration system

echo 🚀 Setting up FixMyEvent Port Configuration System...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the FixMyEvent project root directory
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_VERSION=%%a
    set NODE_VERSION=!NODE_VERSION:~1!
)

if !NODE_VERSION! lss 18 (
    echo [ERROR] Node.js version 18 or higher is required. Current version: 
    node -v
    pause
    exit /b 1
)

echo [SUCCESS] Node.js version: 
node -v

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install

REM Install concurrently if not already installed
npm list concurrently >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing concurrently package...
    call npm install concurrently
)

REM Validate port configuration
echo [INFO] Validating port configuration...
call node scripts/validate-ports.js
if %errorlevel% neq 0 (
    echo [ERROR] Port configuration validation failed!
    pause
    exit /b 1
)
echo [SUCCESS] Port configuration validation passed!

REM Generate ports summary
echo [INFO] Generating ports summary...
call npm run ports:summary

REM Check if all required files exist
echo [INFO] Checking configuration files...
set REQUIRED_FILES=ports.config.js scripts/manage-ports.js scripts/validate-ports.js PORTS_SUMMARY.md PORTS_DOCUMENTATION.md

for %%f in (%REQUIRED_FILES%) do (
    if exist "%%f" (
        echo ✓ %%f
    ) else (
        echo ✗ %%f (missing)
        echo [ERROR] Required file %%f is missing!
        pause
        exit /b 1
    )
)

REM Test port management commands
echo [INFO] Testing port management commands...
call npm run ports:status >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Port management commands working correctly!
) else (
    echo [WARNING] Port management commands may have issues
)

REM Show next steps
echo.
echo [SUCCESS] Port configuration setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Review the generated PORTS_SUMMARY.md file
echo 2. Read PORTS_DOCUMENTATION.md for detailed usage instructions
echo 3. Test the port management system:
echo    - npm run ports:status
echo    - npm run ports:start
echo    - npm run ports:stop
echo.
echo 🔧 Available Commands:
echo   npm run ports:start      - Start all services
echo   npm run ports:stop       - Stop all services
echo   npm run ports:status     - Show service status
echo   npm run ports:summary    - Generate ports summary
echo   npm run ports:validate   - Validate configuration
echo   npm run dev:all          - Start all development services
echo.
echo 📚 Documentation:
echo   - PORTS_DOCUMENTATION.md - Complete usage guide
echo   - PORTS_SUMMARY.md       - Port assignments summary
echo   - ports.config.js        - Port configuration source
echo.
echo [SUCCESS] Setup complete! 🎉
pause
