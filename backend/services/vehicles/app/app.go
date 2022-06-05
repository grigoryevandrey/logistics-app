package app

const DEFAULT_SORTING_STRATEGY = "vehicle_asc"

var SortingStrategies = map[string]string{
	"vehicle_desc": "ORDER BY vehicle DESC",
	"vehicle_asc":  "ORDER BY vehicle ASC",
	"tonnage_desc": "ORDER BY vehicle_tonnage DESC",
	"tonnage_asc":  "ORDER BY vehicle_tonnage ASC",
}

type Service interface {
	GetVehicle(id string) (*VehicleEntity, error)
	GetVehicles(offset int, limit int, sort string) ([]VehicleEntity, *int, error)
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
