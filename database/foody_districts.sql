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
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `districts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_id` int(11) NOT NULL,
  `district_name` varchar(45) NOT NULL,
  `district_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `district_name_UNIQUE` (`district_name`),
  UNIQUE KEY `city_id_UNIQUE` (`city_id`,`district_name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,1,'Ba Đình',1),(2,1,'Ba Vì',2),(3,1,'Bắc Từ Liêm',3),(4,1,'Cầu Giấy',4),(5,1,'Chương Mỹ',5),(6,1,'Đan Phượng',6),(7,1,'Đông Anh',7),(8,1,'Đống Đa',8),(9,1,'Gia Lâm',9),(10,1,'Hà Đông',10),(11,1,'Hai Bà Trưng',11),(12,1,'Hoài Đức',12),(13,1,'Hoàn Kiếm',13),(14,1,'Hoàng Mai',14),(15,1,'Long Biên',15),(16,1,'Mê Linh',16),(17,1,'Mỹ Đức',17),(18,1,'Nam Từ Liêm',18),(19,1,'Phú Xuyên',19),(20,1,'Phúc Thọ',20),(21,1,'Quốc Oai',21),(22,1,'Sóc Sơn',22),(23,1,'Sơn Tây',23),(24,1,'Tây Hồ',24),(25,1,'Thạch Thất',25),(26,1,'Thanh Oai',26),(27,1,'Thanh Trì',27),(28,1,'Thanh Xuân',28),(29,1,'Thường Tín',29),(30,1,'Ứng Hòa',30);
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
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
