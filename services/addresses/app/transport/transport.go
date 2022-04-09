package transport

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
	"gopkg.in/validator.v2"
)

type handler struct {
	app.Service
}

func Handler(service app.Service) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	injectedHandler := &handler{service}

	superGroup := router.Group("api")

	{
		v1 := superGroup.Group("v1")
		{
			addressesGroup := v1.Group("addresses")
			{
				addressesGroup.GET("/", injectedHandler.getAddresses)
				addressesGroup.POST("/", injectedHandler.addAddress)
				addressesGroup.PATCH("/", injectedHandler.updateAddress)
				addressesGroup.DELETE("/", injectedHandler.deleteAddress)

				healthGroup := addressesGroup.Group("health")
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

func (handlerRef *handler) addAddress(ctx *gin.Context) {
	var address app.PostAddressDto

	err := ctx.ShouldBindJSON(&address)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(address)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.AddAddress(address)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) getAddresses(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	offset, err := strconv.Atoi(query.Get("offset"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if offset < 0 {
		offset = 0
	}

	if limit <= 0 {
		limit = 10
	}

	addresses, err := handlerRef.GetAddresses(offset, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"addresses": addresses})
}

func (handlerRef *handler) updateAddress(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, handlerRef.UpdateAddress())
}

func (handlerRef *handler) deleteAddress(ctx *gin.Context) {
	answ, err := json.Marshal(handlerRef.DeleteAddress())
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, answ)
}
