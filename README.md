# TracePoint Investigations
Planetary Devastation
1) Sphiwe Rodney Khubayi 202526697 (Group Leader)
2) Masise Mike Sebela 202500518
3) Nonsindisho Buthelezi 202579105
4) Mashabela Letago 202551097
5) Sikila Ntsika 202349740
6) Amukelani Rikhotso

## Application Description
TracePoint Investigations is a full-stack digital investigation system built for the fictional case, "The Missing Prototype." The application allows an investigator to review the case details, inspect suspects and evidence, examine individual pieces of evidence, select a suspect, record an investigation conclusion, submit the investigation, and confirm that the investigation has been successfully stored.

This project follows the assignment specification for NWED622 – Web Development II and uses a layered architecture consisting of:
- React frontend for the user interface
- ASP.NET Core Web API backend for business logic and routing
- Entity Framework Core for database integration
- Dapper for a database query operation
- MySQL relational database for persistent data storage

## Technologies Used
- ASP.NET Core Web API
- C# / .NET 10
- Entity Framework Core
- Dapper
- MySqlConnector
- React
- Vite
- React Router
- Vitest + Testing Library


## Database Setup Instructions
```sql
CREATE TABLE cases(
	caseId int primary key IDENTITY(1, 1),
	casename varchar(255) not null,
	description varchar(255) not null,
	status VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_UserRole CHECK (status IN ('OPEN', 'CLOSED', 'Standard'))
);

create table suspect(
	suspectid int primary key identity(1, 1),
	name varchar(255) not null,
	occupation varchar(255) not null,
	description varchar(255) not null
);

create table evidence(
	evidenceid int primary key identity(1, 1),
	title varchar(255) not null,
	description varchar(255) not null,
	location varchar(255) not null
);

create table investigations(
	investigationid int primary key identity(1, 1),
	caseid int not null,
	constraint fk_inv_caseid foreign key (caseId) references cases(caseId),
	suspectid int not null,
	constraint fk_inv_suspect foreign key (suspectid) references suspect(suspectid),
	conclusion varchar(255),
	datestarted datetime default current_timestamp
);

CREATE TABLE users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
## Project Overview
The system demonstrates a realistic investigation workflow in which an investigator:
1. Opens the application and views the case summary.
2. Reviews suspects and evidence.
3. Examines evidence in detail.
4. Selects the most likely suspect.
5. Enters an investigation conclusion.
6. Submits the investigation.
7. Confirms the record was stored successfully.

## API Endpoints
The API is designed to support the assignment requirements using attribute-based routing.

### Cases
- GET /api/cases
- GET /api/cases/{id}

### Suspects
- GET /api/suspects
- GET /api/suspects/{id}

### Evidence
- GET /api/evidence
- GET /api/evidence/{id}
- Example route constraint: /api/evidence/{id:int}

### Investigations
- POST /api/investigations
- GET /api/investigations
- GET /api/investigations/{id}

### Users
- GET /api/user
- GET /api/user/{id}
- POST /api/user (signup)
- POST /api/user/login
- PUT /api/user/{id}
- DELETE /api/user/{id}

### Dapper Query Requirement
The application uses Dapper for at least one database operation to retrieve investigations together with the relevant suspect information, including:
- Investigation ID
- Suspect Name
- Conclusion
- Date Started

## Database Setup
1. Create a MySQL database named `tradepoint`.
2. Run the SQL script in `TracePointApi/CREATING_TABLES.sql` to create the required tables.
3. Ensure the database contains the following tables:
   - cases
   - suspect
   - evidence
   - investigations
4. Seed the initial case, suspects, and evidence data as specified in the assignment.
5. Update the connection string in `TracePointApi/TracePointApi/appsettings.json` to match your local MySQL configuration.

Example connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=tradepoint;Uid=root;Pwd=your_password;Port=3306"
}
```

## Database Schema Summary
```sql
CREATE TABLE cases (
    caseId INT PRIMARY KEY AUTO_INCREMENT,
    caseName VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE suspect (
    suspectId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    occupation VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE evidence (
    evidenceId INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE investigations (
    investigationId INT PRIMARY KEY AUTO_INCREMENT,
    caseId INT NOT NULL,
    suspectId INT NOT NULL,
    conclusion VARCHAR(255),
    dateStarted DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Instructions for Running the API
1. Open a terminal in the project root.
2. Navigate to the API project folder:
   ```bash
   cd TracePointApi/TracePointApi
   ```
3. Restore packages and run the API:
   ```bash
   dotnet restore
   dotnet run
   ```
4. Confirm the API is running and accessible through Swagger or a browser at the development URL.

## Instructions for Running React
1. Open a terminal in the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL in the browser to use the application.

## Testing Instructions
### Frontend unit tests
```bash
npm test -- --run
```
## Demonstration Expectations
During the demonstration, the student must be able to:
- Start the API and React app
- Display the case, suspects, and evidence
- Examine evidence details
- Select a suspect and submit an investigation
- Show the investigation was saved in the database
- Explain the use of React state and props
- Explain one React component
- Explain the use of Entity Framework Core
- Explain the Dapper implementation
- Demonstrate at least one test
