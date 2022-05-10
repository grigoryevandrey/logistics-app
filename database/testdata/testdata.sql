INSERT INTO addresses (address, latitude, longitude, is_disabled) 
VALUES 
('Склад в СПБ на Парнасе', 60.065809, 30.349630, false), 
('Склад в СПБ на Маяковской', 59.934009, 30.352789, false),
('Склад в Великом Новгороде', 58.528337, 31.261812, false),
('Склад в Москве', 55.772654, 37.510478, false),
('Склад в Пскове', 57.796270, 28.311708, false),
('Склад в Ярославле', 57.589494, 39.909409, false),
('Склад в Вологде', 59.199059, 39.927810, false),
('Склад в Нижнем Новгороде', 56.304288, 44.039571, false),
('Склад в Казани', 55.865677, 49.096896, false),
('Склад в Саратове', 51.570165, 45.969615, false);

INSERT INTO vehicles (vehicle, vehicle_car_number, vehicle_tonnage, vehicle_address_id, is_disabled)
VALUES 
('Volvo', 'Н015ОТ', 10, 1, false),
('Volvo FL', 'О521ТТ', 7, 3, false),
('Mercedes Atego', 'О707ОХ', 7, 2, false),
('MAN TGL', 'К678ОН', 10, 5, false),
('Mercedes Atego', 'У087МТ', 7, 7, false),
('Mercedes Actros', 'А514МХ', 10, 6, false),
('Hyundai Porter', 'Н741ХА', 1, 9, false),
('Volvo FL', 'Е386РУ', 7, 8, false),
('MAN TGL', 'Р194ХР', 10, 4, false),
('Volvo', 'Х699ТВ', 10, 5, false);

INSERT INTO drivers (driver_last_name, driver_first_name, driver_patronymic, driver_address_id, is_disabled)
VALUES 
('Свешников', 'Юрий', 'Максимович', 5, false),
('Филиппова', 'София', 'Ивановна', 2, false),
('Киселева', 'Алёна', 'Константиновна', 3, false),
('Киселева', 'Мария', 'Артёмовна', 4, false),
('Костин', 'Кирилл', 'Егорович', 5, false),
('Ефимова', 'Арина', 'Александровна', 6, false),
('Березин', 'Клим', 'Эмирович', 8, false),
('Яковлев', 'Давид', 'Львович', 2, false),
('Киселева', 'Мария', 'Викторовна', 3, false),
('Борисова', 'Сафия', 'Глебовна', 4, false);

INSERT INTO admins (admin_login, admin_password, admin_last_name, admin_first_name, admin_patronymic, admin_role, is_disabled)
VALUES 
('test', '$2a$10$Qe1ckoaU5jwPQaa7f1g3A.klitPB9mJKI12VUbrGm51qya3wYCbQC', 'Лебедев','Иван','Билалович', 'super', false),
('test1', '$2a$10$bkXgxI39etxlkOvnkFa9l.gy/sCOFTO2cEbUCXImsO73boYWy4ESW', 'Калмыкова','Арина','Егоровна', 'regular', false);

INSERT INTO managers (manager_login, manager_password, manager_last_name, manager_first_name, manager_patronymic, is_disabled)
VALUES 
('test', '$2a$10$KnfGgYAc8UPbghmlKTjMu.jo5oGiJW1St/zIKMA6vcuMXra6mmN/u', 'Осипов','Михаил','Маркович', false),
('test1', '$2a$10$AJdRaYjSg4vEOrw83eFLo.O5sKUliH.8nFckfoIIpNvtenqXHkd/e', 'Еремина','Елизавета','Данииловна', false),
('test2', '$2a$10$5y.dxuO.PZOKler/ru1ExuGjtxc5lRxSKWF6TGc.FiZpP.8MAqTC2', 'Николаева','Вера','Марковна', false),
('test3', '$2a$10$HVTxlxBRXN/6jx5u0YUC7ewEzYye/.qraUuQlAhUG9Kf0ERYjF.Ha', 'Лебедев','Артём','Максимович', false),
('test4', '$2a$10$ZgE4n0rHq4OSV1mMDYhgneHYq12g.6sg05Srcmf3WDGCLSOpog4Gq', 'Куприянов','Максим','Фёдорович', false),
('test5', '$2a$10$5BjNAwbq1gv2BRHkZRreRefANf2gbBFwHBzVNPi.3EiUeZQIUMKj2', 'Сазонова','Василиса','Петровна', false),
('test6', '$2a$10$1RMVjj3yTf10YgRAt6fDXu3n5nXtMXtmyGzhvJj4MCnAx5AhbVbwW', 'Лосев','Тимофей','Игоревич', false),
('test7', '$2a$10$nnBK7iGwbFCJWmboeE.cEe.qdlOKSYr8Ln5r.NriVt.ZRStoo/DL6', 'Алексеев','Дмитрий','Елисеевич', false),
('test8', '$2a$10$gLbrwZdJrKfry3/vu/oDdeSREPy1gmELGvAIrRYQtv9dZNvCd.AZq', 'Малышева','Зоя','Андреевна', false),
('test9', '$2a$10$gLbrwZdJrKfry3/vu/oDdeSREPy1gmELGvAIrRYQtv9dZNvCd.AZq', 'Куликов','Макар','Иванович', false);

INSERT INTO deliveries (vehicle_id, address_from, address_to, contents, driver_id, manager_id, eta, updated_at, status)
VALUES 
(1, 6, 2, '20 кубометров зерна', 6, 3, '2022-07-10 19:10:25-07', '2022-05-22 19:10:25-07', 'cancelled'),
(3, 3, 2, '15 кубометров еды', 4, 7, '2022-07-09 19:10:25-07', '2022-05-22 19:10:25-07', 'on the way'),
(5, 5, 4, '10 кубометров химии', 2, 2, '2022-07-01 19:10:25-07', '2022-05-22 19:10:25-07', 'not started'),
(7, 8, 1, '8 кубометров бумаги', 7, 7, '2022-06-28 19:10:25-07', '2022-05-22 19:10:25-07', 'on the way'),
(2, 2, 9, '5 тонн запчастей', 5, 3, '2022-06-27 19:10:25-07', '2022-05-22 19:10:25-07', 'delivered'),
(6, 6, 7, '4 тонны техники', 2, 10, '2022-07-18 19:10:25-07', '2022-05-22 19:10:25-07', 'not started'),
(8, 4, 3, '5 кубометров зерна', 9, 9, '2022-07-21 19:10:25-07', '2022-05-22 19:10:25-07', 'on the way'),
(9, 6, 10, '6 тонн техники', 10, 8, '2022-07-22 19:10:25-07', '2022-05-22 19:10:25-07', 'on the way'),
(1, 10, 1, '15 кубометров химии', 1, 4, '2022-07-03 19:10:25-07', '2022-05-22 19:10:25-07', 'not started'),
(10, 3, 5, '12 тонн техники', 3, 5, '2022-07-02 19:10:25-07', '2022-05-22 19:10:25-07', 'on the way');
