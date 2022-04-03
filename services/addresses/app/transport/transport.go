package transport

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
	"github.com/matryer/way"
)

type handler struct {
	app.Service
}

func Handler(service app.Service) http.Handler {
	injectedHandler := &handler{service}

	router := way.NewRouter()
	router.HandleFunc("GET", "/api/v1/addresses", injectedHandler.getAddresses)
	router.HandleFunc("POST", "/api/v1/addresses", injectedHandler.addAddress)
	router.HandleFunc("PATCH", "/api/v1/addresses", injectedHandler.updateAddress)
	router.HandleFunc("DELETE", "/api/v1/addresses", injectedHandler.deleteAddress)
	return router
}

func (handlerRef *handler) addAddress(response http.ResponseWriter, request *http.Request) {
	response.Write([]byte(handlerRef.AddAddress()))
}

func (handlerRef *handler) getAddresses(response http.ResponseWriter, request *http.Request) {
	addresses, err := handlerRef.GetAddresses()

	if (err != nil) {
		log.Fatal(err)
	}

	formatted, err := json.Marshal(addresses)

	if (err != nil) {
		log.Fatal(err)
	} 

	response.Write(formatted)
}

func (handlerRef *handler) updateAddress(response http.ResponseWriter, request *http.Request) {
	response.Write([]byte(handlerRef.UpdateAddress()))
}

func (handlerRef *handler) deleteAddress(response http.ResponseWriter, request *http.Request) {
	answ, err := json.Marshal(handlerRef.DeleteAddress())

	if (err != nil) {
		log.Fatal(err)
	}

	response.Write(answ)
}