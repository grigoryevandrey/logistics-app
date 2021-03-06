package app

const DEFAULT_SORTING_STRATEGY = "address_asc"

var SortingStrategies = map[string]string{
	"address_desc": "ORDER BY address DESC",
	"address_asc":  "ORDER BY address ASC",
}

type Service interface {
	GetAddress(id string) (*AddressEntity, error)
	GetAddresses(offset int, limit int, sort string) ([]AddressEntity, *int, error)
	AddAddress(address PostAddressDto) (*AddressEntity, error)
	UpdateAddress(address UpdateAddressDto) (*AddressEntity, error)
	DeleteAddress(id int) (*AddressEntity, error)
}

type AddressEntity struct {
	Id         int     `json:"id"`
	Address    string  `json:"address"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	IsDisabled bool    `json:"isDisabled"`
}

type PostAddressDto struct {
	Address   string  `json:"address" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Latitude  float64 `json:"latitude" validate:"min=-90,max=90,nonnil"`
	Longitude float64 `json:"longitude" validate:"min=-180,max=180,nonnil"`
}

type UpdateAddressDto struct {
	Id         int     `json:"id" validate:"min=1,nonzero"`
	Address    string  `json:"address" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Latitude   float64 `json:"latitude" validate:"min=-90,max=90,nonnil"`
	Longitude  float64 `json:"longitude" validate:"min=-180,max=180,nonnil"`
	IsDisabled bool    `json:"isDisabled" validate:"nonnil"`
}
