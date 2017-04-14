use Mancave
go

print '*** Table: State ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'State')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Account_State')
	begin
		alter table Account drop constraint fk_Account_State
	end
	
	drop table dbo.[State]
end
go
create table dbo.[State]
(
	Id int identity(1,1) not null primary key,
	Abbrev nvarchar(5) not null,
	Name nvarchar(50) not null
)
go
insert into [State]
select 'AL', 'Alabama'
union select 'AK', 'Alaska'
union select 'AZ', 'Arizona'
union select 'AR', 'Arkansas'
union select 'CA', 'California'
union select 'CO', 'Colorado'
union select 'CT', 'Connecticut'
union select 'DE', 'Delaware'
union select 'DC', 'District Of Columbia'
union select 'FL', 'Florida'
union select 'GA', 'Georgia'
union select 'HI', 'Hawaii'
union select 'ID', 'Idaho'
union select 'IL', 'Illinois'
union select 'IN', 'Indiana'
union select 'IA', 'Iowa'
union select 'KS', 'Kansas'
union select 'KY', 'Kentucky'
union select 'LA', 'Louisiana'
union select 'ME', 'Maine'
union select 'MD', 'Maryland'
union select 'MA', 'Massachusetts'
union select 'MI', 'Michigan'
union select 'MN', 'Minnesota'
union select 'MS', 'Mississippi'
union select 'MO', 'Missouri'
union select 'MT', 'Montana'
union select 'NE', 'Nebraska'
union select 'NV', 'Nevada'
union select 'NH', 'New Hampshire'
union select 'NJ', 'New Jersey'
union select 'NM', 'New Mexico'
union select 'NY', 'New York'
union select 'NC', 'North Carolina'
union select 'ND', 'North Dakota'
union select 'OH', 'Ohio'
union select 'OK', 'Oklahoma'
union select 'OR', 'Oregon'
union select 'PA', 'Pennsylvania'
union select 'RI', 'Rhode Island'
union select 'SC', 'South Carolina'
union select 'SD', 'South Dakota'
union select 'TN', 'Tennessee'
union select 'TX', 'Texas'
union select 'UT', 'Utah'
union select 'VT', 'Vermont'
union select 'VA', 'Virginia'
union select 'WA', 'Washington'
union select 'WV', 'West Virginia'
union select 'WI', 'Wisconsin'
union select 'WY', 'Wyoming'
go

print '*** Table: Country ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Country')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Account_Country')
	begin
		alter table Account drop constraint fk_Account_Country
	end
	
	drop table dbo.Country
