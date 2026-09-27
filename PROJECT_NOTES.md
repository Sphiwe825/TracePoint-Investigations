# TracePoint Investigations Project Notes

## Project purpose
This project is a React investigation app for a missing prototype case. The application lets a user:
- view the case
- review suspects
- review evidence
- select a suspect
- enter an investigation conclusion
- submit the investigation
- see a success confirmation

## Core app flow
1. Start from the home page.
2. Open the case page.
3. Review suspects and evidence.
4. Select the most likely suspect.
5. Enter the conclusion.
6. Submit the investigation.
7. Receive success feedback.

## Mock data used
The app uses the following case profile:
- Case name: The Missing Prototype
- Status: OPEN
- Description: A technology prototype has disappeared from a secure research laboratory.

Suspects:
- Alex Morgan — Software Developer
- Jamie Smith — Security Officer
- Taylor Williams — Research Assistant

Evidence examples:
- Security Access Log
- CCTV Report
- Fingerprint Report
- Email Message

## Database SQL reference
### Create tables
```sql
CREATE DATABASE tradepoint;
USE tradepoint;

CREATE TABLE cases(
    caseId int primary key auto_increment,
    casename varchar(255) not null,
    description varchar(255) not null,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_UserRole CHECK (status IN ('OPEN', 'CLOSED', 'Standard'))
);

CREATE TABLE suspect(
    suspectid int primary key auto_increment,
    name varchar(255) not null,
    occupation varchar(255) not null,
    description varchar(255) not null
);

CREATE TABLE evidence(
    evidenceid int primary key auto_increment,
    title varchar(255) not null,
    description varchar(255) not null,
    location varchar(255) not null
);

CREATE TABLE investigations(
    investigationid int primary key auto_increment,
    caseid int not null,
    constraint fk_inv_caseid foreign key (caseId) references cases(caseId),
    suspectid int not null,
    constraint fk_inv_suspect foreign key (suspectid) references suspect(suspectid),
    conclusion varchar(255),
    datestarted datetime default current_timestamp
);
```

### Seed data
```sql
INSERT INTO evidence(title, description, location)
VALUES
    ('Security Access Log', 'Jamie Smith\'s access card was used to enter the research laboratory at 23:41.', 'Security Office'),
    ('CCTV Report', 'CCTV footage shows a person entering the laboratory at approximately 23:43. The person\'s face cannot be clearly identified.', 'Research Laboratory'),
    ('Fingerprint Report', 'A partial fingerprint was found on the prototype storage cabinet. The fingerprint belongs to a person who regularly works in the laboratory.', 'Research Laboratory'),
    ('Email Message', 'An email sent shortly before the incident states: \'The prototype must be moved before tomorrow\'s demonstration.\'', 'Archive Room'),
    ('Photograph', 'A photograph taken after the incident shows that the prototype cabinet was open and the laboratory lights were switched off.', 'Research Laboratory');

INSERT INTO suspect(name, occupation, description)
VALUES
    ('Alex Morgan', 'Software Developer', 'Alex developed the software used by the prototype and had access to the laboratory.'),
    ('Jamie Smith', 'Security Officer', 'Jamie was responsible for security at the building on the night of the incident.'),
    ('Taylor Williams', 'Research Assistant', 'Taylor worked with the research team and had access to the laboratory during working hours.');
```

## Design colors
- primary-color: #1E3A5F
- secondary-color: #C58F59
- navy-dark: #0A1628
- gray: #6B768E

## Notes
- The app uses mock data in the frontend for a simple demo flow.
- The application is intentionally kept simple and readable for assignment work.
- Unit tests cover the validation rules for submitting an investigation.
