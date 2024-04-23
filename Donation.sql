create table Users(
	User_id int not null identity(1, 1),
	PrefixedID AS 'USER' + RIGHT('00000000' + CAST(User_id AS VARCHAR(8)), 8) PERSISTED,
	Dob date not null,
	Name nvarchar(100) not null,
	Email nvarchar(100) not null,
	Gender nvarchar(10) not null,
	Phone_number nvarchar(15) not null,
	Blood_group nvarchar(5) not null,
	IsAdmin bit not null constraint df_isadmin default 0,
	Point int not null constraint df_user_point default 0,
	Register_datetime datetime not null constraint df_register_datetime default(current_timestamp),
	constraint pk_id primary key(User_id),
	constraint uc_email unique(email),
	constraint chk_gender check (Gender in('male', 'female')),
	constraint chk_Phone_number check (len(Phone_number) = 10),
	constraint chk_user_blood_group check (Blood_group in ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
	constraint uq_prefixedId unique (PrefixedID),
	constraint uq_phone_number unique (Phone_number)
);

create table Logins(
	Lid int not null identity(1, 1),
	Email nvarchar(100) not null,
	Password nvarchar(100) not null,
	constraint pk_logins_id primary key(Lid),
	constraint uc_logins_email unique(Email)
)

create table Location(
	Location_id int not null identity(1, 1),
	Location_name nvarchar(50),
	Address nvarchar(50),
	Group_A_Plus int not null default 1000,
	Group_A_Minus int not null default 1000,
	Group_B_Plus int not null default 1000,
	Group_B_Minus int not null default 1000,
	Group_O_Plus int not null default 1000,
	Group_O_Minus int not null default 1000,
	Group_AB_Plus int not null default 1000,
	Group_AB_Minus int not null default 1000,
	constraint pk_location_id primary key(Location_id),
	constraint uk_location_name unique (Location_name),
	constraint uk_address unique (Address),
);

create table Donate(
	Donate_id int not null identity(1, 1),
	Uid int not null,
	Lid int not null,
	Aid int,
	Unit int not null,
	Disease nvarchar(50) not null,
	Donate_date datetime not null constraint df_donate_date default(current_timestamp),
	Censor_datetime datetime,
	Status nvarchar(50) not null constraint df_status_donate default 'pending',
	constraint pk_donate_id primary key(Donate_id),
	constraint chk_donate_status check (Status in ('pending','rejected','approved')),
	constraint fk_donate_uid foreign key (Uid) references Users(User_id),
	constraint fk_donate_pid foreign key (Lid) references Location(Location_id),
	constraint fk_donate_aid foreign key (Aid) references Users(User_id)
);

create table Request(
	Request_id int not null identity(1, 1),
	Uid int not null,
	Lid int,
	Aid int,
	Blood_group_suggestion nvarchar(5),
	Unit int not null,
	Reason nvarchar(50) not null,
	Request_date datetime not null constraint df_request_date default(current_timestamp),
	Censor_datetime datetime,
	Status nvarchar(50) not null constraint df_status_request default 'pending',
	constraint pk_request_id primary key(Request_id),
	constraint chk_request_blood_group check (Blood_group_suggestion in ('A+','A-','B+','B-','O+','O-','AB+','AB-')),
	constraint chk_request_status check (Status in ('pending','rejected','approved')),
	constraint fk_request_uid foreign key (Uid) references Users(User_id),
	constraint fk_request_aid foreign key (Aid) references Users(User_id),
	constraint fk_request_pid foreign key (Lid) references Location(Location_id)
);

create table Gift(
 Gift_id int not null identity(1,1),
 Gname nvarchar(100) not null,
 Point int not null,
 Remain int not null,
 constraint pk_gift_id primary key(Gift_id)
);

create table Receive(
	Rid int not null identity(1,1),
	Uid int not null,
	Gid int not null,
	Receive_date date not null constraint df_receive_date default(current_timestamp),
	constraint pk_receive primary key (Rid),
	constraint fk_receive_uid foreign key (Uid) references Users(User_id),
	constraint fk_receive_gid foreign key (Gid) references Gift(Gift_id)
)


if exists(select name from sysobjects
where name='UpdateDonate')
drop trigger UpdateDonate
go
create trigger UpdateDonate
on Donate
for update
as
declare @status Nvarchar(50), @did int
select @status = Status FROM inserted
select @did = Donate_id from inserted
if(@status != 'pending')
begin
update Donate set Censor_datetime = current_timestamp where Donate_id = @did
end
go

if exists(select name from sysobjects
where name='UpdateRequest')
drop trigger UpdateRequest
go
create trigger UpdateRequest
on Request
for update
as
declare @status Nvarchar(50), @did int
select @status = Status FROM inserted
select @did = Request_id from inserted
if(@status != 'pending')
begin
update Request set Censor_datetime = current_timestamp where Request_id = @did
end
go


if exists(select name from sysobjects
where name='InsertReceive')
drop trigger InsertReceive
go
create trigger InsertReceive
on Receive
for insert
as
declare @id int
select @id = Rid from inserted
begin
update Receive set Receive_date = current_timestamp where Rid = @id
end
go

update Users set IsAdmin = 1 where User_id = 1

insert into Location (Location_name, Address) values ('Bac Ninh',N'Bắc Ninh'),('Ha Noi',N'Hà Nội'),
('Hai Duong',N'Hải Dương'),('Ha Nam',N'Hà Nam'),('Hai Phong',N'Hải Phòng'),('Thai Nguyen',N'Thái Nguyên'),('Thanh Hoa', N'Thanh Hóa')
,('Nam Dinh', N'Nam Định')

insert into Gift (Gname,Point, Remain) values ('Teddy',2,55),('Bag',3,63),('Dinnerware Sets',4,34),('Cactus',1,112),('Glass Sets',2,36),
('Helmet',3,77),('Laptop Bag',2,58),('Shampoo',4,76),('Succulent',1,128),('Super Tepid',3,34),('Octopus Teddy',2,102),('Tea Sets',4,38)


if exists(select name from sysobjects
where name='InsertReceive')
drop trigger InsertReceive
go
create trigger InsertReceive
on Receive
for insert
as
declare @id int
select @id = Rid from inserted
begin
update Receive set Receive_date = current_timestamp where Rid = @id
end
go
	


if exists(select name from sysobjects
where name='InsertNV')
drop trigger InsertNV
go
create trigger InsertNV
on NHANVIEN
for insert
as
declare @date datetime
select @date = NGAYSINH  from inserted
if(YEAR(@date) > 2001)
begin
print'Not be allowed'
rollback
end
else
print'Accepted'




