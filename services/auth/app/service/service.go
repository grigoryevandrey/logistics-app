package service

import (
	"database/sql"

	"github.com/grigoryevandrey/logistics-app/services/auth/app"
)

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) Login(creds app.LoginCredentials) (*app.Tokens, error) {
	return nil, nil
}

func (s *service) Logout(tokens app.Tokens) error {
	return nil
}
