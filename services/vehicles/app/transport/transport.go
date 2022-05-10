package transport

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	globalConstants "github.com/grigoryevandrey/logistics-app/lib/constants"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/lib/middlewares/auth"
	jsonmw "github.com/grigoryevandrey/logistics-app/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/lib/middlewares/restrictions"
	"github.com/grigoryevandrey/logistics-app/services/vehicles/app"
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
			vehiclesGroup := v1.Group("vehicles")
			vehiclesGroup.Use(auth.AuthMiddleware())
			{
				vehiclesGroup.GET("/", injectedHandler.getVehicles)
				vehiclesGroup.POST("/", injectedHandler.addVehicle)
				vehiclesGroup.PUT("/", injectedHandler.updateVehicle)
			}

			restrictedGroup := v1.Group("vehicles")
			restrictedGroup.Use(auth.AuthMiddleware())
			restrictedGroup.Use(restrictions.RestrictionsMiddleware(globalConstants.MANAGER_ROLE))
			{
				restrictedGroup.DELETE("/", injectedHandler.deleteVehicle)
			}

			healthGroup := v1.Group("health")
			{
				healthGroup.GET("/", injectedHandler.health)
			}
		}
	}

	return router
}

func (handlerRef *handler) health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "UP"})
}

func (handlerRef *handler) addVehicle(ctx *gin.Context) {
	var vehicle app.PostVehicleDto

	err := ctx.ShouldBindJSON(&vehicle)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(vehicle)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.AddVehicle(vehicle)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) getVehicles(ctx *gin.Context) {
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

	vehicles, err := handlerRef.GetVehicles(offset, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"vehicles": vehicles, "total": len(vehicles), "offset": offset})
}

func (handlerRef *handler) updateVehicle(ctx *gin.Context) {
	var vehicle app.UpdateVehicleDto

	err := ctx.BindJSON(&vehicle)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(vehicle)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.UpdateVehicle(vehicle)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find vehicle with id: %d", vehicle.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) deleteVehicle(ctx *gin.Context) {
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

	response, err := handlerRef.DeleteVehicle(id)

	if err != nil {
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find vehicle with id: %d", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}
