@echo off
setlocal
cd /d "%~dp0"
title CareNest - Java + MySQL (No Maven / No Tomcat)
echo ===============================================
echo  CARENEST - JAVA + MYSQL
 echo  No Maven and no Tomcat required
 echo ===============================================
where java >nul 2>&1
if errorlevel 1 (
 echo ERROR: Java is not installed or is not on PATH.
 pause
 exit /b 1
)
where javac >nul 2>&1
if errorlevel 1 (
 echo ERROR: Java JDK required. javac not found.
 pause
 exit /b 1
)
REM Set this if your MySQL root account has a password:
set "CARENEST_DB_USER=root"
set "CARENEST_DB_PASSWORD="
if not exist lib\mysql-connector-j.jar (
 echo Downloading official MySQL JDBC driver one time...
 powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing -Uri 'https://repo.maven.apache.org/maven2/com/mysql/mysql-connector-j/9.5.0/mysql-connector-j-9.5.0.jar' -OutFile 'lib\mysql-connector-j.jar'"
 if errorlevel 1 (
   echo Driver download failed. Check internet or see README_FIRST.txt for manual download.
   pause
   exit /b 1
 )
)
echo Compiling Java server...
javac -encoding UTF-8 Server.java
if errorlevel 1 (
 echo Java compilation failed.
 pause
 exit /b 1
)
echo Starting CareNest on port 8080...
java -cp ".;lib\mysql-connector-j.jar" Server
if errorlevel 1 echo The server failed to start. Read the error above.
pause
