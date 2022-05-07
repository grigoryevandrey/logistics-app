package transport

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
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

func (handlerRef *handler) getDelivery(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if id <= 0 {
		message := fmt.Sprintf("Id should be an int more than 0, recieved: %d", id)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	delivery, err := handlerRef.GetDelivery(id)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find delivery with id: %d", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, delivery)
}

func (handlerRef *handler) getDeliveries(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong limit param"})
		return
	}

	offset, err := strconv.Atoi(query.Get("offset"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong offset param"})
		return
	}

	if offset < 0 {
		offset = 0
	}

	if limit <= 0 {
		limit = 10
	}

	if limit > 100 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "limit param is too big"})
		return
	}

	deliveries, err := handlerRef.GetDeliveries(offset, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"deliveries": deliveries, "total": len(deliveries), "offset": offset})
}

func (handlerRef *handler) addDelivery(ctx *gin.Context) {}

func (handlerRef *handler) updateDelivery(ctx *gin.Context) {}

func (handlerRef *handler) deleteDelivery(ctx *gin.Context) {}

func (handlerRef *handler) getDeliveryStatuses(ctx *gin.Context) {}

func (handlerRef *handler) updateDeliveryStatus(ctx *gin.Context) {}
