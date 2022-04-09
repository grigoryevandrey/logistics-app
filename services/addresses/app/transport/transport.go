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

type AddressPostDto struct {
	Address   string  `validate:"min=3,regexp=^[a-zA-Z,.:;]$,nonnil"`
	Latitude  float64 `validate:"min=-90,max=90,nonnil"`
	Longitude float64 `validate:"min=-180,max=180,nonnil"`
}

// router := gin.New()
// router.Use(gin.Logger())
// router.Use(gin.Recovery())

// superGroup := router.Group("api")

// {
// 	v1 := superGroup.Group("v1")
// 	{
// 		addressesGroup := v1.Group("addresses")
// 		{
// 			addressesGroup.GET("/:id", user.Retrieve)
// 		}
// 	}
// }

// return router

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
	// b, _ := ioutil.ReadAll(request.Body)
	decoder := json.NewDecoder(ctx.Request.Body)

	var body AddressPostDto

	// nur := NewUserRequest{Username: "something", Age: 20}
	// if errs := validator.Validate(nur); errs != nil {
	// 	// values not valid, deal with errors here
	// }

	decoder.Decode(&body)

	log.Println(body)

	if errs := validator.Validate(body); errs != nil {
		log.Println(errs)
	}

	// log.Println(ioutil.NopCloser(bytes.NewBuffer(b)))

	ctx.JSON(http.StatusOK, handlerRef.AddAddress())
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
