package service

import (
	"database/sql"
	"fmt"

	globalConstants "github.com/grigoryevandrey/logistics-app/lib/constants"

	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/vehicles/app"
)

const ENTITY_FIELDS = "id, vehicle, vehicle_car_number, vehicle_tonnage, vehicle_address_id, is_disabled"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetVehicles(offset int, limit int) ([]app.VehicleEntity, error) {
	var result []app.VehicleEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s OFFSET %d LIMIT %d", ENTITY_FIELDS,
		globalConstants.VEHICLES_TABLE,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var vehicleEntity app.VehicleEntity

		if err := rows.Scan(
			&vehicleEntity.Id,
			&vehicleEntity.Vehicle,
			&vehicleEntity.CarNumber,
			&vehicleEntity.Tonnage,
			&vehicleEntity.AddressId,
			&vehicleEntity.IsDisabled,
		); err != nil {
			return nil, err
		}

		result = append(result, vehicleEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddVehicle(vehicle app.PostVehicleDto) (*app.VehicleEntity, error) {
	var vehicleEntity app.VehicleEntity

	query := fmt.Sprintf("INSERT INTO %s (vehicle, vehicle_car_number, vehicle_tonnage, vehicle_address_id, is_disabled) VALUES ($1, $2, $3, $4, $5) RETURNING %s", globalConstants.VEHICLES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		vehicle.Vehicle,
		vehicle.CarNumber,
		vehicle.Tonnage,
		vehicle.AddressId,
		false,
	).Scan(
		&vehicleEntity.Id,
		&vehicleEntity.Vehicle,
		&vehicleEntity.CarNumber,
		&vehicleEntity.Tonnage,
		&vehicleEntity.AddressId,
		&vehicleEntity.IsDisabled,
	)

	if err != nil {
		return nil, err
	}

	return &vehicleEntity, nil
}

func (s *service) UpdateVehicle(vehicle app.UpdateVehicleDto) (*app.VehicleEntity, error) {
	var vehicleEntity app.VehicleEntity

	query := fmt.Sprintf("UPDATE %s SET vehicle = $1, vehicle_car_number = $2, vehicle_tonnage = $3, vehicle_address_id = $4, is_disabled = $5 WHERE id = $6 RETURNING %s", globalConstants.VEHICLES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		vehicle.Vehicle,
		vehicle.CarNumber,
		vehicle.Tonnage,
		vehicle.AddressId,
		vehicle.IsDisabled,
		vehicle.Id,
	).Scan(
		&vehicleEntity.Id,
		&vehicleEntity.Vehicle,
		&vehicleEntity.CarNumber,
		&vehicleEntity.Tonnage,
		&vehicleEntity.AddressId,
		&vehicleEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &vehicleEntity, nil
	}
}

func (s *service) DeleteVehicle(id int) (*app.VehicleEntity, error) {
	var vehicleEntity app.VehicleEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", globalConstants.VEHICLES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&vehicleEntity.Id,
		&vehicleEntity.Vehicle,
		&vehicleEntity.CarNumber,
		&vehicleEntity.Tonnage,
		&vehicleEntity.AddressId,
		&vehicleEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &vehicleEntity, nil
	}
}
