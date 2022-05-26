package service

import (
	"database/sql"
	"log"
	"time"

	"github.com/golang-jwt/jwt"
	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"
	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app/constants"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
)

const ACCESS_TOKEN_TTL = 15

type CustomerInfo struct {
	Login      string
	FirstName  string
	LastName   string
	Patronymic string
	Role       string
	TokenType  string
}

type CustomClaims struct {
	*jwt.StandardClaims
	CustomerInfo
}
type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) Login(creds app.LoginCredentials, strategy string) (*app.Tokens, error) {
	var tokens app.Tokens
	var passwordHash string
	var role string
	var firstName string
	var lastName string
	var patronymic string

	var err error

	switch strategy {
	case constants.ADMIN_STRATEGY:
		query := "SELECT admin_password, admin_role, admin_first_name, admin_last_name, admin_patronymic FROM admins WHERE admin_login = $1"
		err = s.db.QueryRow(query, creds.Login).Scan(&passwordHash, &role, &firstName, &lastName, &patronymic)
	case constants.MANAGER_STRATEGY:
		query := "SELECT manager_password, manager_first_name, manager_last_name, manager_patronymic FROM managers WHERE manager_login = $1"
		err = s.db.QueryRow(query, creds.Login).Scan(&passwordHash, &firstName, &lastName, &patronymic)
		role = globalConstants.MANAGER_ROLE
	default:
		log.Fatalln("Unknown strategy")
	}

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.Error404
		}

		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(creds.Password))

	if err != nil {
		return nil, errors.Error401
	}

	accessToken, err := createAccessToken(creds.Login, role, firstName, lastName, patronymic)
	if err != nil {
		return nil, err
	}

	refreshToken, err := createRefreshToken(creds.Login, role, firstName, lastName, patronymic)
	if err != nil {
		return nil, err
	}

	tokens = app.Tokens{AccessToken: accessToken, RefreshToken: refreshToken}

	var updateQuery string

	switch strategy {
	case constants.ADMIN_STRATEGY:
		updateQuery = "UPDATE admins SET refresh_token = $1 WHERE admin_login = $2"
	case constants.MANAGER_STRATEGY:
		updateQuery = "UPDATE managers SET refresh_token = $1 WHERE manager_login = $2"
	default:
		log.Fatalln("Unknown strategy")
	}

	_, err = s.db.Query(updateQuery, refreshToken, creds.Login)

	if err != nil {
		return nil, err
	}

	return &tokens, nil
}

func (s *service) Refresh(refreshToken string, strategy string) (*app.Tokens, error) {
	var tokens app.Tokens

	refreshKeySecret := viper.GetString("REFRESH_TOKEN_SECRET")

	_, err := jwt.ParseWithClaims(refreshToken, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(refreshKeySecret), nil
	})

	if err != nil {
		return nil, errors.Error401
	}

	var login string
	var role string
	var firstName string
	var lastName string
	var patronymic string

	switch strategy {
	case constants.ADMIN_STRATEGY:
		query := "SELECT admin_login, admin_role, admin_first_name, admin_last_name, admin_patronymic FROM admins WHERE refresh_token = $1"
		err = s.db.QueryRow(query, refreshToken).Scan(&login, &role, &firstName, &lastName, &patronymic)
	case constants.MANAGER_STRATEGY:
		query := "SELECT manager_login, manager_first_name, manager_last_name, manager_patronymic FROM managers WHERE refresh_token = $1"
		err = s.db.QueryRow(query, refreshToken).Scan(&login, &firstName, &lastName, &patronymic)

		role = globalConstants.MANAGER_ROLE
	default:
		log.Fatalln("Unknown strategy")
	}

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.Error404
		}

		return nil, err
	}

	if err != nil {
		return nil, errors.Error401
	}

	accessToken, err := createAccessToken(login, role, firstName, lastName, patronymic)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := createRefreshToken(login, role, firstName, lastName, patronymic)
	if err != nil {
		return nil, err
	}

	tokens = app.Tokens{AccessToken: accessToken, RefreshToken: newRefreshToken}

	var updateQuery string

	switch strategy {
	case constants.ADMIN_STRATEGY:
		updateQuery = "UPDATE admins SET refresh_token = $1 WHERE admin_login = $2"
	case constants.MANAGER_STRATEGY:
		updateQuery = "UPDATE managers SET refresh_token = $1 WHERE manager_login = $2"
	default:
		log.Fatalln("Unknown strategy")
	}

	_, err = s.db.Query(updateQuery, newRefreshToken, login)

	if err != nil {
		return nil, err
	}

	return &tokens, nil
}

func (s *service) Logout(refreshToken string, strategy string) error {
	var query string

	switch strategy {
	case constants.ADMIN_STRATEGY:
		query = "UPDATE admins SET refresh_token = NULL WHERE refresh_token = $1 RETURNING admin_login"
	case constants.MANAGER_STRATEGY:
		query = "UPDATE managers SET refresh_token = NULL WHERE refresh_token = $1 RETURNING manager_login"
	default:
		log.Fatalln("Unknown strategy")
	}

	var answ string

	err := s.db.QueryRow(query, refreshToken).Scan(&answ)

	if err == sql.ErrNoRows {
		return errors.Error404
	}

	return err
}

func createRefreshToken(login string, role string, firstName string, lastName string, patronymic string) (string, error) {
	signString := viper.GetString("REFRESH_TOKEN_SECRET")

	if signString == "" {
		log.Fatalln("Can not find refresh token secret...")
	}

	token := jwt.New(jwt.SigningMethodHS256)

	token.Claims = &CustomClaims{
		&jwt.StandardClaims{
			NotBefore: time.Now().Unix(),
		},
		CustomerInfo{Login: login, FirstName: firstName, LastName: lastName, Patronymic: patronymic, Role: role, TokenType: globalConstants.TOKEN_TYPE_REFRESH},
	}

	return token.SignedString([]byte(signString))
}

func createAccessToken(login string, role string, firstName string, lastName string, patronymic string) (string, error) {
	signString := viper.GetString("ACCESS_TOKEN_SECRET")

	if signString == "" {
		log.Fatalln("Can not find access token secret...")
	}

	token := jwt.New(jwt.SigningMethodHS256)

	token.Claims = &CustomClaims{
		&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * ACCESS_TOKEN_TTL).Unix(),
		},
		CustomerInfo{Login: login, FirstName: firstName, LastName: lastName, Patronymic: patronymic, Role: role, TokenType: globalConstants.TOKEN_TYPE_ACCESS},
	}

	return token.SignedString([]byte(signString))
}
