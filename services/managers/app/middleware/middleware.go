package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RestrictionsMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, exists := ctx.Get("user")

		if !exists {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user is not exists but required"})
			return
		}

		log.Println(user)

		ctx.Next()
	}
}
