CARENEST - JAVA + MYSQL (NO MAVEN, NO TOMCAT)
=============================================

WHAT THIS PACKAGE DOES
- Runs the existing CareNest HTML/CSS/JS website using Java's built-in HttpServer.
- Saves accounts, salted hashed passwords, login sessions, and appointments to MySQL.
- A returning patient can sign in again and view existing appointments.
- The initial signup logs the user in; session cookies last up to 30 days on the same browser.
- Doctor, admin, accountant and medical record pages are frontend demonstrations, NOT functional staff backends.

REQUIREMENTS
1. Java JDK 17 or later. You already appear to have JDK 26 installed.
2. MySQL Server 8+ running locally on port 3306 (e.g. MySQL installed directly or via XAMPP).
3. Internet connection for the FIRST run ONLY to download the official MySQL Connector/J JDBC driver.

FIRST TIME SETUP
1. Start MySQL Server.
2. Import schema.sql into MySQL Workbench or phpMyAdmin; it creates the 'carenest' database and tables.
3. If your MySQL root account has a password, right-click START_CARENEST.bat > Edit, then set:
       set "CARENEST_DB_USER=root"
       set "CARENEST_DB_PASSWORD=YOUR_PASSWORD"
   Leave the password empty only if MySQL really has a blank password.
4. Double-click START_CARENEST.bat. It fetches the official driver, compiles Java with javac, then starts the server.
5. Open EXACTLY http://localhost:8080/ in a browser.
6. Register as Patient, Doctor, Admin, or Accountant (age 18+). No staff code required.
7. After closing the browser, start the server again and return to the same address.

DO NOT: Open index.html directly, use VS Code Go Live/Live Server, or use port 5500/5501.
DO NOT: Use mvn clean package; Maven is not part of this project.

IF DOWNLOAD IS BLOCKED
Manually download MySQL Connector/J 9.5.0 from https://dev.mysql.com/downloads/connector/j/
Rename the jar to mysql-connector-j.jar and place it in this project's lib folder.

CHECK DATABASE STORAGE
MySQL commands:
  USE carenest;
  SELECT id,full_name,email FROM users;
  SELECT id,user_id,doctor,appointment_date,status FROM appointments;

LIMITATIONS
- Tested Java source compilation, asset paths, and static serving. Full MySQL-backed integration
  needs a running MySQL instance and driver on your computer.
- Local demonstration only: do not enter actual patient medical data.
- The java.sql/JDBC API is used; Java built-in HttpServer replaces Tomcat/Servlets. If your marking
  rubric explicitly requires Servlets, this simplified version does NOT satisfy that criterion.

ROLE-BASED DEMO
Choose a role at signup or login. Role is saved in MySQL. For convenience, there is NO staff verification code; this makes the project unsuitable for real-world hospital use.
