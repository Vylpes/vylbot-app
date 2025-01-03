CREATE TABLE auto_kick_config (
    Id varchar(255) NOT NULL,
    WhenCreated datetime NOT NULL,
    WhenUpdated datetime NOT NULL,
    ServerId varchar(255) NOT NULL,
    RoleId varchar(255) NOT NULL,
    KickTime int NOT NULL,
    NoticeTime int NULL,
    NoticeChannelId varchar(255) NULL
);
