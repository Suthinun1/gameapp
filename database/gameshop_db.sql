-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2026 at 07:39 PM
-- Server version: 8.0.45
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gameshop_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Game`
--

CREATE TABLE `Game` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isSold` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Game`
--

INSERT INTO `Game` (`id`, `title`, `price`, `platform`, `code`, `imageUrl`, `isSold`) VALUES
(11111114, 'Lucky\'s Tale', 67, 'PC', 'Lucky\'s Tale', 'https://th.bing.com/th/id/OIP.7S34ltX52LRIMnQu0FGnoQHaDt?w=347&h=175&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111119, 'R.E.P.O.', 199, 'PC', 'R.E.P.O.', 'https://th.bing.com/th/id/OIP.RPKOUcXEPVYmzwWethsyKwHaEN?w=316&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111120, 'Grand Theft Auto V Enhanced', 479, 'PC', 'Grand Theft Auto V Enhanced', 'https://th.bing.com/th/id/OIP.kG2K52qRqvxgsaVMI_q0lgHaEK?w=276&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111121, 'Need for Speed™ Unbound', 265, 'PC', 'Need for Speed™ Unbound', 'https://th.bing.com/th/id/OIP.fKCGK-XSSM3xv-aj06g0IgAAAA?w=125&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111122, 'The Sims™ 4 Seasons', 549, 'PC', 'The Sims™ 4 Seasons', 'https://th.bing.com/th/id/OIP.nnmTNYoChgJpJ1O29qu4LQHaHa?w=173&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111123, 'Need for Speed™ Most Wanted', 135, 'PC', 'Need for Speed™ Most Wanted', 'https://th.bing.com/th/id/OIP.v-bq38uY8wFqjcgeJP0XnQHaKX?w=125&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111125, 'Flashing Lights - Police, Firefighting, Emergency Services (EMS) Simulator', 63, 'PC', 'Flashing Lights - Police, Firefighting, Emergency Services (EMS) Simulator', 'https://th.bing.com/th/id/OIP.Nb3TMvzAt7vqHxl8he6VqAHaEK?w=309&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 0),
(11111126, 'Red Dead Redemption 2', 474, 'PC', 'Red Dead Redemption 2', 'https://th.bing.com/th/id/OIP.Mvqh5xhx-dWQWDDsV7dVMwHaEK?w=329&h=185&c=7&r=0&o=7&pid=1.7&rm=3', 0);

-- --------------------------------------------------------

--
-- Table structure for table `TopupRequest`
--

CREATE TABLE `TopupRequest` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `amount` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `TopupRequest`
--

INSERT INTO `TopupRequest` (`id`, `userId`, `amount`, `status`, `createdAt`) VALUES
(1, 5, 100, 'APPROVED', '2026-02-03 17:57:04.000'),
(2, 3, 300, 'REJECTED', '2026-02-03 17:57:40.000'),
(3, 5, 100, 'APPROVED', '2026-02-03 18:01:49.000'),
(4, 5, 100, 'REJECTED', '2026-02-03 18:03:24.000'),
(5, 5, 100, 'REJECTED', '2026-02-03 18:03:32.000'),
(6, 5, 300, 'REJECTED', '2026-02-03 18:03:36.000'),
(7, 5, 300, 'REJECTED', '2026-02-03 18:03:43.000'),
(8, 5, 100, 'REJECTED', '2026-02-03 18:04:02.000'),
(9, 5, 100, 'REJECTED', '2026-02-03 18:04:16.000'),
(10, 3, 100, 'APPROVED', '2026-02-03 18:06:12.000'),
(11, 3, 500, 'APPROVED', '2026-02-03 18:06:15.000'),
(12, 5, 100, 'REJECTED', '2026-02-03 18:06:25.000'),
(13, 5, 100, 'REJECTED', '2026-02-03 18:07:06.000'),
(14, 3, 100, 'APPROVED', '2026-02-03 18:07:43.000'),
(15, 3, 100, 'APPROVED', '2026-02-03 18:07:49.000'),
(16, 3, 300, 'APPROVED', '2026-02-03 18:08:42.000'),
(17, 3, 5000, 'APPROVED', '2026-02-03 18:08:48.000');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `points` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `username`, `password`, `role`, `points`) VALUES
(1, 'bbb', '1111', 'USER', 0),
(2, 'nnn', '111', 'USER', 0),
(3, 'a', '1', 'ADMIN', 15878),
(4, 'sdsdd', '111', 'USER', 0),
(5, 'sss', '111', 'USER', 326);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Game`
--
ALTER TABLE `Game`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Game_code_key` (`code`);

--
-- Indexes for table `TopupRequest`
--
ALTER TABLE `TopupRequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TopupRequest_userId_fkey` (`userId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Game`
--
ALTER TABLE `Game`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11111127;

--
-- AUTO_INCREMENT for table `TopupRequest`
--
ALTER TABLE `TopupRequest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `TopupRequest`
--
ALTER TABLE `TopupRequest`
  ADD CONSTRAINT `TopupRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
