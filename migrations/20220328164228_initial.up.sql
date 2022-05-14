CREATE TYPE delivery_status AS ENUM ('not started', 'on the way', 'delivered', 'cancelled');
CREATE TYPE admin_role AS ENUM ('regular', 'super');

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
    vehicle             VARCHAR(255) NOT NULL,
    vehicle_car_number  VARCHAR(31) NOT NULL,
    vehicle_tonnage     REAL NOT NULL,
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE drivers
(
    id                  BIGSERIAL,
    driver_last_name    VARCHAR(255) NOT NULL,
    driver_first_name   VARCHAR(255) NOT NULL,
    driver_patronymic   VARCHAR(255),
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE admins
(
    id                  BIGSERIAL,
    admin_login         VARCHAR(255) UNIQUE NOT NULL,
    admin_password      VARCHAR(1023) NOT NULL,
    admin_last_name     VARCHAR(255) NOT NULL,
    admin_first_name    VARCHAR(255) NOT NULL,
    admin_patronymic    VARCHAR(255),
    admin_role          admin_role NOT NULL,
    refresh_token       VARCHAR(1023),
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
    
CREATE TABLE managers
(
    id                  BIGSERIAL,
    manager_login       VARCHAR(255) UNIQUE NOT NULL,
    manager_password    VARCHAR(1023) NOT NULL,
    manager_last_name   VARCHAR(255) NOT NULL,
    manager_first_name  VARCHAR(255) NOT NULL,
    manager_patronymic  VARCHAR(255),
    refresh_token       VARCHAR(1023),
    is_disabled         BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE deliveries
(
    id                  BIGSERIAL,
    vehicle_id          BIGINT NOT NULL,
    address_from        BIGINT NOT NULL,
    address_to          BIGINT NOT NULL,
    driver_id           BIGINT NOT NULL,
    manager_id          BIGINT NOT NULL,
    contents            TEXT NOT NULL,
    eta                 TIMESTAMP NOT NULL,
    updated_at          TIMESTAMP NOT NULL,
    status              delivery_status NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (address_from) REFERENCES addresses (id),
    FOREIGN KEY (address_to) REFERENCES addresses (id),
    FOREIGN KEY (driver_id) REFERENCES drivers (id),
    FOREIGN KEY (manager_id) REFERENCES managers (id)
);
