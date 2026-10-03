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