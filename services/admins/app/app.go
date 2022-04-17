package app

type Service interface {
	GetAdmins(offset int, limit int) ([]AdminEntity, error)
	AddAdmin(admin PostAdminDto) (*AdminEntity, error)
	UpdateAdmin(admin UpdateAdminDto) (*AdminEntity, error)
	DeleteAdmin(id int) (*AdminEntity, error)
}

type AdminEntity struct {
	Id         int    `json:"id"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Role       string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
	IsDisabled bool   `json:"isDisabled"`
}

type PostAdminDto struct {
	Login      string `json:"login" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Role       string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}

type UpdateAdminDto struct {
	Id         int    `json:"id" validate:"min=1,nonzero"`
	Login      string `json:"login" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Role       string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
	IsDisabled bool   `json:"isDisabled"`
}
