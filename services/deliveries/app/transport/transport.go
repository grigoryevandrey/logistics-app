package transport

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsonmw "github.com/grigoryevandrey/logistics-app/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/app"
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
			deliveriesGroup := v1.Group("deliveries")
			{
				deliveriesGroup.GET("/:id", injectedHandler.getDelivery)
				deliveriesGroup.GET("/", injectedHandler.getDeliveries)
				deliveriesGroup.POST("/", injectedHandler.addDelivery)
				deliveriesGroup.PUT("/", injectedHandler.updateDelivery)
				deliveriesGroup.DELETE("/", injectedHandler.deleteDelivery)

				healthGroup := deliveriesGroup.Group("health")
				{
					healthGroup.GET("/", injectedHandler.health)
				}

				statusesGroup := deliveriesGroup.Group("statuses")
				{
					statusesGroup.GET("/", injectedHandler.getDeliveryStatuses)

					statusesGroup.PUT("/", injectedHandler.updateDeliveryStatus)
				}
			}
		}
	}

	return router
}

func (handlerRef *handler) health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "UP"})
}

func (handlerRef *handler) getDelivery(ctx *gin.Context) {}

func (handlerRef *handler) getDeliveries(ctx *gin.Context) {}

func (handlerRef *handler) addDelivery(ctx *gin.Context) {}

func (handlerRef *handler) updateDelivery(ctx *gin.Context) {}

func (handlerRef *handler) deleteDelivery(ctx *gin.Context) {}

func (handlerRef *handler) getDeliveryStatuses(ctx *gin.Context) {}

func (handlerRef *handler) updateDeliveryStatus(ctx *gin.Context) {}
