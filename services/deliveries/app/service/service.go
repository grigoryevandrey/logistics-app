package service

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/app"
)

const DELIVERIES_TABLE = "deliveries"
const ENTITY_FIELDS = "id, vehicle_id, address_from, address_to, driver_id, manager_id, contents, eta, updated_at, status"
const JOINED_ENTITY_FIELDS = "id, vehicle, vehicle_car_number, address_from, address_to, driver_last_name, driver_first_name, manager_first_name, manager_last_name, contents, eta, updated_at, status"

const JOIN_QUERY = "SELECT deliveries.id, vehicles.vehicle, vehicles.vehicle_car_number, from_addr.address AS address_from, to_addr.address AS address_to, drivers.driver_last_name, drivers.driver_first_name, managers.manager_first_name, managers.manager_last_name, deliveries.contents, deliveries.eta, deliveries.updated_at, deliveries.status FROM deliveries LEFT JOIN vehicles ON vehicles.id = deliveries.vehicle_id LEFT JOIN addresses from_addr ON from_addr.id = deliveries.address_from LEFT JOIN addresses to_addr ON to_addr.id = deliveries.address_to LEFT JOIN drivers ON drivers.id = deliveries.driver_id LEFT JOIN managers ON managers.id = deliveries.manager_id"

const IMMUTABLE_STATUS = "delivered"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetDelivery(id int) (*app.DeliveryEntity, error) {
	var result app.DeliveryEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s WHERE id = $1",
		ENTITY_FIELDS,
		DELIVERIES_TABLE,
	)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&result.Id,
		&result.VehicleId,
		&result.AddressFrom,
		&result.AddressTo,
		&result.DriverId,
		&result.ManagerId,
		&result.Contents,
		&result.Eta,
		&result.UpdatedAt,
		&result.Status,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &result, nil
	}
}

func (s *service) GetDeliveries(offset int, limit int) ([]app.DeliveryJoinedEntity, error) {
	var result []app.DeliveryJoinedEntity

	query := fmt.Sprintf(
		"%s OFFSET %d LIMIT %d",
		JOIN_QUERY,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var deliveryJoinedEntity app.DeliveryJoinedEntity

		if err := rows.Scan(
			&deliveryJoinedEntity.Id,
			&deliveryJoinedEntity.Vehicle,
			&deliveryJoinedEntity.VehicleCarNumber,
			&deliveryJoinedEntity.AddressFrom,
			&deliveryJoinedEntity.AddressTo,
			&deliveryJoinedEntity.DriverLastName,
			&deliveryJoinedEntity.DriverFirstName,
			&deliveryJoinedEntity.ManagerFirstName,
			&deliveryJoinedEntity.ManagerLastName,
			&deliveryJoinedEntity.Contents,
			&deliveryJoinedEntity.Eta,
			&deliveryJoinedEntity.UpdatedAt,
			&deliveryJoinedEntity.Status,
		); err != nil {
			return nil, err
		}

		result = append(result, deliveryJoinedEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddDelivery(delivery app.PostDeliveryDto) (*app.DeliveryEntity, error) {
	updatedAt := time.Now()
	var deliveryEntity app.DeliveryEntity

	query := fmt.Sprintf("INSERT INTO %s (vehicle_id, address_from, address_to, driver_id, manager_id, contents, eta, updated_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING %s", DELIVERIES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		delivery.VehicleId,
		delivery.AddressFrom,
		delivery.AddressTo,
		delivery.DriverId,
		delivery.ManagerId,
		delivery.Contents,
		delivery.Eta,
		updatedAt,
		delivery.Status,
	).Scan(
		&deliveryEntity.Id,
		&deliveryEntity.VehicleId,
		&deliveryEntity.AddressFrom,
		&deliveryEntity.AddressTo,
		&deliveryEntity.DriverId,
		&deliveryEntity.ManagerId,
		&deliveryEntity.Contents,
		&deliveryEntity.Eta,
		&deliveryEntity.UpdatedAt,
		&deliveryEntity.Status,
	)

	if err != nil {
		return nil, err
	}

	return &deliveryEntity, nil
}

func (s *service) UpdateDelivery(delivery app.UpdateDeliveryDto) (*app.DeliveryEntity, error) {
	updatedAt := time.Now()
	var deliveryEntity app.DeliveryEntity

	query := fmt.Sprintf("UPDATE %s SET vehicle_id = $1, address_from = $2, address_to = $3, driver_id = $4, manager_id = $5, contents = $6, eta = $7, updated_at = $8, status = $9 WHERE id = $10 RETURNING %s", DELIVERIES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		delivery.VehicleId,
		delivery.AddressFrom,
		delivery.AddressTo,
		delivery.DriverId,
		delivery.ManagerId,
		delivery.Contents,
		delivery.Eta,
		updatedAt,
		delivery.Status,
		delivery.Id,
	).Scan(
		&deliveryEntity.Id,
		&deliveryEntity.VehicleId,
		&deliveryEntity.AddressFrom,
		&deliveryEntity.AddressTo,
		&deliveryEntity.DriverId,
		&deliveryEntity.ManagerId,
		&deliveryEntity.Contents,
		&deliveryEntity.Eta,
		&deliveryEntity.UpdatedAt,
		&deliveryEntity.Status,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &deliveryEntity, nil
	}
}

func (s *service) DeleteDelivery(id int) (*app.DeliveryEntity, error) {
	var deliveryEntity app.DeliveryEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", DELIVERIES_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&deliveryEntity.Id,
		&deliveryEntity.VehicleId,
		&deliveryEntity.AddressFrom,
		&deliveryEntity.AddressTo,
		&deliveryEntity.DriverId,
		&deliveryEntity.ManagerId,
		&deliveryEntity.Contents,
		&deliveryEntity.Eta,
		&deliveryEntity.UpdatedAt,
		&deliveryEntity.Status,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &deliveryEntity, nil
	}
}

// SELECT unnest(enum_range(NULL::myenum))
func (s *service) GetDeliveryStatuses() ([]string, error) {
	var result []string

	query := "SELECT unnest(enum_range(NULL::delivery_status))"

	rows, err := s.db.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var enumElement string

		if err := rows.Scan(&enumElement); err != nil {
			return nil, err
		}

		result = append(result, enumElement)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) UpdateDeliveryStatus(delivery app.UpdateDeliveryStatusDto) (*app.DeliveryEntity, error) {
	var currentStatus string

	checkerQuery := fmt.Sprintf("SELECT status FROM %s WHERE id = $1", DELIVERIES_TABLE)

	err := s.db.QueryRow(checkerQuery, delivery.Id).Scan(&currentStatus)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.Error404
		}

		return nil, err
	}

	if IMMUTABLE_STATUS == currentStatus {
		return nil, errors.Error409
	}

	updatedAt := time.Now()
	var deliveryEntity app.DeliveryEntity

	query := fmt.Sprintf("UPDATE %s SET updated_at = $1, status = $2 WHERE id = $3 RETURNING %s", DELIVERIES_TABLE, ENTITY_FIELDS)

	err = s.db.QueryRow(
		query,
		updatedAt,
		delivery.Status,
		delivery.Id,
	).Scan(
		&deliveryEntity.Id,
		&deliveryEntity.VehicleId,
		&deliveryEntity.AddressFrom,
		&deliveryEntity.AddressTo,
		&deliveryEntity.DriverId,
		&deliveryEntity.ManagerId,
		&deliveryEntity.Contents,
		&deliveryEntity.Eta,
		&deliveryEntity.UpdatedAt,
		&deliveryEntity.Status,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &deliveryEntity, nil
	}
}