end
go
create table dbo.Country
(
	Id int identity(1,1) not null primary key,
	Abbrev nvarchar(5) not null,
	Name nvarchar(50) not null
)
go
insert into Country
select 'AFG', 'AFGHANISTAN'
union select 'ALB', 'ALBANIA'
union select 'DZA', 'ALGERIA'
union select 'ASM', 'AMERICAN SAMOA'
union select 'AND', 'ANDORRA'
union select 'AGO', 'ANGOLA'
union select 'AIA', 'ANGUILLA'
union select 'ATA', 'ANTARCTICA'
union select 'ATG', 'ANTIGUA AND BARBUDA'
union select 'ARG', 'ARGENTINA'
union select 'ARM', 'ARMENIA'
union select 'ABW', 'ARUBA'
union select 'AUS', 'AUSTRALIA'
union select 'AUT', 'AUSTRIA'
union select 'AZE', 'AZERBAIJAN'
union select 'BHS', 'BAHAMAS'
union select 'BHR', 'BAHRAIN'
union select 'BGD', 'BANGLADESH'
union select 'BRB', 'BARBADOS'
union select 'BLR', 'BELARUS'
union select 'BEL', 'BELGIUM'
union select 'BLZ', 'BELIZE'
union select 'BEN', 'BENIN'
union select 'BMU', 'BERMUDA'
union select 'BTN', 'BHUTAN'
union select 'BOL', 'BOLIVIA'
union select 'BIH', 'BOSNIA AND HERZEGOWINA'
union select 'BWA', 'BOTSWANA'
union select 'BVT', 'BOUVET ISLAND'
union select 'BRA', 'BRAZIL'
union select 'IOT', 'BRITISH INDIAN OCEAN TERRITORY'
union select 'BRN', 'BRUNEI DARUSSALAM'
union select 'BGR', 'BULGARIA'
union select 'BFA', 'BURKINA FASO'
union select 'BDI', 'BURUNDI'
union select 'KHM', 'CAMBODIA'
union select 'CMR', 'CAMEROON'
union select 'CAN', 'CANADA'
union select 'CPV', 'CAPE VERDE'
union select 'CYM', 'CAYMAN ISLANDS'
union select 'CAF', 'CENTRAL AFRICAN REPUBLIC'
union select 'TCD', 'CHAD'
union select 'CHL', 'CHILE'
union select 'CHN', 'CHINA'
union select 'CXR', 'CHRISTMAS ISLAND'
union select 'CCK', 'COCOS (KEELING) ISLANDS'
union select 'COL', 'COLOMBIA'
union select 'COM', 'COMOROS'
union select 'COG', 'CONGO'
union select 'COD', 'CONGO, THE DRC'
union select 'COK', 'COOK ISLANDS'
union select 'CRI', 'COSTA RICA'
union select 'CIV', 'COTE D''IVOIRE'
union select 'HRV', 'CROATIA (local name: Hrvatska)'
union select 'CUB', 'CUBA'
union select 'CYP', 'CYPRUS'
union select 'CZE', 'CZECH REPUBLIC'
union select 'DNK', 'DENMARK'
union select 'DJI', 'DJIBOUTI'
union select 'DMA', 'DOMINICA'
union select 'DOM', 'DOMINICAN REPUBLIC'
union select 'TMP', 'EAST TIMOR'
union select 'ECU', 'ECUADOR'
union select 'EGY', 'EGYPT'
union select 'SLV', 'EL SALVADOR'
union select 'GNQ', 'EQUATORIAL GUINEA'
union select 'ERI', 'ERITREA'
union select 'EST', 'ESTONIA'
union select 'ETH ', 'ETHIOPIA'
union select 'FLK', 'FALKLAND ISLANDS (MALVINAS)'
union select 'FRO', 'FAROE ISLANDS'
union select 'FJI', 'FIJI'
union select 'FIN', 'FINLAND'
union select 'FRA', 'FRANCE'
union select 'FXX', 'FRANCE, METROPOLITAN'
union select 'GUF', 'FRENCH GUIANA'
union select 'PYF', 'FRENCH POLYNESIA'
union select 'ATF', 'FRENCH SOUTHERN TERRITORIES'
union select 'GAB', 'GABON'
union select 'GMB', 'GAMBIA'
union select 'GEO', 'GEORGIA'
union select 'DEU', 'GERMANY'
union select 'GHA', 'GHANA'
union select 'GIB', 'GIBRALTAR'
union select 'GRC', 'GREECE'
union select 'GRL', 'GREENLAND'
union select 'GRD', 'GRENADA'
union select 'GLP', 'GUADELOUPE'
union select 'GUM', 'GUAM'
union select 'GTM', 'GUATEMALA'
union select 'GIN', 'GUINEA'
union select 'GNB', 'GUINEA-BISSAU'
union select 'GUY', 'GUYANA'
union select 'HTI', 'HAITI'
union select 'HMD', 'HEARD AND MC DONALD ISLANDS'
union select 'VAT', 'HOLY SEE (VATICAN CITY STATE)'
union select 'HND', 'HONDURAS'
union select 'HKG', 'HONG KONG'
union select 'HUN', 'HUNGARY'
union select 'ISL', 'ICELAND'
union select 'IND', 'INDIA'
union select 'IDN', 'INDONESIA'
union select 'IRN', 'IRAN (ISLAMIC REPUBLIC OF)'
union select 'IRQ', 'IRAQ'
union select 'IRL', 'IRELAND'
union select 'ISR', 'ISRAEL'
union select 'ITA', 'ITALY'
union select 'JAM', 'JAMAICA'
union select 'JPN', 'JAPAN'
union select 'JOR', 'JORDAN'
union select 'KAZ', 'KAZAKHSTAN'
union select 'KEN', 'KENYA'
union select 'KIR', 'KIRIBATI'
union select 'PRK', 'KOREA, D.P.R.O.'
union select 'KOR', 'KOREA, REPUBLIC OF'
union select 'KWT', 'KUWAIT'
union select 'KGZ', 'KYRGYZSTAN'
union select 'LAO', 'LAOS '
union select 'LVA', 'LATVIA'
union select 'LBN', 'LEBANON'
union select 'LSO', 'LESOTHO'
union select 'LBR', 'LIBERIA'
union select 'LBY', 'LIBYAN ARAB JAMAHIRIYA'
union select 'LIE', 'LIECHTENSTEIN'
union select 'LTU', 'LITHUANIA'
union select 'LUX', 'LUXEMBOURG'
union select 'MAC', 'MACAU'
union select 'MKD', 'MACEDONIA'
union select 'MDG', 'MADAGASCAR'
union select 'MWI', 'MALAWI'
union select 'MYS', 'MALAYSIA'
union select 'MDV', 'MALDIVES'
union select 'MLI', 'MALI'
union select 'MLT', 'MALTA'
union select 'MHL', 'MARSHALL ISLANDS'
union select 'MTQ', 'MARTINIQUE'
union select 'MRT', 'MAURITANIA'
union select 'MUS', 'MAURITIUS'
union select 'MYT', 'MAYOTTE'
union select 'MEX', 'MEXICO'
union select 'FSM', 'MICRONESIA, FEDERATED STATES OF'
union select 'MDA', 'MOLDOVA, REPUBLIC OF'
union select 'MCO', 'MONACO'
union select 'MNG', 'MONGOLIA'
union select 'MNE', 'MONTENEGRO'
union select 'MSR', 'MONTSERRAT'
union select 'MAR', 'MOROCCO'
union select 'MOZ', 'MOZAMBIQUE'
union select 'MMR', 'MYANMAR (Burma) '
union select 'NAM', 'NAMIBIA'
union select 'NRU', 'NAURU'
union select 'NPL', 'NEPAL'
union select 'NLD', 'NETHERLANDS'
union select 'ANT', 'NETHERLANDS ANTILLES'
union select 'NCL', 'NEW CALEDONIA'
union select 'NZL', 'NEW ZEALAND'
union select 'NIC', 'NICARAGUA'
union select 'NER', 'NIGER'
union select 'NGA', 'NIGERIA'
union select 'NIU', 'NIUE'
union select 'NFK', 'NORFOLK ISLAND'
union select 'MNP', 'NORTHERN MARIANA ISLANDS'
union select 'NOR', 'NORWAY'
union select 'OMN', 'OMAN'
union select 'PAK', 'PAKISTAN'
union select 'PLW', 'PALAU'
union select 'PAN', 'PANAMA'
union select 'PNG', 'PAPUA NEW GUINEA'
union select 'PRY', 'PARAGUAY'
union select 'PER', 'PERU'
union select 'PHL', 'PHILIPPINES'
union select 'PCN', 'PITCAIRN'
union select 'POL', 'POLAND'
union select 'PRT', 'PORTUGAL'
union select 'PRI', 'PUERTO RICO'
union select 'QAT', 'QATAR'
union select 'REU', 'REUNION'
union select 'ROM', 'ROMANIA'
union select 'RUS', 'RUSSIAN FEDERATION'
union select 'RWA', 'RWANDA'
union select 'KNA', 'SAINT KITTS AND NEVIS'
union select 'LCA', 'SAINT LUCIA'
union select 'VCT', 'SAINT VINCENT AND THE GRENADINES'
union select 'WSM', 'SAMOA'
union select 'SMR', 'SAN MARINO'
union select 'STP', 'SAO TOME AND PRINCIPE'
union select 'SAU', 'SAUDI ARABIA'
union select 'SEN', 'SENEGAL'
union select 'SRB', 'SERBIA'
union select 'SYC', 'SEYCHELLES'
union select 'SLE', 'SIERRA LEONE'
union select 'SGP', 'SINGAPORE'
union select 'SVK', 'SLOVAKIA (Slovak Republic)'
union select 'SVN', 'SLOVENIA'
union select 'SLB', 'SOLOMON ISLANDS'
union select 'SOM', 'SOMALIA'
union select 'ZAF', 'SOUTH AFRICA'
union select 'SSD', 'SOUTH SUDAN'
union select 'SGS', 'SOUTH GEORGIA AND SOUTH S.S.'
union select 'ESP', 'SPAIN'
union select 'LKA', 'SRI LANKA'
union select 'SHN', 'ST. HELENA'
union select 'SPM', 'ST. PIERRE AND MIQUELON'
union select 'SDN', 'SUDAN'
union select 'SUR', 'SURINAME'
union select 'SJM', 'SVALBARD AND JAN MAYEN ISLANDS'
union select 'SWZ', 'SWAZILAND'
union select 'SWE', 'SWEDEN'
union select 'CHE', 'SWITZERLAND'
union select 'SYR', 'SYRIAN ARAB REPUBLIC'
union select 'TWN', 'TAIWAN, PROVINCE OF CHINA'
union select 'TJK', 'TAJIKISTAN'
union select 'TZA', 'TANZANIA, UNITED REPUBLIC OF'
union select 'THA', 'THAILAND'
union select 'TGO', 'TOGO'
union select 'TKL', 'TOKELAU'
union select 'TON', 'TONGA'
union select 'TTO', 'TRINIDAD AND TOBAGO'
union select 'TUN', 'TUNISIA'
union select 'TUR', 'TURKEY'
union select 'TKM', 'TURKMENISTAN'
union select 'TCA', 'TURKS AND CAICOS ISLANDS'
union select 'TUV', 'TUVALU'
union select 'UGA', 'UGANDA'
union select 'UKR', 'UKRAINE'
union select 'ARE', 'UNITED ARAB EMIRATES'
union select 'GBR', 'UNITED KINGDOM'
union select 'USA', 'UNITED STATES'
union select 'UMI', 'U.S. MINOR ISLANDS'
union select 'URY', 'URUGUAY'
union select 'UZB', 'UZBEKISTAN'
union select 'VUT', 'VANUATU'
union select 'VEN', 'VENEZUELA'
union select 'VNM', 'VIET NAM'
union select 'VGB', 'VIRGIN ISLANDS (BRITISH)'
union select 'VIR', 'VIRGIN ISLANDS (U.S.)'
union select 'WLF', 'WALLIS AND FUTUNA ISLANDS'
union select 'ESH', 'WESTERN SAHARA'
union select 'YEM', 'YEMEN'
union select 'ZMB', 'ZAMBIA'
union select 'ZWE', 'ZIMBABWE'
go

