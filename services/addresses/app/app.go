package app

type Service interface {
	GetAddresses() ([]GetAddressesResponse, error)
	AddAddress() string
	UpdateAddress() string
	DeleteAddress() string
}

type GetAddressesResponse struct {
	Id int
}