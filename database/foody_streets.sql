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
-- Table structure for table `streets`
--

DROP TABLE IF EXISTS `streets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `streets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `street_id` int(11) NOT NULL,
  `street_name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `city_id_UNIQUE` (`city_id`,`district_id`,`street_id`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streets`
--

LOCK TABLES `streets` WRITE;
/*!40000 ALTER TABLE `streets` DISABLE KEYS */;
INSERT INTO `streets` VALUES (1,1,1,1,'An Xá'),(2,1,1,2,'Bà Huyện Thanh Quan'),(3,1,1,3,'Bắc Sơn'),(4,1,1,4,'Bưởi'),(5,1,1,5,'Cao Bá Quát'),(6,1,1,6,'Cầu Giấy'),(7,1,1,7,'Châu Long'),(8,1,1,8,'Chu Văn An'),(9,1,1,9,'Chùa Một Cột'),(10,1,1,10,'Cửa Bắc'),(11,1,1,11,'Đặng Dung'),(12,1,1,12,'Đặng Tất'),(13,1,1,13,'Đào Tấn'),(14,1,1,14,'Điện Biên Phủ'),(15,1,1,15,'Độc Lập'),(16,1,1,16,'Đốc Ngữ'),(17,1,1,17,'Đội Cấn'),(18,1,1,18,'Đội Nhân'),(19,1,1,19,'Giang Văn Minh'),(20,1,1,20,'Giảng Võ'),(21,1,1,21,'Hàng Bún'),(22,1,1,22,'Hàng Đậu'),(23,1,1,23,'Hàng Than'),(24,1,1,24,'Hoàng Diệu'),(25,1,1,25,'Hoàng Hoa Thám'),(26,1,1,26,'Hoàng Văn Thụ'),(27,1,1,27,'Hòe Nhai'),(28,1,1,28,'Hồng Hà'),(29,1,1,29,'Hồng Phúc'),(30,1,1,30,'Hùng Vương'),(31,1,1,31,'Huỳnh Thúc Kháng'),(32,1,1,32,'Khúc Hạo'),(33,1,1,33,'Kim Mã'),(34,1,1,34,'Kim Mã Thượng'),(35,1,1,35,'La Thành'),(36,1,1,36,'Lạc Chính'),(37,1,1,37,'Láng Hạ'),(38,1,1,38,'Lê Duẩn'),(39,1,1,39,'Lê Hồng Phong'),(40,1,1,40,'Lê Trực'),(41,1,1,41,'Liễu Giai'),(42,1,1,42,'Linh Lang'),(43,1,1,43,'Lý Nam Đế'),(44,1,1,44,'Mạc Đĩnh Chi'),(45,1,1,45,'Mai Anh Tuấn'),(46,1,1,46,'Nam Cao'),(47,1,1,47,'Nam Tràng'),(48,1,1,48,'Nghĩa Dũn'),(49,1,1,49,'Ngọc Hà'),(50,1,1,50,'Ngọc Khánh'),(51,1,1,51,'Ngũ Xã'),(52,1,1,52,'Nguyễn Biểu'),(53,1,1,53,'Nguyễn Cảnh Chân'),(54,1,1,54,'Nguyễn Chí Thanh'),(55,1,1,55,'Nguyễn Công Hoan'),(56,1,1,56,'Nguyên Hồng'),(57,1,1,57,'Nguyễn Khắc Hiếu'),(58,1,1,58,'Nguyễn Khắc Nhu'),(59,1,1,59,'Nguyễn Phạm Tuân'),(60,1,1,60,'Nguyễn Thái Học'),(61,1,1,61,'Nguyễn Thiếp'),(62,1,1,62,'Nguyễn Tri Phương'),(63,1,1,63,'Nguyễn Trung Trực'),(64,1,1,64,'Nguyễn Trường Tộ'),(65,1,1,65,'Nguyễn Văn Ngọc'),(66,1,1,66,'Núi Trúc'),(67,1,1,67,'Ông Ích Khiêm'),(68,1,1,68,'Phạm Hồng Thái'),(69,1,1,69,'Phạm Huy Thông'),(70,1,1,70,'Phan Đình Phùng'),(71,1,1,71,'Phan Huy Ích'),(72,1,1,72,'Phan Kế Bính'),(73,1,1,73,'Phó Đức Chính'),(74,1,1,74,'Phúc Xá'),(75,1,1,75,'Quần Ngựa'),(76,1,1,76,'Quán Thánh'),(77,1,1,77,'Sơn Tây'),(78,1,1,78,'Tân Ấp'),(79,1,1,79,'Thanh Bảo'),(80,1,1,80,'Thành Công'),(81,1,1,81,'Thanh Niên'),(82,1,1,82,'Tôn Thất Đàm'),(83,1,1,83,'Tôn Thất Thiệp'),(84,1,1,84,'Trần Huy Liệu'),(85,1,1,85,'Trần Phú'),(86,1,1,86,'Trần Tế Xương'),(87,1,1,87,'Trấn Vũ'),(88,1,1,88,'Trúc Bạch'),(89,1,1,89,'Vạn Bảo'),(90,1,1,90,'Văn Cao'),(91,1,1,91,'Vạn Phúc'),(92,1,1,92,'Vĩnh Phúc'),(93,1,1,93,'Yên Ninh'),(94,1,1,94,'Yên Phụ'),(95,1,1,95,'Yên Thế'),(96,1,4,1,'Bưởi'),(97,1,4,2,'Cầu Giấy'),(98,1,4,3,'Chùa Hà'),(99,1,4,4,'Đặng Thùy Trâm'),(100,1,4,5,'Dịch Vọng'),(101,1,4,6,'Dịch Vọng Hậu'),(102,1,4,7,'Đỗ Quang'),(103,1,4,8,'Doãn Kế Thiện'),(104,1,4,9,'Dương Đình Nghệ'),(105,1,4,10,'Dương Khuê'),(106,1,4,11,'Dương Quảng Hàm'),(107,1,4,12,'Duy Tân'),(108,1,4,13,'Đại lộ Thăng Long'),(109,1,4,14,'Hạ Yên'),(110,1,4,15,'Hồ Tùng Mậu'),(111,1,4,16,'Hoa Bằng'),(112,1,4,17,'Hoàng Đạo Thúy'),(113,1,4,18,'Hoàng Minh Giám'),(114,1,4,19,'Hoàng Ngân'),(115,1,4,20,'Hoàng Quốc Việt'),(116,1,4,21,'Hoàng Sâm'),(117,1,4,22,'Khuất Duy Tiến'),(118,1,4,23,'Lạc Long Quân'),(119,1,4,24,'Lê Đức Thọ'),(120,1,4,25,'Lê Văn Lương'),(121,1,4,26,'Mạc Thái Tổ'),(122,1,4,27,'Mạc Thái Tông'),(123,1,4,28,'Mai Dịch'),(124,1,4,29,'Nghĩa Đô'),(125,1,4,30,'Nghĩa Tân'),(126,1,4,31,'Nguyễn Chánh'),(127,1,4,32,'Nguyễn Đình Hoàn'),(128,1,4,33,'Nguyễn Khả Trạc'),(129,1,4,34,'Nguyễn Khang'),(130,1,4,35,'Nguyễn Khánh Toàn'),(131,1,4,36,'Nguyễn Ngọc Vũ'),(132,1,4,37,'Nguyễn Phong Sắc'),(133,1,4,38,'Nguyễn Thị Định'),(134,1,4,39,'Nguyễn Thị Thập'),(135,1,4,40,'Nguyễn Văn Huyên'),(136,1,4,41,'Phạm Hùng'),(137,1,4,42,'Phạm Thận Duật'),(138,1,4,43,'Phạm Tuấn Tài'),(139,1,4,44,'Phạm Văn Bạch'),(140,1,4,45,'Phạm Văn Đồng'),(141,1,4,46,'Phan Văn Trường'),(142,1,4,47,'Phùng Chí Kiên'),(143,1,4,48,'Quan Hoa'),(144,1,4,49,'Quan Nhân'),(145,1,4,50,'Thành Thái'),(146,1,4,51,'Thọ Tháp'),(147,1,4,52,'Tô Hiệu'),(148,1,4,53,'Tôn Thất Thuyết'),(149,1,4,54,'Trần Bình'),(150,1,4,55,'Trần Cung'),(151,1,4,56,'Trần Đăng Ninh'),(152,1,4,57,'Trần Duy Hưng'),(153,1,4,58,'Trần Kim Xuyến'),(154,1,4,59,'Trần Quốc Hoàn'),(155,1,4,60,'Trần Quốc Vượng'),(156,1,4,61,'Trần Quý Kiên'),(157,1,4,62,'Trần Thái Tông'),(158,1,4,63,'Trần Tử Bình'),(159,1,4,64,'Trần Vỹ'),(160,1,4,65,'Trung Hòa'),(161,1,4,66,'Trung Kính'),(162,1,4,67,'Trương Công Giai'),(163,1,4,68,'Võ Chí Công'),(164,1,4,69,'Vũ Phạm Hàm'),(165,1,4,70,'Xuân Thủy'),(166,1,4,71,'Yên Hòa'),(167,1,8,1,'An Trạch'),(168,1,8,2,'Bích Câu'),(169,1,8,3,'Cát Linh'),(170,1,8,4,'Cầu Giấy'),(171,1,8,5,'Cầu Mới'),(172,1,8,6,'Chợ Khâm Thiên'),(173,1,8,7,'Chùa Bộc'),(174,1,8,8,'Chùa Láng'),(175,1,8,9,'Đặng Tiến Đông'),(176,1,8,10,'Đặng Trần Côn'),(177,1,8,11,'Đặng Văn Ngữ'),(178,1,8,12,'Đào Duy Anh'),(179,1,8,13,'Đoàn Thị Điểm'),(180,1,8,14,'Đông Các'),(181,1,8,15,'Đông Tác'),(182,1,8,16,'Giải Phóng'),(183,1,8,17,'Giảng Võ'),(184,1,8,18,'Hàng Cháo'),(185,1,8,19,'Hào Nam'),(186,1,8,20,'Hồ Đắc Di'),(187,1,8,21,'Hồ Giám'),(188,1,8,22,'Hoàng Cầu'),(189,1,8,23,'Hoàng Ngọc Phách'),(190,1,8,24,'Hoàng Tích Trí'),(191,1,8,25,'Huỳnh Thúc Kháng'),(192,1,8,26,'Khâm Thiên'),(193,1,8,27,'Khương Thượng'),(194,1,8,28,'Kim Hoa'),(195,1,8,29,'La Thành'),(196,1,8,30,'Láng'),(197,1,8,31,'Láng Hạ'),(198,1,8,32,'Lê Duẩn'),(199,1,8,33,'Lương Định Của'),(200,1,8,34,'Lý Văn Phức'),(201,1,8,35,'Mai Anh Tuấn'),(202,1,8,36,'Nam Đồng'),(203,1,8,37,'Ngô Sĩ Liên'),(204,1,8,38,'Ngô Tất Tố'),(205,1,8,39,'Nguyễn Chí Thanh'),(206,1,8,40,'Nguyên Hồng'),(207,1,8,41,'Nguyễn Khuyến'),(208,1,8,42,'Nguyễn Lương Bằng'),(209,1,8,43,'Nguyễn Như Đổ'),(210,1,8,44,'Nguyễn Phúc Lai'),(211,1,8,45,'Nguyễn Thái Học'),(212,1,8,46,'Nguyễn Trãi'),(213,1,8,47,'Ô Chợ Dừa'),(214,1,8,48,'Phạm Ngọc Thạch'),(215,1,8,49,'Phan Phù Tiên'),(216,1,8,50,'Phan Văn Trị'),(217,1,8,51,'Pháo Đài Láng'),(218,1,8,52,'Phương Mai'),(219,1,8,53,'Quốc Tử Giám'),(220,1,8,54,'Tây Sơn'),(221,1,8,55,'Thái Hà'),(222,1,8,56,'Thái Thịnh'),(223,1,8,57,'Tôn Đức Thắng'),(224,1,8,58,'Tôn Thất Tùng'),(225,1,8,59,'Trần Hữu Tước'),(226,1,8,60,'Trần Quang Diệu'),(227,1,8,61,'Trần Quý Cáp'),(228,1,8,62,'Trịnh Hoài Đức'),(229,1,8,63,'Trúc Khê'),(230,1,8,64,'Trung Liệt'),(231,1,8,65,'Trường Chinh'),(232,1,8,66,'Văn Miếu'),(233,1,8,67,'Vĩnh Hồ'),(234,1,8,68,'Võ Văn Dũng'),(235,1,8,69,'Vọng'),(236,1,8,70,'Vũ Ngọc Phan'),(237,1,8,71,'Vũ Thạnh'),(238,1,8,72,'Xã Đàn'),(239,1,8,73,'Y Miếu'),(240,1,8,74,'Yên Lãng');
/*!40000 ALTER TABLE `streets` ENABLE KEYS */;
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
