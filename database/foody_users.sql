-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: localhost    Database: foody
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `provider` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` text NOT NULL,
  `email` varchar(45) NOT NULL,
  `token` varchar(300) DEFAULT NULL,
  `imageUrl` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rr','$2a$10$r02//YiFR/4i9MNqs/kNA.9SzKtiBl0OnUm2n0CfkqB3QpQNpFkgG','local','sfsdfsd','ffsdfsdf','sdfsdfsdfsdsf',NULL,NULL),(2,'kean','$2a$10$EucpUpNUvss779aNEpPijuqMspN1fj0Fr63XPp2BE7x5BMLBS3jTK','local','1','1','1',NULL,NULL),(3,'duckien','$2a$10$/sDyo6r12r7njad00f5ASuLXruWRE.1tc8FCMvDLVNB/MQSSMvLkG','local','11111','11','111@gmail.com1',NULL,NULL),(4,'sfsdf','$2a$10$mDmkla2JwpZ16CBHcoe5POnZKXZCcjXBryyPVrrzF.pn7UX9BQaGW','local','sfsdfsfsd','sfsdf','sfdsf@gmail.com',NULL,NULL),(5,'dgdfg','$2a$10$3O4u35z4YQBSpw7Zv4bPFOeEb9tTj0lHr5r9WuI.wXzhB2TZGef1O','local','dfgfdg','dfgdfg','keanronal@gmail.com',NULL,NULL),(6,'kaka','$2a$10$rSB2G25dDUe7bNUk5qe6ruP8ioJW1pybz8LOGFTOY/R69TvR68pgm','local','Nam','Nguyen Duc','keanronal@gmail.com',NULL,NULL),(7,'ssfsdf','$2a$10$vtmJTG9OWJ58ZJiUtapONemporDSgYQgieib8aA6W/1Wi0eFbgtP.','local','asdf','sfad','sdfsdfsdf@gmai.com',NULL,NULL),(8,'hihi','$2a$10$B7Rvhh1Bb3nmPvb8fXvmyuXYRd4oa6WSN/gZZeQLEA5HMgYor.f.W','local','asdf','sfad','sdfsdfsdf@gmai.com',NULL,NULL),(9,'haha','$2a$10$rsMFF34Nh5mPA3zrDL0GuO2.3hWHby5AXuCJxPbbyqyTryd7G.vjS','local','sfdsfsf','sdfsfds','fuck@gmail.com',NULL,NULL),(10,'hoho','$2a$10$DUZ1gVQKKqt0nQkjIXrBVurwkJv.zEWX7ZKBBdhU7KuykutE0UhcO','local','sfdsfsf','sdfsfds','fuck@gmail.com',NULL,NULL),(11,'hehe','$2a$10$M6H4C7G8TIEiwsSkEiZ4j.fwwbEbFaELIFnwizxyPaafCz560ipTK','local','afdsfds','sfsdfsfsdf','sfdsf@gmail.com',NULL,NULL),(12,'1312','$2a$10$arVmwszNFGPQLq1qdWfjpO3CIaGjDT089sQyH7MlWhefhC6d57ZB6','local','kean','11','12@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-17 10:16:40
