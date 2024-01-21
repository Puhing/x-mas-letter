-- [TABLE CREATE SQL] TB_QWER_MAILBOX
CREATE TABLE `TB_QWER_MAILBOX` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contents` varchar(255) DEFAULT NULL,
  `author` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- [TABLE CREATE SQL] TB_REQUEST_QWER
CREATE TABLE `TB_REQUEST_QWER` (
  `userId` int unsigned NOT NULL,
  `who` int NOT NULL,
  `addedAt` datetime DEFAULT NULL,
  `requestDate` date NOT NULL,
  PRIMARY KEY (`userId`,`requestDate`),
  UNIQUE KEY `userId` (`userId`,`who`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- [TABLE CREATE SQL] TB_USER
CREATE TABLE `TB_USER` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `uuid` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `uid` (`uid`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- [TABLE CREATE SQL] TB_USER_CHAT
CREATE TABLE `TB_USER_CHAT` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `socketId` varchar(255) DEFAULT NULL,
  `content` longblob,
  `type` int DEFAULT NULL COMMENT '1:txt, 2:audio, 3:image',
  `addedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `nickname` varchar(255) DEFAULT NULL,
  `roomNow` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- [TABLE CREATE SQL] TB_USER_MAILBOX
CREATE TABLE `TB_USER_MAILBOX` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `content` text,
  `type` int DEFAULT NULL COMMENT '1:txt, 2:audio, 3:qwer',
  `addedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `from` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

