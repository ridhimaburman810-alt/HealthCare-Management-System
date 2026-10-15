CareNest — Hospital Management System

CareNest is a web-based Hospital Management System developed as a college DBMS project using Java, JDBC, and MySQL.

The project provides a simple platform for managing user accounts, patient appointments, and role-based dashboards.

Features

* User registration and login
* Four user roles: Patient, Doctor, Admin, and Accountant
* Role-based dashboard navigation
* MySQL database integration
* Patient appointment booking and history
* Persistent user accounts and login sessions
* Password hashing for account security

Technology Stack

Component	Technology
Frontend	HTML, CSS, JavaScript
Backend	Core Java (HTTP Server)
Database	MySQL
Database Connectivity	JDBC
Development Environment	VS Code

Database Structure

The MySQL database contains three main tables:

* users: Stores registered accounts and their roles.
* sessions: Stores login sessions.
* appointments: Stores patient appointment information.

How to Run

1. Install Java JDK and MySQL.
2. Clone or download the project.
3. Import schema.sql into MySQL.
4. Configure your MySQL credentials in START_CARENEST.bat.
5. Run the startup script:

.\START_CARENEST.bat

6. Open http://localhost:8080/ in your browser.

No Maven or Apache Tomcat is required.

Project Status

Core authentication, role-based navigation, and patient appointment storage are implemented. Some staff dashboard modules are frontend demonstrations.

Future Improvements

* Complete doctor and admin management modules
* Real-time appointment status updates
* Medical records management
* Billing and payment integration
* Improved role permissions and security

Purpose

Developed as an academic project to demonstrate Java backend development, JDBC connectivity, MySQL database operations, and web application fundamentals.

Note: CareNest is an educational project and is not intended for real hospital operations.
