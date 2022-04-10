INSERT INTO addresses (address, latitude, longitude, is_disabled) 
VALUES ('Склад на Парнасе', 60.065809, 30.349630, false), ('Склад на Маяковской', 59.934009, 30.352789, false);

INSERT INTO vehicles (vehicle, vehicle_car_number, vehicle_tonnage, vehicle_address_id, is_disabled)
VALUES ('Камаз', 'с065ме78', 5, 1, false);

INSERT INTO drivers (driver_last_name, driver_first_name, driver_patronymic, driver_address_id, is_disabled)
VALUES ('Рябов', 'Роман', 'Станиславович', 1, false);

INSERT INTO admins (admin_login, admin_password)
VALUES ('test', '$2a$10$JWLAPYmMgRY7CtkNlmjb1eewe8fYJhUfxN/bwpdEXdEybSYGeMVcO');

INSERT INTO managers (manager_login, manager_password, manager_last_name, manager_first_name, manager_patronymic, is_disabled)
VALUES ('test', '$2a$10$JWLAPYmMgRY7CtkNlmjb1eewe8fYJhUfxN/bwpdEXdEybSYGeMVcO', 'Кудрявцев', 'Карим', 'Сергеевич', false);

INSERT INTO deliveries (vehicle_id, address_from, address_to, contents, driver_id, manager_id, eta, status)
VALUES (1, 1, 2, '20 кубометров зерна', 1, 1, '2022-05-22 19:10:25-07', 'not started');