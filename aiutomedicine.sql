-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ago 20, 2026 alle 03:14
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aiutomedicine`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `medicine`
--

CREATE TABLE `medicine` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `quantità` int(11) NOT NULL DEFAULT 0,
  `istruzione` varchar(255) DEFAULT NULL,
  `codice` varchar(9) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `nome_alternativo` varchar(255) DEFAULT NULL,
  `alberto` tinyint(1) NOT NULL DEFAULT 0,
  `dina` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `medicine`
--

INSERT INTO `medicine` (`id`, `nome`, `quantità`, `istruzione`, `codice`, `nome_alternativo`, `alberto`, `dina`) VALUES
(1, 'duoplavin', 46, '{\"name\": \"duoplavin\",\"schedule\": \"0 12 * * *\",\"task\": \"1\"}', '039763091', 'dopo pranzo', 1, 0),
(2, 'spirolang', 20, '{\"name\": \"spirolang\",\"schedule\":\"0 16 * * *\",\"task\":\"1\"}', '019913021', 'delle 4', 1, 0),
(3, 'forxiga', 56, '{\"name\":\"forxiga\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', '042494070', 'della mattina', 1, 0),
(4, 'congescor', 46, '{\"name\":\"congescor\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', '034953024', 'delle 8', 1, 0),
(5, 'avodart', 153, '{\"name\":\"avodart\",\"schedule\":\"0 20 * * *\",\"task\":\"1\"}', '035895010', 'dopo cena', 1, 0),
(6, 'urorec', 60, '{\"name\":\"urorec\",\"schedule\":\"0 20 * * *\",\"task\":\"1\"}', '039789110', 'dopo cena', 1, 0),
(7, 'torvast', 56, '{\"name\":\"torvast\",\"schedule\":\"0 21 * * *\",\"task\":\"1\"}', '033007067', 'delle 21', 1, 0),
(8, 'bisoprololo', 29, '{\"name\":\"bisoprololo\",\"schedule\":\"0 8,20 * * *\",\"task\":\"1\"}', NULL, 'delle 8 e delle 20', 1, 0),
(9, 'novorapid', 300, '{\"name\":\"novorapid\",\"schedule\":\"0 21 * * *\",\"task\":\"20\"}', NULL, NULL, 1, 0),
(10, 'ozempic', 6, '{\"name\":\"ozempic\",\"schedule\":\"0 8 * * 1\",\"task\":\"1\"}', NULL, NULL, 1, 0),
(11, 'tresiba', 300, '{\"name\":\"tresiba\",\"schedule\":\"0 21 * * *\",\"task\":\"24\"}', NULL, NULL, 1, 0),
(12, 'reumaflex', 12, '{\"name\":\"reumaflex\",\"schedule\":\"0 8 * * 1\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(13, 'folina', 50, '{\"name\":\"folina\",\"schedule\":\"0 8,20 * * *\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(14, 'tredimin', 3, '{\"name\":\"tredimin\",\"schedule\":\"0 8 * * 1\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(15, 'sideral', 11, '{\"name\":\"sideral\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(16, 'omeprazolo', 25, '{\"name\":\"omeprazolo\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(17, 'quinazide', 53, '{\"name\":\"quinazide\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', NULL, 'della mattina', 0, 1),
(18, 'norvasc', 94, '{\"name\":\"norvasc\",\"schedule\":\"0 8 * * *\",\"task\":\"1\"}', NULL, NULL, 0, 1),
(19, 'zyloric', 51, '{\"name\":\"zyloric\",\"schedule\":\"0 8 */2 * *\",\"task\":\"1\"}', NULL, NULL, 0, 1);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `medicine`
--
ALTER TABLE `medicine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
