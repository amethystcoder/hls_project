INSERT INTO `ads` (`id`, `title`, `type`, `code`) VALUES
(20, 'popad', 'popad', '');

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`config`, `var`) VALUES
('version', '2.2'),
('proxyUser', ''),
('proxyPass', ''),
('timezone', 'Asia/Colombo'),
('dark_theme', '0'),
('adminId', '1'),
('sublist', '[\"sinhala\",\"english\",\"hindi\",\"french\",\"korean\"]'),
('logo', 'gdplyr-logo.png'),
('favicon', 'favicon.ico'),
('player', 'jw'),
('playerSlug', 'v'),
('showServers', '1'),
('adminId', '29'),
('default_video', 'http://localhost/gdplyr/uploads/no-video.mp4'),
('default_banner', 'http://localhost/gdplyr/uploads/default-banner.jpg'),
('last_backup', '2021-01-17 18:53:08'),
('jw_license', 'https://content.jwplatform.com/libraries/Jq6HIbgz.js'),
('isAdblocker', '1'),
('v_preloader', '1'),
('driveAccounts', '[]'),
('driveUploadChunk', '1'),
('isAutoBackup', '0'),
('disabledQualities', '[\"1080\"]'),
('isAutoEnableSub', '1'),
('autoPlay', '0'),
('streamRand', '1'),
('altR', '{\"onedrive\":{\"n\":\"\"},\"okru\":{\"n\":\"\"},\"gphoto\":{\"n\":\"\"},\"direct\":{\"n\":\"\"}}'),
('isActivated', '1');


INSERT INTO `users` (`id`, `username`, `password`, `img`, `role`, `status`) VALUES
(29, 'admin', '$2y$10$zh4Jfuol7MOelfOWwoOUtu.3D/vfr1ROZdonfcblW2Sl7pC3.Gd0m', 'profile-img-codyseller.jpg', 'admin', 0);