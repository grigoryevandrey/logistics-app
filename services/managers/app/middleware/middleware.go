package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	globalConstants "github.com/grigoryevandrey/logistics-app/lib/constants"
	"github.com/grigoryevandrey/logistics-app/lib/middlewares/auth/models"
)

func RestrictionsMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, exists := ctx.Get("user")

		if !exists {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user is not exists but required"})
			return
		}

		role := user.(models.CustomerInfo).Role

		if role != globalConstants.ADMIN_ROLE_REGULAR && role != globalConstants.ADMIN_ROLE_SUPER {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "endpoint is forbidden for user"})
			return
		}

		ctx.Next()
	}
}
