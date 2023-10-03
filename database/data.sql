--
-- Estructura de tabla para la tabla `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `endpoint` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `todos`
--

CREATE TABLE `todos` (
  `id` varchar(255) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `title` varchar(30) DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `pre_notified` tinyint(4) NOT NULL DEFAULT 0,
  `notified` tinyint(4) NOT NULL DEFAULT 0,
  `status` varchar(12) NOT NULL DEFAULT 'pending',
  `date` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indices de la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_email_endpoint` (`user_email`,`endpoint`);

--
-- Indices de la tabla `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);
COMMIT;