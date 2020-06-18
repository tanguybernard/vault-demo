
CREATE TABLE IF NOT EXISTS `account` (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
username varchar(255) NOT NULL DEFAULT ''
);
INSERT INTO `account` (`username`) VALUES ('bob');
INSERT INTO `account` (`username`) VALUES ('alice');