package transport

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
	"github.com/julienschmidt/httprouter"
)

type handler struct {
	app.Service
}

func Handler(service app.Service) http.Handler {
	router := httprouter.New()
	injectedHandler := &handler{service}


	router.GET("/api/v1/addresses", injectedHandler.getAddresses)
	router.POST("/api/v1/addresses", injectedHandler.addAddress)
	router.PATCH("/api/v1/addresses", injectedHandler.updateAddress)
	router.DELETE("/api/v1/addresses", injectedHandler.deleteAddress)
	return router
}

func (handlerRef *handler) addAddress(response http.ResponseWriter, request *http.Request, param httprouter.Params) {
	response.Write([]byte(handlerRef.AddAddress()))
}

func (handlerRef *handler) getAddresses(response http.ResponseWriter, request *http.Request, params httprouter.Params) {
	log.Println(request.URL.Query())

	query := request.URL.Query()

	limit, err := strconv.Atoi(query.Get("limit"))

	if (err != nil) {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte(err.Error()))
		return
	}

	offset, err := strconv.Atoi(query.Get("offset"))

	if (err != nil) {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte(err.Error()))
		return
	}

	if (offset < 0) {
		offset = 0
	}

	if (limit <= 0) {
		limit = 10
	}

	addresses, err := handlerRef.GetAddresses(offset, limit)

	if (err != nil) {
		log.Println(err.Error())
		return
	}

	formatted, err := json.Marshal(addresses)

	if (err != nil) {
		log.Println(err.Error())
		return
	}

	response.Write(formatted)
}

func (handlerRef *handler) updateAddress(response http.ResponseWriter, request *http.Request, params httprouter.Params) {
	response.Write([]byte(handlerRef.UpdateAddress()))
}

func (handlerRef *handler) deleteAddress(response http.ResponseWriter, request *http.Request, params httprouter.Params) {
	answ, err := json.Marshal(handlerRef.DeleteAddress())

	if (err != nil) {
		log.Fatal(err)
	}

	response.Write(answ)
}