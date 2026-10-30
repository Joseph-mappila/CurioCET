@echo off
rem CurioCET one-command dev launcher (Windows).
rem - Works from any directory: resolves the project root from this file.
rem - Creates server\.env from the template only when it is missing.
rem - NEVER overwrites or exports API keys. An existing server\.env is left untouched.
rem - Starts FastAPI in its own window, then runs Vite in this window.
setlocal EnableExtensions

set "ROOT=%~dp0"
set "SERVER=%ROOT%server"
set "CLIENT=%ROOT%client"
set "API_HOST=127.0.0.1"
set "API_PORT=8000"
set "WEB_PORT=5173"

echo [CurioCET] Project: %ROOT%

where node >nul 2>nul
if errorlevel 1 (
  echo [CurioCET] Node.js is required. Install Node.js 18+ and retry.
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [CurioCET] npm is required. Install Node.js 18+ and retry.
  exit /b 1
)

if not exist "%SERVER%\.env" (
  copy /Y "%SERVER%\.env.example" "%SERVER%\.env" >nul
  echo [CurioCET] Created server\.env from the template.
  echo [CurioCET] Add GEMINI_API_KEY in server\.env, or set MOCK_AI=1 there for demo mode.
) else (
  echo [CurioCET] Using existing server\.env ^(API keys are left untouched^).
  findstr /R /C:"^GEMINI_API_KEY=your_gemini_api_key_here" "%SERVER%\.env" >nul 2>nul
  if not errorlevel 1 (
    echo [CurioCET] WARNING: server\.env still contains the example key placeholder.
    echo [CurioCET] Replace it with a real key, or set MOCK_AI=1 for demo mode.
  )
)

if not exist "%SERVER%\.venv\Scripts\uvicorn.exe" (
  where uv >nul 2>nul
  if errorlevel 1 (
    echo [CurioCET] uv is required. Install it from https://docs.astral.sh/uv/ and retry.
    exit /b 1
  )
  pushd "%SERVER%"
  if not exist ".venv" (
    echo [CurioCET] Creating Python virtual environment with uv...
    call uv venv .venv
    if errorlevel 1 (
      popd
      exit /b 1
    )
  )
  echo [CurioCET] Installing backend dependencies...
  call uv pip install --python ".venv\Scripts\python.exe" -r requirements.txt
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

if not exist "%CLIENT%\node_modules" (
  echo [CurioCET] Installing frontend dependencies...
  pushd "%CLIENT%"
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

echo [CurioCET] Starting FastAPI at http://%API_HOST%:%API_PORT% ...
start "CurioCET API" /D "%SERVER%" cmd /k ""%SERVER%\.venv\Scripts\uvicorn.exe" main:app --host %API_HOST% --port %API_PORT% --reload"

timeout /t 2 /nobreak >nul

echo [CurioCET] Starting Vite at http://%API_HOST%:%WEB_PORT% ...
echo [CurioCET] Close the "CurioCET API" window to stop the backend.
pushd "%CLIENT%"
call npm run dev -- --host %API_HOST% --port %WEB_PORT%
popd

endlocal
