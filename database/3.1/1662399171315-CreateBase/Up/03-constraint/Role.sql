ALTER TABLE `role`
  ADD CONSTRAINT `FK_d9e438d88cfb64f7f8e1ae593c3` FOREIGN KEY (`serverId`) REFERENCES `server` (`Id`);