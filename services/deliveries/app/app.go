package app

type Service interface {
	GetDeliveries(offset int, limit int) ([]DeliveryJoinEntity, error)
	AddDelivery(delivery PostDeliveryDto) (*DeliveryEntity, error)
	UpdateDelivery(delivery UpdateDeliveryDto) (*DeliveryEntity, error)
	DeleteDelivery(id int) (*DeliveryEntity, error)
}

// Check if from and to is not the same

/*
 * REPRESENTATION
 * Fields i want with join:
 * Id
 * Vehicle
 * VehicleCarNumber
 * AddressFrom (txt)
 * AddressTo (txt)
 * DriverLastName
 * DriverFirstName
 * ManagerLastName
 * ManagerFirstName
 * Contents
 * Eta
 * Status
 */

// EDITING: As always, send id of each referenced entity
// EDITING/DELETING RETURN: Joined entity

type DeliveryJoinEntity struct {
	Id          int    `json:"id"`
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Eta         int64  `json:"eta" validate:"min=1"`
	Status      string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}

type DeliveryEntity struct {
	Id          int    `json:"id"`
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Eta         int64  `json:"eta" validate:"min=1"`
	Status      string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}

type PostDeliveryDto struct {
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Eta         int64  `json:"eta" validate:"min=1"`
	Status      string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}

type UpdateDeliveryDto struct {
	Id          int    `json:"id"`
	VehicleId   int    `json:"vehicleId" validate:"min=1"`
	AddressFrom int    `json:"addressFrom" validate:"min=1"`
	AddressTo   int    `json:"addressTo" validate:"min=1"`
	DriverId    int    `json:"driverId" validate:"min=1"`
	ManagerId   int    `json:"managerId" validate:"min=1"`
	Contents    string `json:"contents" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Eta         int64  `json:"eta" validate:"min=1"`
	Status      string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}
