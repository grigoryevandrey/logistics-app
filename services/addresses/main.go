package main

import (
	"log"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app/database"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/service"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/transport"
)

func main() {
	databaseConnection := database.Connect()

	defer databaseConnection.Close()

	serviceInstance := service.New(databaseConnection)
	application := transport.Handler(serviceInstance)

	serverAddress := "0.0.0.0:3000"

	log.Fatalln(application.Run(serverAddress))
}
