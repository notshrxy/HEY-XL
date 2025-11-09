REM sample scripting for automatic IDLE Start-up
@echo off
REM Activate the virtual environment - comment line
call "%~dp0xlsxauto\Scripts\activate"

REM %~dp0 is used to activate the venv from where the batch file is placed (i.e. from the batch file's directory)

REM Open IDLE in editor mode (script mode) - REM is for comments
python -m idlelib -e