print '*** Table: Privacy ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Privacy')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPost_Privacy')
	begin
		alter table AccountPost drop constraint fk_AccountPost_Privacy
	end

	drop table dbo.Privacy
end
go
create table dbo.Privacy
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null
)
go
insert into Privacy values('Friends')
insert into Privacy values('Public')
go

print '*** Table: Status ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Status')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Account_Status')
	begin
		alter table [Account] drop constraint fk_Account_Status
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountFriend_Status')
	begin
		alter table AccountFriend drop constraint fk_AccountFriend_Status
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Communication_StatusTo')
	begin
		alter table Communication drop constraint fk_Communication_StatusTo
	end
	
	drop table dbo.[Status]
end
go
create table dbo.[Status]
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null,
	Icon nvarchar(50) not null,
	Color nvarchar(15) not null
)
go
insert into [Status] values('Failed', 'icon_failed.jpg', 'red')
insert into [Status] values('Invited', 'icon_invited.jpg', 'gray')
insert into [Status] values('New', 'icon_new.jpg', 'orange')
insert into [Status] values('Offline', 'icon_offline.jpg', 'gray')
insert into [Status] values('Online', 'icon_online.jpg', 'orange')
insert into [Status] values('Read', 'icon_read.jpg', 'gray')
insert into [Status] values('Sent', 'icon_sent.jpg', 'orange')
insert into [Status] values('UnRead', 'icon_unread.jpg', 'gray')
insert into [Status] values('Active', 'icon_active.jpg', 'blue')
go

