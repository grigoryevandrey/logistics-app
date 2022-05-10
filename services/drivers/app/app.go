package app

type Service interface {
	GetDrivers(offset int, limit int) ([]DriverEntity, error)
	AddDriver(driver PostDriverDto) (*DriverEntity, error)
	UpdateDriver(driver UpdateDriverDto) (*DriverEntity, error)
	DeleteDriver(id int) (*DriverEntity, error)
}

type DriverEntity struct {
	Id         int    `json:"id"`
	LastName   string `json:"lastName"`
	FirstName  string `json:"firstName"`
	Patronymic string `json:"patronymic"`
	IsDisabled bool   `json:"isDisabled"`
}

type PostDriverDto struct {
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
}

type UpdateDriverDto struct {
	Id         int    `json:"id" validate:"min=1,nonzero"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	IsDisabled bool   `json:"isDisabled" validate:"nonnil"`
}
