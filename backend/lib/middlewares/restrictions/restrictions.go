package restrictions

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/auth/models"
)

func RestrictionsMiddleware(forbiddenRole string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, exists := ctx.Get("user")

		if !exists {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user is not exists but required"})
			return
		}

		role := user.(models.CustomerInfo).Role

		if role == forbiddenRole {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "action is forbidden for user"})
			return
		}

		ctx.Next()
	}
}