print '*********************************************************'
print 'Table: Account'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Account')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountToken_Account')
	begin
		alter table AccountToken drop constraint fk_AccountToken_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Communication_Account_From')
	begin
		alter table Communication drop constraint fk_Communication_Account_From
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Communication_Account_To')
	begin
		alter table Communication drop constraint fk_Communication_Account_To
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountFriend_Account')
	begin
		alter table AccountFriend drop constraint fk_AccountFriend_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountFriend_Friend')
	begin
		alter table AccountFriend drop constraint fk_AccountFriend_Friend
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountSkill_Account')
	begin
		alter table AccountSkill drop constraint fk_AccountSkill_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPost_Account')
	begin
		alter table AccountPost drop constraint fk_AccountPost_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPost_Account')
	begin
		alter table AccountPost drop constraint fk_AccountPost_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountFavSite_Account')
	begin
		alter table AccountFavSite drop constraint fk_AccountFavSite_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountCalendarEvent_Account')
	begin
		alter table AccountCalendarEvent drop constraint fk_AccountCalendarEvent_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPost_PostedBy')
	begin
		alter table AccountPost drop constraint fk_AccountPost_PostedBy
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Forum_Owner')
	begin
		alter table Forum drop constraint fk_Forum_Owner
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Topic_Owner')
	begin
		alter table Topic drop constraint fk_Topic_Owner
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_ForumMessage_Owner')
	begin
		alter table ForumMessage drop constraint fk_ForumMessage_Owner
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPhoto_Account')
	begin
		alter table AccountPhoto drop constraint fk_AccountPhoto_Account
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountVideo_Account')
	begin
		alter table AccountVideo drop constraint fk_AccountVideo_Account
	end
	
	drop table dbo.[Account]
end
go
create table dbo.Account
(
	Id int identity(1,1) not null primary key,
	FirstName nvarchar(50) null,
	LastName nvarchar(50) null,
	DisplayName nvarchar(50) null,
	Email nvarchar(100) not null,
	[Password] nvarchar(50) not null,
	HerEmail nvarchar(100) null,
	HerPassword nvarchar(50) null,
	City nvarchar(50) null,
	StateId int null constraint fk_Account_State foreign key references [State](Id),
	Zipcode nvarchar(15) null,
	CountryId int null constraint fk_Account_Country foreign key references [Country](Id),
	ProfilePic nvarchar(100) null,
	BackgroundImage nvarchar(100) null,
	Token uniqueidentifier null,
	TokenExpired bit null,
	HerToken uniqueidentifier null,
	HerTokenExpired bit null,
	WifesPageTitle nvarchar(100) null,
	WifesPageUrl nvarchar(100) null,
	ResumeFileName nvarchar(50) null,
	HeaderBackColor1 nvarchar(30) null,
	HeaderBackColor2 nvarchar(30) null,
	HeaderFontColor nvarchar(30) null,
	LeftPanelBackColor1 nvarchar(30) null,
	LeftPanelBackColor2 nvarchar(30) null,
	LeftPanelFontColor nvarchar(30) null,
	RightPanelBackColor1 nvarchar(30) null,
	RightPanelBackColor2 nvarchar(30) null,
	RightPanelFontColor nvarchar(30) null,
	MainPanelBackImgTransparency int null,
	MainPanelPanelsTransparency int null,
	MainPanelFontColor nvarchar(30) null,
	MancaveTile1Name nvarchar(50) null,
	MancaveTile1Url nvarchar(50) null,
	MancaveTile1Img nvarchar(50) null,
	MancaveTile2Name nvarchar(50) null,
	MancaveTile2Url nvarchar(50) null,
	MancaveTile2Img nvarchar(50) null,
	MancaveTile3Name nvarchar(50) null,
	MancaveTile3Url nvarchar(50) null,
	MancaveTile3Img nvarchar(50) null,
	MancaveTile4Name nvarchar(50) null,
	MancaveTile4Url nvarchar(50) null,
	MancaveTile4Img nvarchar(50) null,
	MancaveTile5Name nvarchar(50) null,
	MancaveTile5Url nvarchar(50) null,
	MancaveTile5Img nvarchar(50) null,
	MancaveTile6Name nvarchar(50) null,
	MancaveTile6Url nvarchar(50) null,
	MancaveTile6Img nvarchar(50) null,
	RadioEmbedCode nvarchar(500) null,
	RadioPosition int null,
	StatusId int null constraint fk_Account_Status foreign key references [Status](Id),
	Created datetime null default getdate(),
	CreatedBy nvarchar(100) null default 'system',
	LastUpdated datetime null default getdate(),
	LastUpdatedBy nvarchar(100) null default 'system'
)
go

