package app

type Service interface {
	GetAddresses(offset int, limit int) ([]GetAddressesResponse, error)
	AddAddress() string
	UpdateAddress() string
	DeleteAddress() string
}

type GetAddressesResponse struct {
	Id int
}