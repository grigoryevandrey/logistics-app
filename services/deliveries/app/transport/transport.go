package transport

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
	jsonmw "github.com/grigoryevandrey/logistics-app/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/app"
	"gopkg.in/validator.v2"
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

func (handlerRef *handler) addDelivery(ctx *gin.Context) {
	var delivery app.PostDeliveryDto

	err := ctx.ShouldBindJSON(&delivery)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(delivery)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.AddDelivery(delivery)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) updateDelivery(ctx *gin.Context) {
	var delivery app.UpdateDeliveryDto

	err := ctx.BindJSON(&delivery)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(delivery)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.UpdateDelivery(delivery)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find delivery with id: %d", delivery.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) deleteDelivery(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	id, err := strconv.Atoi(query.Get("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if id <= 0 {
		message := fmt.Sprintf("Id should be an int more than 0, recieved: %d", id)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	response, err := handlerRef.DeleteDelivery(id)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find delivery with id: %d", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) getDeliveryStatuses(ctx *gin.Context) {
	response, err := handlerRef.GetDeliveryStatuses()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) updateDeliveryStatus(ctx *gin.Context) {
	var delivery app.UpdateDeliveryStatusDto

	err := ctx.BindJSON(&delivery)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(delivery)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.UpdateDeliveryStatus(delivery)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find delivery with id: %d", delivery.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		if err == errors.Error409 {
			message := fmt.Sprintf("Can not modify delivery status (status 'delivered' is immutable) with id: %d", delivery.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}