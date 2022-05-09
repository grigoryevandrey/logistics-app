package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
)

type customerInfo struct {
	Name string
	Role string
}

type customClaims struct {
	*jwt.StandardClaims
	customerInfo
}

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.Request.Header.Get("Authorization")

		splittedAuthHeader := strings.Fields(authHeader)
		if len(splittedAuthHeader) < 2 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "bad auth header"})
			return
		}

		accessKeySecret := viper.GetString("ACCESS_TOKEN_SECRET")
		accessTokenString := splittedAuthHeader[1]

		token, err := jwt.ParseWithClaims(accessTokenString, &customClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(accessKeySecret), nil
		})

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "can not verify token"})
			return
		}

		ctx.Set("user", token.Claims.(*customClaims))

		ctx.Next()
	}
}
