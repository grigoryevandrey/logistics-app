package service

import (
	"database/sql"
	"fmt"

	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/drivers/app"
)

const DRIVERS_TABLE = "drivers"
const ENTITY_FIELDS = "id, driver_last_name, driver_first_name, driver_patronymic, driver_address_id, is_disabled"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetDrivers(offset int, limit int) ([]app.DriverEntity, error) {
	var result []app.DriverEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s OFFSET %d LIMIT %d", ENTITY_FIELDS,
		DRIVERS_TABLE,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var driverEntity app.DriverEntity

		if err := rows.Scan(
			&driverEntity.Id,
			&driverEntity.LastName,
			&driverEntity.FirstName,
			&driverEntity.Patronymic,
			&driverEntity.AddressId,
			&driverEntity.IsDisabled,
		); err != nil {
			return nil, err
		}

		result = append(result, driverEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddDriver(driver app.PostDriverDto) (*app.DriverEntity, error) {
	var driverEntity app.DriverEntity

	query := fmt.Sprintf("INSERT INTO %s (driver_last_name, driver_first_name, driver_patronymic, driver_address_id, is_disabled) VALUES ($1, $2, $3, $4, $5) RETURNING %s", DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		driver.LastName,
		driver.FirstName,
		driver.Patronymic,
		driver.AddressId,
		false,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
		&driverEntity.AddressId,
		&driverEntity.IsDisabled,
	)

	if err != nil {
		return nil, err
	}

	return &driverEntity, nil
}

func (s *service) UpdateDriver(driver app.UpdateDriverDto) (*app.DriverEntity, error) {
	var driverEntity app.DriverEntity

	query := fmt.Sprintf("UPDATE %s SET driver_last_name = $1, driver_first_name = $2, driver_patronymic = $3, driver_address_id = $4, is_disabled = $5 WHERE id = $6 RETURNING %s", DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		driver.LastName,
		driver.FirstName,
		driver.Patronymic,
		driver.AddressId,
		driver.IsDisabled,
		driver.Id,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
		&driverEntity.AddressId,
		&driverEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &driverEntity, nil
	}
}

func (s *service) DeleteDriver(id int) (*app.DriverEntity, error) {
	var driverEntity app.DriverEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
		&driverEntity.AddressId,
		&driverEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &driverEntity, nil
	}
}
