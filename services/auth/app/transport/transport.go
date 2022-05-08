package transport

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsonmw "github.com/grigoryevandrey/logistics-app/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/services/auth/app"
)

type handler struct {
	app.Service
}

func Handler(service app.Service) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(jsonmw.JSONMiddleware())

	injectedHandler := &handler{service}

	superGroup := router.Group("api")

	{
		v1 := superGroup.Group("v1")
		{
			authGroup := v1.Group("auth")
			{
				authGroup.POST("/login", injectedHandler.login)
				authGroup.DELETE("/logout", injectedHandler.logout)

				healthGroup := authGroup.Group("health")
				{
					healthGroup.GET("/", injectedHandler.health)
				}
			}
		}
	}

	return router
}

func (handlerRef *handler) health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "UP"})
}

func (handlerRef *handler) login(ctx *gin.Context) {}

func (handlerRef *handler) logout(ctx *gin.Context) {}
