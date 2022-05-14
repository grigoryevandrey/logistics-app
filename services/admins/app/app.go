package app

const DEFAULT_SORTING_STRATEGY = "name_asc"

var SortingStrategies = map[string]string{
	"name_desc":  "ORDER BY admin_last_name DESC, admin_first_name DESC, admin_patronymic DESC",
	"name_asc":   "ORDER BY admin_last_name ASC, admin_first_name ASC, admin_patronymic ASC",
	"login_desc": "ORDER BY admin_login DESC",
	"login_asc":  "ORDER BY admin_login ASC",
}

const DEFAULT_FILTERING_STRATEGY = "default"

var FilteringStrategies = map[string]string{
	"default": "",
	"regular": "WHERE admin_role = 'regular'",
	"super":   "WHERE admin_role = 'super'",
}

type Service interface {
	GetAdmins(offset int, limit int, sort string, filter string) ([]AdminEntity, *int, error)
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
	Login      string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Role       string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
}

type UpdateAdminDto struct {
	Id         int    `json:"id" validate:"min=1,nonzero"`
	Login      string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
	LastName   string `json:"lastName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	FirstName  string `json:"firstName" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Patronymic string `json:"patronymic" validate:"min=1,max=255,regexp=^[a-zA-Zа-яА-Я]*$"`
	Role       string `json:"role" validate:"min=1,max=255,regexp=^[a-z]*$"`
	IsDisabled bool   `json:"isDisabled"`
}
