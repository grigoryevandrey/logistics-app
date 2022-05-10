package app

type Service interface {
	GetVehicles(offset int, limit int) ([]VehicleEntity, error)
	AddVehicle(vehicle PostVehicleDto) (*VehicleEntity, error)
	UpdateVehicle(vehicle UpdateVehicleDto) (*VehicleEntity, error)
	DeleteVehicle(id int) (*VehicleEntity, error)
}

type VehicleEntity struct {
	Id         int     `json:"id"`
	Vehicle    string  `json:"vehicle"`
	CarNumber  string  `json:"carNumber"`
	Tonnage    float64 `json:"tonnage"`
	IsDisabled bool    `json:"isDisabled"`
}

type PostVehicleDto struct {
	Vehicle   string  `json:"vehicle" validate:"min=3,max=255,regexp=^[a-zA-Zа-яА-Я0-9 .:;]*$"`
	CarNumber string  `json:"carNumber" validate:"min=3,max=31,regexp=^[a-zA-Zа-яА-Я0-9]*$"`
	Tonnage   float64 `json:"tonnage" validate:"min=0,max=100,nonnil"`
}

type UpdateVehicleDto struct {
	Id         int     `json:"id" validate:"min=1,nonzero"`
	Vehicle    string  `json:"vehicle" validate:"min=3,max=255,regexp=^[a-zA-Zа-яА-Я0-9 .:;]*$"`
	CarNumber  string  `json:"carNumber" validate:"min=3,max=31,regexp=^[a-zA-Zа-яА-Я0-9]*$"`
	Tonnage    float64 `json:"tonnage" validate:"min=0,max=100,nonnil"`
	IsDisabled bool    `json:"isDisabled" validate:"nonnil"`
}