print '*** Table: AccountCalendarEvent ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountCalendarEvent')
begin
	drop table dbo.AccountCalendarEvent
end
go
create table dbo.AccountCalendarEvent
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountCalendarEvent_Account foreign key references [Account](Id),
	EventName nvarchar(50) null,
	EventDescription text null,
	EventDate datetime not null,
	Deleted bit null
)
go

print '*** Table: AccountPost ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountPost')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPost_ParentPost')
	begin
		alter table AccountPost drop constraint fk_AccountPost_ParentPost
	end

	drop table dbo.AccountPost
end
go
create table dbo.AccountPost
(
	Id int identity(1,1) not null primary key,
	ParentAccountPostId int null constraint fk_AccountPost_ParentPost foreign key references AccountPost(Id),
	AccountId int not null constraint fk_AccountPost_Account foreign key references [Account](Id),
	PostedByAccountId int not null constraint fk_AccountPost_PostedBy foreign key references [Account](Id),
	PhotoFile nvarchar(100) null,
	VideoUrl nvarchar(250) null,
	Comment text null,
	PrivacyId int null constraint fk_AccountPost_Privacy foreign key references Privacy(Id),
	Created datetime not null
)
go

print '*** Table: AccountSkill ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountSkill')
begin
	drop table dbo.AccountSkill
end
go
create table dbo.AccountSkill
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountSkill_Account foreign key references [Account](Id),
	Skill nvarchar(50) not null,
	Years int null,
	LastUsed int null,
	DisplayOrder int null
)
go

print '*** Table: AccountFavSite ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountFavSite')
begin
	drop table dbo.AccountFavSite
end
go
create table dbo.AccountFavSite
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountFavSite_Account foreign key references [Account](Id),
	FavSite text not null
)
go

print '*** Table: CommMethod ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'CommMethod')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Communication_CommMethod')
	begin
		alter table Communication drop constraint fk_Communication_CommMethod
	end
	
	drop table dbo.CommMethod
end
go
create table dbo.CommMethod
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null
)
go
insert into CommMethod
select 'Email'
union
select 'Internal Message'
go

print '*** Table: Action ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Action')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Communication_Action')
	begin
		alter table Communication drop constraint fk_Communication_Action
	end
	
	drop table dbo.[Action]
end
go
create table dbo.[Action]
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null
)
go
insert into [Action]
select 'Invitation'
union
select 'None'
go

print '*** Table: AccountFriend ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountFriend')
begin
	drop table dbo.AccountFriend
end
go
create table dbo.AccountFriend
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountFriend_Account foreign key references [Account](Id),
	FriendId int not null constraint fk_AccountFriend_Friend foreign key references [Account](Id)
)
go

print '*** Table: Communication ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Communication')
begin
	drop table dbo.Communication
end
go
create table dbo.Communication
(
	Id int identity(1,1) not null primary key,
	CommMethodId int null constraint fk_Communication_CommMethod foreign key references CommMethod(Id),
	ActionId int not null constraint fk_Communication_Action foreign key references [Action](Id),
	FromAcctId int not null constraint fk_Communication_Account_From foreign key references [Account](Id),
	ToAcctId int not null constraint fk_Communication_Account_To foreign key references [Account](Id),
	StatusToId int not null constraint fk_Communication_StatusTo foreign key references [Status](Id),
	ConversationId uniqueidentifier null,
	SubjectTo nvarchar(250) null,
	MessageTo text null,
	MessageToEmail text null,
	MessageToTxtMsg text null,
	MessageToEmailSent bit null default 0,
	MessageToTxtMsgSent bit null default 0,
	Archived bit null default 0,
	Created datetime not null default getdate(),
	CreatedBy nvarchar(100) not null default 'system',
	LastUpdated datetime not null default getdate(),
	LastUpdatedBy nvarchar(100) not null default 'system'
)
go

