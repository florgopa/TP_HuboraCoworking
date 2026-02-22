-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-02-2026 a las 09:25:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hubora`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacio`
--

CREATE TABLE `espacio` (
  `id` int(11) NOT NULL,
  `tipo` enum('box_privado','sala_reunion','sala_conferencia','auditorio') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `espacio`
--

INSERT INTO `espacio` (`id`, `tipo`, `nombre`, `precio`, `activo`, `created_at`) VALUES
(1, 'box_privado', 'Box Privado 1', 10000.00, 1, '2026-02-22 05:56:29'),
(2, 'box_privado', 'Box Privado 2', 10000.00, 1, '2026-02-22 05:56:29'),
(3, 'box_privado', 'Box Privado 3', 10000.00, 1, '2026-02-22 05:56:29'),
(4, 'box_privado', 'Box Privado 4', 10000.00, 1, '2026-02-22 05:56:29'),
(5, 'box_privado', 'Box Privado 5', 10000.00, 1, '2026-02-22 05:56:29'),
(6, 'box_privado', 'Box Privado 6', 10000.00, 1, '2026-02-22 05:56:29'),
(7, 'box_privado', 'Box Privado 7', 10000.00, 1, '2026-02-22 05:56:29'),
(8, 'box_privado', 'Box Privado 8', 10000.00, 1, '2026-02-22 05:56:29'),
(9, 'sala_reunion', 'Sala de Reuniones 1', 15000.00, 1, '2026-02-22 05:56:29'),
(10, 'sala_reunion', 'Sala de Reuniones 2', 15000.00, 1, '2026-02-22 05:56:29'),
(11, 'sala_reunion', 'Sala de Reuniones 3', 15000.00, 1, '2026-02-22 05:56:29'),
(12, 'sala_conferencia', 'Sala de Conferencia 1', 20000.00, 1, '2026-02-22 05:56:29'),
(13, 'sala_conferencia', 'Sala de Conferencia 2', 20000.00, 1, '2026-02-22 05:56:29'),
(14, 'sala_conferencia', 'Sala de Conferencia 3', 20000.00, 1, '2026-02-22 05:56:29'),
(15, 'auditorio', 'Auditorio', 30000.00, 1, '2026-02-22 05:56:29'),
(16, 'auditorio', 'Auditorio Este', 30000.00, 1, '2026-02-22 07:14:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE `perfil_usuario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(50) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(30) DEFAULT NULL,
  `tiene_mascota` tinyint(1) DEFAULT 0,
  `mascota_nombre` varchar(50) DEFAULT NULL,
  `mascota_tipo` enum('perro','gato','otro') DEFAULT NULL,
  `locker_numero` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil_usuario`
--

INSERT INTO `perfil_usuario` (`id`, `usuario_id`, `nombre`, `apellido`, `direccion`, `telefono`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `tiene_mascota`, `mascota_nombre`, `mascota_tipo`, `locker_numero`, `updated_at`) VALUES
(3, 6, 'Juan', 'Perez', 'Calle 32', '911 555 987654', 'Ramón', '911 555 123456', 1, 'Gregorio', 'perro', 1, '2026-02-22 05:08:48'),
(6, 7, 'Jorge', 'Suspenso', 'Avenida 123', '261 123456', 'Bombita Rodriguez', '261 654321', 1, 'Felipe', 'gato', 2, '2026-02-22 05:44:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` varchar(36) NOT NULL,
  `usuario_email` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `espacio_id` varchar(50) NOT NULL,
  `espacio_nombre` varchar(100) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('pendiente_pago','confirmada','cancelada') DEFAULT 'pendiente_pago',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id`, `usuario_email`, `usuario_id`, `fecha`, `espacio_id`, `espacio_nombre`, `hora_inicio`, `hora_fin`, `estado`, `created_at`) VALUES
('079ea214-7a5e-4854-880b-4c2cfb2de286', 'cliente@hubora.com', 6, '2026-02-27', 'box_2', 'Box Privado 2', '14:00:00', '20:00:00', 'cancelada', '2026-02-21 23:35:07'),
('096897dc-e8a9-497b-94ce-8285d3b386ac', 'cliente@hubora.com', 6, '2026-03-06', 'box_2', 'Box Privado 2', '14:00:00', '20:00:00', 'cancelada', '2026-02-22 01:05:18'),
('33652f38-942f-43bc-aa32-6118716027ea', 'cliente@hubora.com', 6, '2026-02-23', 'box_1', 'Box Privado 1', '07:00:00', '13:00:00', 'cancelada', '2026-02-21 23:50:14'),
('5f6ae145-c105-4c4d-a541-02601d771038', 'cliente@hubora.com', 6, '2026-02-27', 'box_7', 'Box Privado 7', '07:00:00', '13:00:00', 'confirmada', '2026-02-22 02:21:39'),
('6bda354f-a842-4f4b-a945-8bff0721eae1', 'cliente@hubora.com', 6, '2026-03-06', 'reunion_2', 'Sala de Reuniones 2', '14:00:00', '20:00:00', 'confirmada', '2026-02-22 02:14:46'),
('9ce3d713-4cca-44f7-b8a3-8a85b53d8984', 'cliente@hubora.com', 6, '2026-02-25', '1', 'Box Privado 1', '07:00:00', '13:00:00', 'confirmada', '2026-02-22 04:28:06'),
('d1136e15-17bb-4950-9149-2d916fd4db19', 'cliente@hubora.com', 6, '2026-02-23', 'box_1', 'Box Privado 1', '07:00:00', '13:00:00', 'confirmada', '2026-02-22 01:06:41'),
('f4a85382-e5bc-45b3-b3b6-75e28613d3c5', 'clientebasico@hubora.com', 7, '2026-03-19', 'auditorio_1', 'Auditorio', '13:00:00', '19:00:00', 'confirmada', '2026-02-22 02:41:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'cliente',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `plan_contratado` enum('basico','premium') NOT NULL DEFAULT 'basico',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `password`, `role`, `activo`, `plan_contratado`, `created_at`) VALUES
(5, 'admin@hubora.com', '$2b$10$TTtJJ1oBTYyUYF2oz1iqK.QZ92EpfxEqBfuCywPM2bP0veqmT6owu', 'admin', 1, '', '2026-02-22 01:40:12'),
(6, 'cliente@hubora.com', '$2b$10$TTtJJ1oBTYyUYF2oz1iqK.QZ92EpfxEqBfuCywPM2bP0veqmT6owu', 'cliente', 1, 'premium', '2026-02-22 01:40:12'),
(7, 'clientebasico@hubora.com', '$2b$10$24CVEMQOeeRuPzRD4gQvce8TGnhmXhqcuwJkQfHFsJdynbJXcbmkC', 'cliente', 1, 'basico', '2026-02-22 05:37:17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `espacio`
--
ALTER TABLE `espacio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_perfil_usuario_usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `uq_locker_numero` (`locker_numero`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reserva_usuario` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `espacio`
--
ALTER TABLE `espacio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD CONSTRAINT `perfil_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
