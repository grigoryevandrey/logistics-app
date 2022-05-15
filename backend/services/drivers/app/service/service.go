package service

import (
	"database/sql"
	"fmt"

	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"

	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/services/drivers/app"
)

const ENTITY_FIELDS = "id, driver_last_name, driver_first_name, driver_patronymic, is_disabled"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetDrivers(offset int, limit int, sort string) ([]app.DriverEntity, *int, error) {
	var result []app.DriverEntity
	var totalRows int

	query := fmt.Sprintf(
		"SELECT %s, count(*) OVER() AS total_rows FROM %s %s OFFSET %d LIMIT %d",
		ENTITY_FIELDS,
		globalConstants.DRIVERS_TABLE,
		sort,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var driverEntity app.DriverEntity

		if err := rows.Scan(
			&driverEntity.Id,
			&driverEntity.LastName,
			&driverEntity.FirstName,
			&driverEntity.Patronymic,
			&driverEntity.IsDisabled,
			&totalRows,
		); err != nil {
			return nil, nil, err
		}

		result = append(result, driverEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, nil, err
	}

	return result, &totalRows, nil
}

func (s *service) AddDriver(driver app.PostDriverDto) (*app.DriverEntity, error) {
	var driverEntity app.DriverEntity

	query := fmt.Sprintf("INSERT INTO %s (driver_last_name, driver_first_name, driver_patronymic, is_disabled) VALUES ($1, $2, $3, $4) RETURNING %s", globalConstants.DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		driver.LastName,
		driver.FirstName,
		driver.Patronymic,
		false,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
		&driverEntity.IsDisabled,
	)

	if err != nil {
		return nil, err
	}

	return &driverEntity, nil
}

func (s *service) UpdateDriver(driver app.UpdateDriverDto) (*app.DriverEntity, error) {
	var driverEntity app.DriverEntity

	query := fmt.Sprintf("UPDATE %s SET driver_last_name = $1, driver_first_name = $2, driver_patronymic = $3, is_disabled = $4 WHERE id = $5 RETURNING %s", globalConstants.DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		driver.LastName,
		driver.FirstName,
		driver.Patronymic,
		driver.IsDisabled,
		driver.Id,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
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

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", globalConstants.DRIVERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&driverEntity.Id,
		&driverEntity.LastName,
		&driverEntity.FirstName,
		&driverEntity.Patronymic,
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
