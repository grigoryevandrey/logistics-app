package models

import "github.com/golang-jwt/jwt"

type CustomerInfo struct {
	Name      string
	Role      string
	TokenType string
}

type CustomClaims struct {
	*jwt.StandardClaims
	CustomerInfo
}
