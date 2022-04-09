package app

type Error string

func (e Error) Error() string { return string(e) }

const Error404 = Error("404")

type Service interface {
	GetAddresses(offset int, limit int) ([]GetAddressesResponseDto, error)
	AddAddress(address PostAddressDto) (*PostAddressResponseDto, error)
	UpdateAddress(address UpdateAddressDto) (*UpdateAddressResponseDto, error)
	DeleteAddress(id int) (*DeleteAddressResponseDto, error)
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
	Id                  int
	Address             string
	Latitude, Longitude float64
	IsDisabled          bool
}

type UpdateAddressDto struct {
	Id         int     `json:"id" validate:"min=1,nonzero"`
	Address    string  `json:"address" validate:"min=3,regexp=^[a-zA-Zа-яА-Я .;]*$"`
	Latitude   float64 `json:"latitude" validate:"min=-90,max=90,nonnil"`
	Longitude  float64 `json:"longitude" validate:"min=-180,max=180,nonnil"`
	IsDisabled bool    `json:"isDisabled" validate:"nonnil"`
}

type UpdateAddressResponseDto struct {
	Id                  int
	Address             string
	Latitude, Longitude float64
	IsDisabled          bool
}

type DeleteAddressResponseDto struct {
	Id                  int
	Address             string
	Latitude, Longitude float64
	IsDisabled          bool
}