print '*** Table: Forum ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Forum')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_Topic_Forum')
	begin
		alter table Topic drop constraint fk_Topic_Forum
	end

	drop table dbo.Forum
end
go
create table dbo.Forum
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null,
	OwnerAccountId int not null constraint fk_Forum_Owner foreign key references [Account](Id),
	Created datetime not null
)
go

print '*** Table: Topic ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Topic')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_ForumMessage_Topic')
	begin
		alter table ForumMessage drop constraint fk_ForumMessage_Topic
	end

	drop table dbo.Topic
end
go
create table dbo.Topic
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(1000) not null,
	OwnerAccountId int not null constraint fk_Topic_Owner foreign key references [Account](Id),
	ForumId int not null constraint fk_Topic_Forum foreign key references Forum(Id),
	Created datetime not null
)
go

print '*** Table: ForumMessage ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'ForumMessage')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_ForumMessage_Parent')
	begin
		alter table ForumMessage drop constraint fk_ForumMessage_Parent
	end

	drop table dbo.ForumMessage
end
go
create table dbo.ForumMessage
(
	Id int identity(1,1) not null primary key,
	[Message] text not null,
	PhotoFile nvarchar(100) null,
	ParentForumMessageId int null constraint fk_ForumMessage_Parent foreign key references ForumMessage(Id),
	OwnerAccountId int not null constraint fk_ForumMessage_Owner foreign key references [Account](Id),
	TopicId int not null constraint fk_ForumMessage_Topic foreign key references Topic(Id),
	Created datetime not null
)
go

print '*** Table: Game ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Game')
begin
	drop table dbo.Game
