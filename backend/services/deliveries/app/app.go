package app

import "time"

const DEFAULT_SORTING_STRATEGY = "updated_asc"

var SortingStrategies = map[string]string{
	"updated_desc": "ORDER BY updated_at DESC",
	"updated_asc":  "ORDER BY updated_at ASC",
	"eta_desc":     "ORDER BY eta DESC",
	"eta_asc":      "ORDER BY eta ASC",
	"manager_desc": "ORDER BY manager_last_name DESC, manager_first_name DESC",
	"manager_asc":  "ORDER BY manager_last_name ASC, manager_first_name ASC",
	"driver_desc":  "ORDER BY driver_last_name DESC, driver_first_name DESC",
	"driver_asc":   "ORDER BY driver_last_name ASC, driver_first_name ASC",
	"addr_desc":    "ORDER BY address_from DESC, address_to DESC",
	"addr_asc":     "ORDER BY address_from ASC, address_to ASC",
}

const DEFAULT_FILTERING_STRATEGY = "default"

var FilteringStrategies = map[string]string{
	"default":     "",
	"not_started": "WHERE status = 'not started'",
	"on_the_way":  "WHERE status = 'on the way'",
	"delivered":   "WHERE status = 'delivered'",
	"cancelled":   "WHERE status = 'cancelled'",
}

type Service interface {
	GetDelivery(id int) (*DeliveryEntity, error)
	GetDeliveries(offset int, limit int, sort string, filter string) ([]DeliveryJoinedEntity, *int, error)
	AddDelivery(delivery PostDeliveryDto) (*DeliveryEntity, error)
	UpdateDelivery(delivery UpdateDeliveryDto) (*DeliveryEntity, error)
	DeleteDelivery(id int) (*DeliveryEntity, error)

	GetDeliveryStatuses() ([]string, error)
	UpdateDeliveryStatus(delivery UpdateDeliveryStatusDto) (*DeliveryEntity, error)
}
type DeliveryJoinedEntity struct {
	Id               int       `json:"id"`
	Vehicle          string    `json:"vehicle"`
	VehicleCarNumber string    `json:"vehicleCarNumber"`
	AddressFrom      string    `json:"addressFrom"`
	AddressTo        string    `json:"addressTo"`
	DriverLastName   string    `json:"driverLastName"`
	DriverFirstName  string    `json:"driverFirstName"`
	ManagerFirstName string    `json:"managerFirstName"`
	ManagerLastName  string    `json:"managerLastName"`
	Contents         string    `json:"contents"`
	Eta              time.Time `json:"eta"`
	UpdatedAt        time.Time `json:"updatedAt"`
	Status           string    `json:"status"`
}

type DeliveryEntity struct {
	Id          int       `json:"id"`
	VehicleId   int       `json:"vehicleId"`
	AddressFrom int       `json:"addressFrom"`
	AddressTo   int       `json:"addressTo"`
	DriverId    int       `json:"driverId"`
	ManagerId   int       `json:"managerId"`
	Contents    string    `json:"contents"`
	Eta         time.Time `json:"eta"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Status      string    `json:"role"`
}

type PostDeliveryDto struct {
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я0-9 .;]*$"`
	Eta         string `json:"eta" validate:"min=1"`
	Status      string `json:"status" validate:"min=1,max=255,regexp=^[a-z ]*$"`
}

type UpdateDeliveryDto struct {
	Id          int    `json:"id"`
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я0-9 .;]*$"`
	Eta         string `json:"eta" validate:"min=1"`
	Status      string `json:"status" validate:"min=1,max=255,regexp=^[a-z ]*$"`
}

type UpdateDeliveryStatusDto struct {
	Id     int    `json:"id"`
	Status string `json:"status" validate:"min=1,max=255,regexp=^[a-z ]*$"`
}
