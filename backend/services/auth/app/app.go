package app

type Service interface {
	Login(creds LoginCredentials, strategy string) (*Tokens, error)
	Refresh(token string, strategy string) (*Tokens, error)
	Logout(token string, strategy string) error
}

type LoginCredentials struct {
	Login    string `json:"login" validate:"min=3,max=255,regexp=^[a-zA-Z0-9]*$"`
	Password string `json:"password" validate:"min=6,max=255,regexp=^[a-zA-Z0-9]*$"`
}

type Tokens struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}
