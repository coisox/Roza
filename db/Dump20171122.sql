-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: ilims.ansi.com.my    Database: roza
-- ------------------------------------------------------
-- Server version	5.7.20

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
-- Table structure for table `roza_log`
--

DROP TABLE IF EXISTS `roza_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roza_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `log_timecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `log_message` varchar(400) NOT NULL,
  `log_sql` varchar(4000) DEFAULT NULL,
  `log_status` varchar(10) NOT NULL DEFAULT 'NEW',
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roza_log`
--

LOCK TABLES `roza_log` WRITE;
/*!40000 ALTER TABLE `roza_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `roza_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roza_menu`
--

DROP TABLE IF EXISTS `roza_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roza_menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_category` varchar(45) NOT NULL,
  `menu_data` json NOT NULL,
  `menu_order` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roza_menu`
--

LOCK TABLES `roza_menu` WRITE;
/*!40000 ALTER TABLE `roza_menu` DISABLE KEYS */;
INSERT INTO `roza_menu` VALUES (1,'Sample','{\"icon\": \"fa fa-address-book\", \"list\": [{\"icon\": \"fa fa-user-circle\", \"labelbi\": \"Personal\", \"labelbm\": \"Peribadi\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleStaffList.js?dummy=123\')\"}, {\"icon\": \"fa fa-sitemap\", \"labelbi\": \"B8 Chart\", \"labelbm\": \"Carta B8\"}, {\"icon\": \"fa fa-align-right\", \"labelbi\": \"List of Seniority\", \"labelbm\": \"Senarai Kekananan\"}, {\"icon\": \"fa fa-child\", \"labelbi\": \"Employment\", \"labelbm\": \"Penjawatan\"}, {\"icon\": \"fa fa-handshake-o\", \"labelbi\": \"Services\", \"labelbm\": \"Perkhidmatan\"}, {\"icon\": \"fa fa-link\", \"labelbi\": \"Integration\", \"labelbm\": \"Integrasi\"}, {\"icon\": \"fa fa-line-chart\", \"labelbi\": \"Analytical Report\", \"labelbm\": \"Laporan Analisa\"}], \"labelbi\": \"Sample Human Resource\", \"labelbm\": \"Sampel Sumber Manusia\"}',1),(2,'Sample','{\"icon\": \"fa fa-star\", \"labelbi\": \"Sample Tab\", \"labelbm\": \"Sampel Tab\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleTabList.js\')\"}',3),(3,'Sample','{\"icon\": \"fa fa-quote-right\", \"list\": [{\"icon\": \"fa fa-quote-right\", \"labelbi\": \"YYY\", \"labelbm\": \"YYY\"}, {\"icon\": \"fa fa-quote-right\", \"labelbi\": \"ZZZ\", \"labelbm\": \"ZZZ\"}], \"labelbi\": \"Sample XXX\", \"labelbm\": \"Sampel XXX\"}',2);
/*!40000 ALTER TABLE `roza_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roza_ui`
--

DROP TABLE IF EXISTS `roza_ui`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roza_ui` (
  `ui_id` int(11) NOT NULL AUTO_INCREMENT,
  `ui_category` varchar(50) DEFAULT NULL,
  `ui_timecreate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ui_timeupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ui_data` json DEFAULT NULL,
  PRIMARY KEY (`ui_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roza_ui`
--

LOCK TABLES `roza_ui` WRITE;
/*!40000 ALTER TABLE `roza_ui` DISABLE KEYS */;
INSERT INTO `roza_ui` VALUES (1,'Sample','2017-11-21 06:57:07','2017-11-21 06:57:07','[{\"source\": \"SL_SampleStaff.sql\", \"element\": \"standardlist\", \"labelbi\": \"List of Officer\", \"labelbm\": \"Senarai Pegawai\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleStaffInfo.js?staff_id=[[ROZA_ID]]\')\", \"parameterize\": [\"{{dummy}}\"]}]'),(2,'Sample','2017-11-21 06:59:03','2017-11-21 06:59:03','[{\"icon\": \"fa fa-plus\", \"list\": [{\"labelbi\": \"Officer Registration\", \"labelbm\": \"Daftar Pegawai\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleStaffInfo.js\')\"}, {\"labelbi\": \"Vendor Registration\", \"labelbm\": \"Daftar Vendor\"}], \"element\": \"taskbar\", \"labelbi\": \"New\", \"labelbm\": \"Baru\"}, {\"icon\": \"fa fa-list\", \"list\": [{\"labelbi\": \"Officer\", \"labelbm\": \"Pegawai\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleStaffList.js\')\"}, {\"labelbi\": \"Vendor\", \"labelbm\": \"Vendor\"}], \"element\": \"taskbar\", \"labelbi\": \"List\", \"labelbm\": \"Senarai\"}]'),(3,'Sample','2017-11-21 07:08:02','2017-11-21 17:25:26','[{\"source\": \"DATA_SampleStaff.sql\", \"element\": \"data\", \"parameterize\": [\"{{staff_id}}\"]}, {\"source\": \"DATA_SampleToday.sql\", \"element\": \"data\"}, {\"element\": \"title\", \"labelbi\": \"Officer Info\", \"labelbm\": \"Maklumat Pegawai\"}, {\"id\": \"name\", \"element\": \"text\", \"labelbi\": \"Name\", \"labelbm\": \"Nama\", \"required\": true, \"maxlength\": 20, \"placeholderbi\": \"insert name\", \"placeholderbm\": \"masukkan nama\"}, {\"id\": \"group\", \"element\": \"text\", \"labelbi\": \"Group\", \"labelbm\": \"Kumpulan\", \"required\": true, \"maxlength\": 20, \"placeholderbi\": \"insert group\", \"placeholderbm\": \"masukkan kumpulan\"}, {\"id\": \"position\", \"element\": \"text\", \"labelbi\": \"Position\", \"labelbm\": \"Jawatan\", \"required\": true, \"placeholderbi\": \"insert position\", \"placeholderbm\": \"masukkan jawatan\"}, {\"id\": \"state\", \"source\": \"LOV_SampleState.sql\", \"element\": \"dropdown\", \"labelbi\": \"State\", \"labelbm\": \"Negeri\"}, {\"id\": \"gender\", \"source\": \"LOV_SampleGender.sql\", \"element\": \"dropdown\", \"labelbi\": \"Gender\", \"labelbm\": \"Jantina\"}, {\"id\": \"comment\", \"element\": \"textarea\", \"labelbi\": \"Comment\", \"labelbm\": \"Komen\", \"required\": true, \"maxlength\": 255, \"placeholderbi\": \"insert comment\", \"placeholderbm\": \"masukkan komen\"}, {\"element\": \"formbutton\", \"onclick\": \"rozaSubmitData({\\\"target\\\":\\\"BL_SampleSubmit.php\\\"})\"}]'),(4,'Sample','2017-11-21 07:39:52','2017-11-21 07:39:59','[{\"source\": \"SL_SampleTab.sql\", \"element\": \"standardlist\", \"labelbi\": \"List of Officer\", \"labelbm\": \"Senarai Pegawai\", \"onclick\": \"rozaCallLandingFile(\'UI_SampleTabInfo.js?staff_id=[[ROZA_ID]]\')\", \"parameterize\": [\"{{dummy}}\"]}]');
/*!40000 ALTER TABLE `roza_ui` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_lov`
--

DROP TABLE IF EXISTS `sample_lov`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_lov` (
  `lov_id` int(11) NOT NULL AUTO_INCREMENT,
  `lov_category` varchar(50) DEFAULT NULL,
  `lov_timecreate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lov_timeupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lov_data` json DEFAULT NULL,
  PRIMARY KEY (`lov_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_lov`
--

LOCK TABLES `sample_lov` WRITE;
/*!40000 ALTER TABLE `sample_lov` DISABLE KEYS */;
INSERT INTO `sample_lov` VALUES (1,'state_old','2017-10-26 07:26:02','2017-11-12 00:30:51','[{\"value\": \"\", \"labelbi\": \"\", \"labelbm\": \"\"}, {\"value\": \"SEL\", \"labelbi\": \"Selangor\", \"labelbm\": \"Selangor\"}, {\"value\": \"KUL\", \"labelbi\": \"Kuala Lumpur\", \"labelbm\": \"Kuala Lumpur\"}, {\"value\": \"MEL\", \"labelbi\": \"Melaka\", \"labelbm\": \"Melaka\"}]'),(2,'gender_old','2017-11-02 04:39:28','2017-11-12 00:39:26','[{\"value\": \"\", \"labelbi\": \"\", \"labelbm\": \"\"}, {\"value\": \"L\", \"labelbi\": \"Male\", \"labelbm\": \"Lelaki\"}, {\"value\": \"P\", \"labelbi\": \"Female\", \"labelbm\": \"Perempuan\"}, {\"value\": \"T\", \"labelbi\": \"Unknown\", \"labelbm\": \"Tidak Diketahui\"}]'),(3,'state','2017-11-12 00:31:32','2017-11-12 00:31:32','{\"value\": \"\", \"labelbi\": \"\", \"labelbm\": \"\"}'),(4,'state','2017-11-12 00:31:32','2017-11-12 00:54:05','{\"value\": \"SEL\", \"labelbi\": \"Selangor\", \"labelbm\": \"Selangor\"}'),(5,'state','2017-11-12 00:31:32','2017-11-12 00:31:32','{\"value\": \"KUL\", \"labelbi\": \"Kuala Lumpur\", \"labelbm\": \"Kuala Lumpur\"}'),(6,'state','2017-11-12 00:31:32','2017-11-12 00:31:32','{\"value\": \"MEL\", \"labelbi\": \"Melaka\", \"labelbm\": \"Melaka\"}'),(7,'gender','2017-11-12 00:39:26','2017-11-12 00:39:26','{\"value\": \"\", \"labelbi\": \"\", \"labelbm\": \"\"}'),(8,'gender','2017-11-12 00:39:26','2017-11-12 00:39:26','{\"value\": \"L\", \"labelbi\": \"Male\", \"labelbm\": \"Lelaki\"}'),(9,'gender','2017-11-12 00:39:26','2017-11-12 00:39:26','{\"value\": \"P\", \"labelbi\": \"Female\", \"labelbm\": \"Perempuan\"}');
/*!40000 ALTER TABLE `sample_lov` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_staff`
--

DROP TABLE IF EXISTS `sample_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_staff` (
  `staff_id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_timecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `staff_timeupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `staff_data` json DEFAULT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_staff`
--

LOCK TABLES `sample_staff` WRITE;
/*!40000 ALTER TABLE `sample_staff` DISABLE KEYS */;
INSERT INTO `sample_staff` VALUES (1,'2017-10-26 07:31:07','2017-11-11 09:48:44','{\"name\": \"Aizal bin Si Pulan\", \"group\": \"F41\", \"state\": \"MEL\", \"gender\": \"L\", \"status\": \"K\", \"position\": \"Ketua Kerani\"}'),(2,'2017-10-26 07:31:07','2017-11-11 09:48:44','{\"name\": \"Shida binti Si Pulan\", \"group\": \"F42\", \"state\": \"SEL\", \"gender\": \"P\", \"status\": \"T\", \"position\": \"Pegawai Penyiasat\"}'),(3,'2017-11-10 08:22:09','2017-11-11 09:48:44','{\"name\": \"Faezah binti Si Pulan\", \"group\": \"P44\", \"state\": \"KUL\", \"gender\": \"P\", \"status\": \"T\", \"position\": \"Pegawai Perubatan\"}');
/*!40000 ALTER TABLE `sample_staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-22  1:53:12
