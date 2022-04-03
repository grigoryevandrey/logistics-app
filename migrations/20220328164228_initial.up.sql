CREATE TYPE delivery_status AS ENUM ('not started', 'on the way', 'delivered', 'cancelled');

CREATE TABLE addresses
(
    id                  BIGSERIAL,
    address             TEXT NOT NULL,
    latitude            REAL NOT NULL,
    longitude           REAL NOT NULL,
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE vehicles
(
    id                  BIGSERIAL,
    vehicle_car_number  VARCHAR(31) NOT NULL,
    vehicle_tonnage     REAL NOT NULL,
    vehicle_address_id  BIGINT,
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (vehicle_address_id) REFERENCES addresses (id)
);

CREATE TABLE drivers
(
    id                  BIGSERIAL,
    driver_last_name    VARCHAR(255) NOT NULL,
    driver_first_name   VARCHAR(255) NOT NULL,
    driver_patronymic   VARCHAR(255),
    driver_address_id   BIGINT NOT NULL,
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (driver_address_id) REFERENCES addresses (id)
);

CREATE TABLE admins
(
    id                  BIGSERIAL,
    admin_login         VARCHAR(255) NOT NULL,
    admin_password      VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
    
CREATE TABLE managers
(
    id                  BIGSERIAL,
    manager_login       VARCHAR(255) NOT NULL,
    manager_password    VARCHAR(255) NOT NULL,
    manager_last_name   VARCHAR(255) NOT NULL,
    manager_first_name  VARCHAR(255) NOT NULL,
    manager_patronymic  VARCHAR(255),
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE deliveries
(
    id                  BIGSERIAL,
    vehicle_id          BIGINT NOT NULL,
    address_from        BIGINT NOT NULL,
    address_to          BIGINT NOT NULL,
    contents            TEXT NOT NULL,
    driver_id           BIGINT NOT NULL,
    manager_id          BIGINT NOT NULL,
    eta                 TIMESTAMP NOT NULL,
    status              delivery_status NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (address_from) REFERENCES addresses (id),
    FOREIGN KEY (address_to) REFERENCES addresses (id),
    FOREIGN KEY (driver_id) REFERENCES drivers (id),
    FOREIGN KEY (manager_id) REFERENCES managers (id)
);