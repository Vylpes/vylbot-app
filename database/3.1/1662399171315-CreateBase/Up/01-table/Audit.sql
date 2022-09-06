CREATE TABLE `audit` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `AuditId` varchar(255) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `AuditType` int NOT NULL,
  `Reason` varchar(255) NOT NULL,
  `ModeratorId` varchar(255) NOT NULL,
  `ServerId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;