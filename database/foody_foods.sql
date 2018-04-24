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
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `foods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` longtext,
  `prices` int(11) DEFAULT NULL,
  `city_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `street_id` int(11) NOT NULL,
  `street_number` varchar(45) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `detail_category_id` varchar(45) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `restaurant_id` int(10) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_foods_ress_idx` (`restaurant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'xvxcxcv','bvcvbcvb',150000,1,1,1,'sfsdf',3,'6',1,1,NULL,NULL),(2,'xvxcxcv','bvcvbcvb',150000,1,1,1,'sfsdf',3,'6',1,1,NULL,NULL),(3,'xvxcxcv','bvcvbcvb',150000,1,1,1,'sfsdf',3,'6',1,1,NULL,NULL),(4,'xvxcxcv','bvcvbcvb',150000,1,1,1,'sfsdf',3,'6',1,1,NULL,NULL),(5,'Chè','Miêu tả',150000,1,4,10,'123',3,'7',1,1,NULL,NULL),(6,'Chè','Miêu tả',150000,1,4,10,'123',3,'7',1,1,NULL,NULL),(7,'Cháo','Miêu tả',150000,1,1,2,'123',3,'5',1,1,NULL,NULL),(8,'tôm ghẹ','Miêu tả',160000,1,8,8,'123',2,'4',1,9,NULL,NULL),(9,'fsdfsd','fsdfsdf',1230000,1,4,4,'333',1,'1',1,4,NULL,NULL),(10,'sfd','fsdfsdf',1230000,1,4,2,'ssfsdf',1,'1',1,11,NULL,NULL),(11,'sfsdf','sfdf',1230000,1,1,1,'sfsd',2,'3',1,12,NULL,NULL),(12,'gdfgdf','dgdf',1230000,1,1,1,'sfssdfsd',1,'1',1,13,NULL,NULL),(13,'vv','vxcv',1230000,1,1,2,'xvcx',1,'1',1,14,NULL,NULL),(14,'sfsdfsdf','sdfsd',1230000,1,1,1,'sfd',1,'1',2,1,NULL,NULL),(15,'sfsdfsdf','sdfsd',1230000,1,1,1,'sfd',1,'1',2,17,NULL,NULL),(16,'sfsdfsdf','sdfsd',1230000,1,1,1,'sfd',1,'1',2,17,NULL,NULL),(17,'sfsdfsdf','sdfsd',1230000,1,1,1,'sfd',1,'1',2,25,NULL,NULL),(18,'Phở bò','ngon',1230000,1,1,1,'123',3,'6',2,26,NULL,NULL);
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
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
