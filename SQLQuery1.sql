CREATE TABLE Table_list (
	PKID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	TableId int not null unique,
	TableName NVARCHAR(255) NOT NULL,
	CreatedBy NVARCHAR(255) NOT NULL,
	CreateAt Datetime2 NOT NULL,
	ModifiedBy NVARCHAR(255) NOT NULL,
	ModifiedAt Datetime2 NOT NULL
);

CREATE TABLE Users (
	PkId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Username NVARCHAR(255) NOT NULL,
	Email NVARCHAR(255) NOT NULL,
	Password NVARCHAR(255) NOT NULL,
	CreatedAt Datetime2 NOT NULL,
	CreatedBy NVARCHAR(255) NOT NULL,
	ModifiedAt Datetime2 NOT NULL,
	ModifiedBy NVARCHAR(255) NOT NULL,
);

CREATE TABLE Company(
	PkId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	CompanyName NVARCHAR(255) NOT NULL,
	CreatedAt Datetime2 NOT NULL,
	CreatedBy Datetime2 NOT NULL,
	ModifiedBy NVARCHAR(255) NOT NULL,
	ModifiedAt Datetime2 NOT NULL
);

select * from Users

/*IDENTITY(1,1)*/

select * from Table_list

insert into Table_list (TableID, TableName, CreatedBy, CreateAt, ModifiedAt, ModifiedBy)
values (2, 'testTable','test', GETDATE(), GETDATE(), 'test')





/* postgresql */

CREATE TABLE Table_list (
    PkId integer not null generated always as identity (increment by 1),
    constraint pk_testing_case primary key (PkId),

    TableId int not null unique,
    TableName VARCHAR(255) NOT NULL,
    CreatedBy VARCHAR(255) NOT NULL,
    CreateAt timestamp  NOT NULL,
    ModifiedBy VARCHAR(255) NOT NULL,
    ModifiedAt timestamp  NOT NULL
  )

CREATE TABLE Users (
    PkId integer not null generated always as identity (increment by 1),
    constraint pk_testing_case_2 primary key (PkId),

    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    CreatedAt timestamp NOT NULL,
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt timestamp NOT NULL,
    ModifiedBy VARCHAR(255) NOT NULL
  );
  
CREATE TABLE Company(
    PkId integer not null generated always as identity (increment by 1),
    constraint pk_testing_case_3 primary key (PkId),

    CompanyName VARCHAR(255) NOT NULL,
    CreatedAt timestamp NOT NULL,
    CreatedBy timestamp NOT NULL,
    ModifiedBy VARCHAR(255) NOT NULL,
    ModifiedAt timestamp NOT NULL
  );