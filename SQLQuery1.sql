CREATE TABLE Table_list (
	PKID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	TableId int not null unique,
	TableName NVARCHAR(255) NOT NULL,
	CreatedBy NVARCHAR(255) NOT NULL,
	CreateAt Datetime2 NOT NULL,
	ModifiedBy NVARCHAR(255) NOT NULL,
	ModifiedAt Datetime2 NOT NULL
);

/*IDENTITY(1,1)*/

select * from Table_list

insert into Table_list (TableID, TableName, CreatedBy, CreateAt, ModifiedAt, ModifiedBy)
values (2, 'testTable','test', GETDATE(), GETDATE(), 'test')