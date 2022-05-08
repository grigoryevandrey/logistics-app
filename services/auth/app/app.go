package app

type Service interface {
	Login(creds LoginCredentials) (*Tokens, error)
	Logout(tokens Tokens) error
}

type LoginCredentials struct {
	Login    string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password string `json:"password" validate:"min=1,nonnil"`
}

type Tokens struct {
	AccessToken  string
	RefreshToken string
}