end
go
create table dbo.Game
(
	Id int identity(1,1) not null primary key,
	GameCategory int not null,
	Name nvarchar(100) not null,
	Logo nvarchar(250) not null,
	[Description] text null,
	Instructions text null,
	EmbedCode text not null
)
go
insert into Game values(1, 'Ninja Training Worlds', 'ninjatraining.jpg', 'Ninja Training Worlds is a side-scrolling action platform game in which you need to complete a series of ancient Ninja challenges. Guide your Ninja through each challenge by dodging and defeating enemies, jumping from wall to wall, dashing under spikes and collecting gold coins. You''ll need to collect all gold coins and defeat all of the enemies to get the highest score!', 'A and D to move left and right. W and S to move up and down ladders. Space to jump. Press Space twice to double jump. P to Pause. M to Mute.', '&lt;iframe src="http://www.freeonlinegames.com/embed/38912" width="100%" height="850" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(1, 'Dr. Lee', 'drlee.jpg', 'Dr Lee is a Flying Game where Dr Lee is sitting on a rocket and you must launch him into the sky. From there the aim is to make the rocket travel as far as possible. You can collect fuel cans to increase your fuel or collect the coins floating around in the sky so you can upgrade various aspects of the rocket at the begining of your next flight. The more upgrades you get the easier flying will become, you can purchase these upgrades with FOG coins if you choose, or use the money that you earn during the game.', 'Use A and D to change direct, E to use rocket fuel.', '&lt;iframe src="http://www.freeonlinegames.com/embed/24591" width="100%" height="530" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(1, 'Azure Fish', 'azurefish.jpg', 'For those that missed Ecco The Dolphins'' appearance, enter Azurefish! Control your sea-faring creature in 20 objectives, while collecting objects along the way (about 240+ collectibles in total). Participate in races, answer quizzes and more. The scenery will bring you in and keep you for a long time. Hold your breath!', 'Control the fish - use the mouse', '&lt;iframe src="http://www.freeonlinegames.com/embed/21618" width="100%" height="500" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(1, '18 Wheeler 3', '18wheeler3.jpg', 'Your life is turned upside down as you return to Texas, only to get involved with a local gang. Now you must work your way out by working for them. Drive your truck , do various missions, stay away from the cops and try not to destroy the truck, your life depends on it! There are three speeds at which you can operate the truck for different purposes.', ' Movement - Arrow keys · Speed control - 1/2/3 · Quality toggle - Q · Sound toggle - S', '&lt;iframe src="http://www.freeonlinegames.com/embed/19147" width="100%" height="500" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
go
insert into Game values(2, 'Fun Math', 'funmath.jpg', 'Math is a great way to boost your overall logic and thinking skills (and one of the most lucrative degrees you can earn!). You''ll be faced with a slew of fast-paced math challenges with increasing difficulty. For an added challenge, try the more difficult problems in the upper-right of the screen. You''re in a race against time (and your own forgetfulness!).', 'Use the mouse to click the answers.', '&lt;iframe src="http://www.freeonlinegames.com/embed/21833" width="640" height="530" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(2, 'Pixel Quest', 'pixelquest.jpg', 'Pixel Quest is a side-scrolling action puzzle with beautiful retro graphics and a great series of challenges. Rex, the main character, is a skilled and athletic adventurer deep in the jungle. Dash under falling spikes, jump from wall to wall, and keep Rex alive as he searches for the ultimate treasure!', 'Use WSAD or Arrow Keys to Move L or Z to Dash', '&lt;iframe src="http://www.freeonlinegames.com/embed/21869" width="640" height="530" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(2, 'Logic Level Pack', 'logiclevelpack.jpg', 'Hit Logic is back with even more fiendish checker puzzles for you to solve! Get all the red pieces out of the board in the smallest amount of moves, and be careful not to dispose of the other colors! Can you solve all the puzzles or will you give up? Your logic skills will be put to the test in this difficult puzzle game!', 'Use the mouse to aim and shoot.', '&lt;iframe src="http://www.freeonlinegames.com/embed/21717" width="640" height="480" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(2, 'Assembots', 'assembots.jpg', 'Assembots is a Strategy Game. You must guide your robot team from the factory safely to their destination. Assign different taks to the robots at the correct moment. There are 11 tasks such as breaking through walls and floors to blasting through rock, building bridges, and swimming. Use the pause button to think ahead and plan your strategy.', 'Use your mouse to instruct each robot of their job. Be sure to use pause if you need a little more time to assess and plan your route to safety. You can also scroll through the challenge by moving your mouse to the sides of the screen.', '&lt;iframe src="http://www.freeonlinegames.com/embed/23938" width="640" height="480" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
go
insert into Game values(3, 'Field Forces', 'fieldforces.jpg', 'In Field Forces, training steps up several gears as you traverse the course and take on your training instructors. Use your ammo wisely and prove to the army that you''re the best of the best! SIR... Do you have what it takes to become the ultimate trooper!? Are you the ultimate force? Stay sharp and shoot to kill!', 'W,S,A,D to move Mouse to aim Left click to shoot.', '&lt;iframe src="http://www.freeonlinegames.com/embed/35055" width="640" height="400" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(3, 'Crazy Battle', 'crazybattle.jpg', 'Crazy Battle is a War game. Aiming to defend your base through 20 levels of attacks. You must control your helicopter to kill all the enemies before your base is destroyed. You will earn money for every enemy you kill. War is expansive, so use the money wisely to upgrade the your helicopter or place cannons and bombs or repair the base.', 'Use the mouse to move your crosshair and left click to shoot.', '&lt;iframe src="http://www.freeonlinegames.com/embed/21753" width="640" height="530" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(3, 'Alien Assault', 'alienassault.jpg', 'Alien Assault is a Fast Paced Defense Game. Hundreds of alien creatures are trying to blow up your base. Luckily you have soldiers as well as your own weapon to help you defend the building. At the start of each wave of attacks you will be shown where the invasion is coming from, so use those few seconds to rearrange your troops and give them orders, you can do this by holding the left mouse key down over the character. Watch your ammo level, once it’s gone, you will have to look for pickups.', 'Use the mouse to aim and shoot.', '&lt;iframe src="http://www.freeonlinegames.com/embed/38203" width="670" height="392" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
insert into Game values(3, 'Parabirds', 'parabirds.jpg', 'The birds are attacking the Beavers! Flying above, they''re bombarding you with their elite paratroopers! Get on board the Beaver Cannon and shoot down your aggressors before they drop their dangerous cargo! Upgrade your cannon as you progress in the game. Can you save the Beavers from the feathered menace?', 'Use the mouse to aim the cannon. Left click to shoot. Be sure to lead your target to take shell velocity into account.', '&lt;iframe src="http://www.freeonlinegames.com/embed/21672" width="640" height="480" frameborder="no" scrolling="no"&gt;&lt;/iframe&gt;')
go

print '*** Table: Album ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'Album')
begin
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountPhoto_Album')
	begin
		alter table AccountPhoto drop constraint fk_AccountPhoto_Album
	end
	if exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_NAME = N'fk_AccountVideo_Album')
	begin
		alter table AccountVideo drop constraint fk_AccountVideo_Album
	end

	drop table dbo.Album
end
go
create table dbo.Album
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(50) not null
)
go

print '*** Table: AccountPhoto ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountPhoto')
begin
	drop table dbo.AccountPhoto
end
go
create table dbo.AccountPhoto
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountPhoto_Account foreign key references [Account](Id),
	AlbumId int not null constraint fk_AccountPhoto_Album foreign key references Album(Id),
	Name nvarchar(100) null,
	[Description] text null,
	PhotoFile nvarchar(250) not null
)
go

print '*** Table: AccountVideo ******************************************************'
if exists(select 1 from INFORMATION_SCHEMA.TABLES where TABLE_NAME = N'AccountVideo')
begin
	drop table dbo.AccountVideo
end
go
create table dbo.AccountVideo
(
	Id int identity(1,1) not null primary key,
	AccountId int not null constraint fk_AccountVideo_Account foreign key references [Account](Id),
	AlbumId int not null constraint fk_AccountVideo_Album foreign key references Album(Id),
	Name nvarchar(100) null,
	[Description] text null,
	Url text not null
)
go

print '--------------- ADD Accounts ----------------'
insert into Account values('Gilbert', 'Sauceda','Gil','gilbert.sauceda@gmail.com','mcave','gilbert.sauceda@gmail.com','mcave','San Antonio',44,'78228',229,'profile_pic_gilbert.sauceda_gmail.com.jpg','backimg_gilbert.sauceda_gmail.com.jpg','565BF721-6FFB-4203-AAFA-2ED7E1382BC2',1,'DDA3BD2E-6185-4993-BACD-C92852D5657D',1,NULL,'http://www.msn.com','resume_gilbert.sauceda_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
insert into Account values('Thomas', 'Burlew', 'Tommy', 'brokertom@gmail.com', 'mcave', 'myboss@wifes.com', 'mcave', 'Round Rock', 44, '78681', 229, 'profile_pic_brokertom_gmail.com.jpg', 'backimg_brokertom_gmail.com.jpg', '565BF721-6FFB-4203-AAFA-2ED7E1382BC2', 1, 'DDA3BD2E-6185-4993-BACD-C92852D5657D', 1, NULL, 'http://www.msn.com', 'resume_brokertom_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
insert into Account values('Ronald', 'McDonald', 'Ronny', 'ronny@webdeventerprises.com', 'mcave', 'rhonda@webdeventerprises.com', 'mcave', 'San Antonio', 44, '78228', 229, 'profile_pic_ronny_webdeventerprises.com.jpg', 'backimg_ronny_webdeventerprises.com.jpg', '565BF721-6FFB-4203-AAFA-2ED7E1382BC2', 1, 'DDA3BD2E-6185-4993-BACD-C92852D5657D', 1, NULL, 'http://www.msn.com', 'resume_gilbert.sauceda_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
insert into Account values('Brian', 'Feldman', 'Brye', 'bri@webdeventerprises.com', 'mcave', 'briana@webdeventerprises.com', 'mcave', 'San Antonio', 44, '78228', 229, 'profile_pic_bri_webdeventerprises.com.jpg', 'backimg_bri_webdeventerprises.com.jpg', '565BF721-6FFB-4203-AAFA-2ED7E1382BC2', 1, 'DDA3BD2E-6185-4993-BACD-C92852D5657D', 1, NULL, 'http://www.msn.com', 'resume_gilbert.sauceda_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
insert into Account values('Bill', 'Gates', 'Billy', 'bill@webdeventerprises.com', 'mcave', 'brandy@webdeventerprises.com', 'mcave', 'San Antonio', 44, '78228', 229, 'profile_pic_bill_webdeventerprises.com.jpg', 'backimg_bill_webdeventerprises.com.jpg', '565BF721-6FFB-4203-AAFA-2ED7E1382BC2', 1, 'DDA3BD2E-6185-4993-BACD-C92852D5657D', 1, NULL, 'http://www.msn.com', 'resume_gilbert.sauceda_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
insert into Account values('Sam', 'Garza', 'Sammy', 'sam@webdeventerprises.com', 'mcave', 'sofia@webdeventerprises.com', 'mcave', 'San Antonio', 44, '78228', 229, 'profile_pic_sam_webdeventerprises.com.jpg', 'backimg_sam_webdeventerprises.com.jpg', '565BF721-6FFB-4203-AAFA-2ED7E1382BC2', 1, 'DDA3BD2E-6185-4993-BACD-C92852D5657D', 1, NULL, 'http://www.msn.com', 'resume_gilbert.sauceda_gmail.com.pdf','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue','DarkCyan','Black','AliceBlue',50,19,'Black','My Radio','/media/radio','tile-radio.png','My Forums','/manforums/?mine=1','tile-forums.png','My Profile','/account/profile','tile-profile.png','My Friend Requests','/messages/notifications','tile-friends.png','My Photos','/media/photos','tile-photos.png','Mnews','/mannews','tile-news.png',NULL,NULL,5,'2014-08-22 01:19:33.830','signup','2014-08-22 01:30:36.060','signup')
go

print '--------------- ADD Friends ----------------'
insert into AccountFriend values(1, 2)
insert into AccountFriend values(1, 3)
insert into AccountFriend values(1, 4)
insert into AccountFriend values(1, 5)
insert into AccountFriend values(1, 6)
go
insert into AccountFriend values(2, 1)
insert into AccountFriend values(2, 3)
insert into AccountFriend values(2, 4)
insert into AccountFriend values(2, 5)
insert into AccountFriend values(2, 6)
go



/*

sp_columns account

select * from accountphoto

select * from forummessage

select * from accountfavsite

select * from accountpost

select * from accountskill

select * from accountvideo

select * from account

select * from communication

select * from accountfriend
	
update Account set password = '1ergnas1' where id = 5

*/

