@echo off
setlocal
cd /d "%~dp0"
set PORT=8000

echo.
echo  Volley Vendetta — lokaler Server
echo  Browser:  http://127.0.0.1:%PORT%/game.html
echo  Beenden: Strg+C
echo.

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  python -c "import uvicorn" 2>nul
  if not errorlevel 1 (
    start "" "http://127.0.0.1:%PORT%/game.html"
    python -m uvicorn index:app --host 127.0.0.1 --port %PORT%
    goto :eof
  )
  start "" "http://127.0.0.1:%PORT%/game.html"
  python -m http.server %PORT%
  goto :eof
)
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -3 -c "import uvicorn" 2>nul
  if not errorlevel 1 (
    start "" "http://127.0.0.1:%PORT%/game.html"
    py -3 -m uvicorn index:app --host 127.0.0.1 --port %PORT%
    goto :eof
  )
  start "" "http://127.0.0.1:%PORT%/game.html"
  py -3 -m http.server %PORT%
  goto :eof
)
where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" "http://127.0.0.1:%PORT%/game.html"
  npx --yes serve . -l %PORT%
  goto :eof
)

echo [Fehler] Kein passender Starter gefunden.
echo Installiere Python 3 und optional:  pip install uvicorn
echo Ohne uvicorn reicht:  python -m http.server %PORT%
echo.
pause
exit /b 1
