package app

type Service interface {
	GetAddresses(offset int, limit int) ([]GetAddressesResponseDto, error)
	AddAddress(address PostAddressDto) (*PostAddressResponseDto, error)
	UpdateAddress() string
	DeleteAddress() string
}

type GetAddressesResponseDto struct {
	Id                  int
	Address             string
	Latitude, Longitude float64
	IsDisabled          bool
}

type PostAddressDto struct {
	Address   string  `json:"address" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Latitude  float64 `json:"latitude" validate:"min=-90,max=90,nonnil"`
	Longitude float64 `json:"longitude" validate:"min=-180,max=180,nonnil"`
}

type PostAddressResponseDto struct {
	Id int
}
