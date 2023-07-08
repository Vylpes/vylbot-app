ALTER TABLE `setting`
  ADD CONSTRAINT `FK_a3623ec541bdb12fa0f58bdfde7` FOREIGN KEY (`serverId`) REFERENCES `server` (`Id`);