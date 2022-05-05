package service

import (
	"database/sql"
	"errors"

	"github.com/grigoryevandrey/logistics-app/services/deliveries/app"
)

const DELIVERIES_TABLE = "deliveries"
const ENTITY_FIELDS = "id, vehicle_id, address_from, address_to, driver_id, manager_id, contents, eta, updated_at, status"
const JOINED_ENTITY_FIELDS = "id, vehicle, vehicle_car_number, address_from, driver_last_name, driver_first_name, manager_first_name, manager_last_name, contents, eta, updated_at, status"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetDelivery(id int) (*app.DeliveryEntity, error) {
	return nil, errors.New("not implemented")
}

func (s *service) GetDeliveries(offset int, limit int) ([]app.DeliveryJoinedEntity, error) {
	return nil, errors.New("not implemented")
}

func (s *service) AddDelivery(delivery app.PostDeliveryDto) (*app.DeliveryJoinedEntity, error) {
	return nil, errors.New("not implemented")
}

func (s *service) UpdateDelivery(delivery app.UpdateDeliveryDto) (*app.DeliveryJoinedEntity, error) {
	return nil, errors.New("not implemented")
}

func (s *service) DeleteDelivery(id int) (*app.DeliveryJoinedEntity, error) {
	return nil, errors.New("not implemented")
}

func (s *service) GetDeliveryStatuses() ([]string, error) {
	return nil, errors.New("not implemented")
}

func (s *service) UpdateDeliveryStatus(id int, status string) error {
	return errors.New("not implemented")
}
