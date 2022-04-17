package app

type Service interface {
	GetManager(id string) (*ManagerEntity, error)
	GetManagers(offset int, limit int) ([]ManagerEntity, error)
	AddManager(manager PostManagerDto) (*ManagerEntity, error)
	UpdateManager(manager UpdateManagerDto) (*ManagerEntity, error)
	DeleteManager(id int) (*ManagerEntity, error)
}

type ManagerEntity struct {
	Id         int    `json:"id"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	IsDisabled bool   `json:"isDisabled"`
}

type PostManagerDto struct {
	Login      string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
}

type UpdateManagerDto struct {
	Id         int    `json:"id" validate:"min=1,nonzero"`
	Login      string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	IsDisabled bool   `json:"isDisabled"`
}
