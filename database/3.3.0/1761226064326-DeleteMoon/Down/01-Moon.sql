CREATE TABLE `moon` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `MoonNumber` int NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `WhenArchived` datetime NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

