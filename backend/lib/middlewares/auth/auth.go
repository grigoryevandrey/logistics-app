package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/auth/models"
	"github.com/spf13/viper"
)

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

		if accessTokenString == "" {
			if len(splittedAuthHeader) < 2 {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token is empty"})
				return
			}
		}

		token, err := jwt.ParseWithClaims(accessTokenString, &models.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(accessKeySecret), nil
		})

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token is invalid", "message": err.Error()})
			return
		}

		tokenType := token.Claims.(*models.CustomClaims).CustomerInfo.TokenType

		if tokenType == globalConstants.TOKEN_TYPE_REFRESH {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "can not use refresh token for access"})
			return
		}

		ctx.Set("user", token.Claims.(*models.CustomClaims).CustomerInfo)

		ctx.Next()
	}
}
