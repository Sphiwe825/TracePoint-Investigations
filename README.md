# TracePoint Investigations
Planetary Devastation
1) Sphiwe Rodney Khubayi 202526697 (Group Leader)
2) Masise Mike Sebela 202500518
3) Nonsindisho Buthelezi 202579105
4) Mashabela Letago 202551097
5) Sikila Ntsika 202349740
6) Amukelani Ndodakayise Rikhotso 202212514

## Application Description
TracePoint Investigations is a full-stack digital investigation system built for the fictional case, "The Missing Prototype." The application requires an investigator to log in before accessing the case workflow, then allows them to review the case details, inspect suspects and evidence, examine individual pieces of evidence, select a suspect, record an investigation conclusion, submit the investigation, and confirm that the investigation has been successfully stored.

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
1. Opens the application and logs in with an investigator account.
2. Views the case summary after authentication.
3. Reviews suspects and evidence.
4. Examines evidence in detail.
5. Selects the most likely suspect.
6. Enters an investigation conclusion.
7. Submits the investigation.
8. Confirms the record was stored successfully.

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
- Log in to the system using a valid investigator account
- Show the protected case flow after login
- Display the case, suspects, and evidence
- Examine evidence details
- Select a suspect and submit an investigation
- Show the investigation was saved in the database
- Explain the use of React state and props
- Explain one React component
- Explain the use of Entity Framework Core
- Explain the Dapper implementation
- Demonstrate at least one test

## Demonstration Walkthrough

### 1. Prepare the database and start the applications
1. Confirm MySQL is running, the `tradepoint` database and required tables exist, and the case, suspects, and evidence have been seeded.
2. Check that `TracePointApi/TracePointApi/appsettings.json` has a working local MySQL connection string. Keep database passwords private during the presentation.
3. In a terminal, start the API from `TracePointApi/TracePointApi`:
   ```bash
   dotnet run
   ```
   Leave this terminal open and note the API URL printed in the output.
4. In a second terminal at the repository root, start React:
   ```bash
   npm run dev
   ```
5. Open the local Vite URL printed by the command. Keep both applications running during the demonstration.

### 2. Demonstrate login and protected access
1. If you do not already have an investigator account, choose **Signup**, enter a username, email, and password, then create the account. Signup signs the new account in.
2. Choose **Logout**, then choose **Login** and enter that account's email and password. This demonstrates the login form and API call.
3. To show that the investigation pages require a signed-in user, log out and open the **Case** page (or visit `/case`). Confirm that the app redirects to **Login**.
4. Sign in again. The app should return to the protected page you requested.

### 3. Walk through the investigation
1. Open **Case** and point out the case name, description, and status.
2. Open **Suspects** and review the listed people and their details. Select a suspect, then choose **Select Suspect** to carry that selection to the investigation form.
3. Open **Evidence**, select an evidence item, and show its title, location, and description.
4. Open **Investigation**. Confirm the selected suspect, enter a concise conclusion based on the case evidence, and submit it.
5. Point out the success message confirming that the investigation was submitted.

### 4. Verify the saved investigation
Use MySQL Workbench or another SQL client connected to `tradepoint` and run:
```sql
SELECT i.investigationId, i.caseId, s.name AS suspectName,
       i.conclusion, i.dateStarted
FROM investigations AS i
JOIN suspect AS s ON s.suspectId = i.suspectId
ORDER BY i.investigationId DESC
LIMIT 5;
```
Show that the newest row contains the suspect and conclusion submitted through the app.

### 5. Explain the implementation
- **React state and props:** Use the investigation form as an example. `InvestigationPage` stores the selected suspect and submission feedback in state, then passes the selected suspect and submit handler to `InvestigationForm` as props.
- **A React component:** Explain that `InvestigationForm` displays the conclusion form, validates the input, and calls the provided submit handler.
- **Dapper:** The API controllers open MySQL connections with `MySqlConnection` and use Dapper methods such as `QueryAsync` and `ExecuteScalarAsync` to run parameterized SQL and map results. For example, the investigation POST endpoint inserts the submitted case, suspect, and conclusion.
- **Entity Framework Core:** Do not claim that the current API uses EF Core for its database operations. Although the project has a `DatabaseContext` class and lists EF Core as a technology, the current controllers use Dapper and direct MySQL connections; the context is not configured with entities or registered in `Program.cs`. If asked, describe EF Core as a listed dependency / intended part of the architecture, and distinguish it from the database access currently implemented.

### 6. Demonstrate a frontend test
1. From the repository root, run:
   ```bash
   npm test -- --run
   ```
2. Show the Vitest output and briefly explain one passing test, such as the test that submits login credentials and stores the returned user.
