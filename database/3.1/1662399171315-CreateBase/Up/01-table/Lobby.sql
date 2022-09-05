CREATE TABLE `lobby` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `ChannelId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  `Cooldown` int NOT NULL,
  `LastUsed` datetime NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;