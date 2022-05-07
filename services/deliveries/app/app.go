package app

import "time"

type Service interface {
	GetDelivery(id int) (*DeliveryEntity, error)
	GetDeliveries(offset int, limit int) ([]DeliveryJoinedEntity, error)
	AddDelivery(delivery PostDeliveryDto) (*DeliveryEntity, error)
	UpdateDelivery(delivery UpdateDeliveryDto) (*DeliveryEntity, error)
	DeleteDelivery(id int) (*DeliveryEntity, error)

	GetDeliveryStatuses() ([]string, error)
	UpdateDeliveryStatus(delivery UpdateDeliveryStatusDto) (*DeliveryEntity, error)
}

// Check if from and to is not the same

// EDITING: As always, send id of each referenced entity
// EDITING/DELETING RETURN: Joined entity

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
