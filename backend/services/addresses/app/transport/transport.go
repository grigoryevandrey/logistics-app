package transport

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"
	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/auth"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/cors"
	jsonmw "github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/restrictions"
	"github.com/grigoryevandrey/logistics-app/backend/services/addresses/app"
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
	router.Use(cors.CORSMiddleware())

	injectedHandler := &handler{service}

	superGroup := router.Group("api")

	{
		v1 := superGroup.Group("v1")
		{
			addressesGroup := v1.Group("addresses")
			addressesGroup.Use(auth.AuthMiddleware())
			{
				addressesGroup.GET("/:id", injectedHandler.getAddress)
				addressesGroup.GET("/", injectedHandler.getAddresses)
				addressesGroup.POST("/", injectedHandler.addAddress)
				addressesGroup.PUT("/", injectedHandler.updateAddress)

			}

			restrictedGroup := v1.Group("addresses")
			restrictedGroup.Use(auth.AuthMiddleware())
			restrictedGroup.Use(restrictions.RestrictionsMiddleware(globalConstants.MANAGER_ROLE))
			{
				restrictedGroup.DELETE("/", injectedHandler.deleteAddress)
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

func (handlerRef *handler) addAddress(ctx *gin.Context) {
	var address app.PostAddressDto

	err := ctx.ShouldBindJSON(&address)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(address)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.AddAddress(address)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, response)
}

func (handlerRef *handler) getAddress(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad id param"})
		return
	}

	address, err := handlerRef.GetAddress(id)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find address with id: %s", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, address)
}

func (handlerRef *handler) getAddresses(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong limit param"})
		return
	}

	offset, err := strconv.Atoi(query.Get("offset"))
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong offset param"})
		return
	}

	sort := query.Get("sort")
	if sort == "" {
		sort = app.DEFAULT_SORTING_STRATEGY
	}

	sortString, ok := app.SortingStrategies[sort]

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad sort param"})
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

	addresses, totalRows, err := handlerRef.GetAddresses(offset, limit, sortString)
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"addresses": addresses, "count": len(addresses), "totalRows": totalRows, "offset": offset})
}

func (handlerRef *handler) updateAddress(ctx *gin.Context) {
	var address app.UpdateAddressDto

	err := ctx.BindJSON(&address)
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(address)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.UpdateAddress(address)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find address with id: %d", address.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) deleteAddress(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	id, err := strconv.Atoi(query.Get("id"))

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if id <= 0 {
		message := fmt.Sprintf("Id should be an int more than 0, recieved: %d", id)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	response, err := handlerRef.DeleteAddress(id)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find address with id: %d", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}
