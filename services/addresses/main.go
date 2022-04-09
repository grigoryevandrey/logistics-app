package main

import (
	"fmt"
	"log"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app/config"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/database"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/service"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/transport"
	"github.com/spf13/viper"
)

func main() {
	config.Init()

	port := viper.GetString("APP_PORT")
	host := viper.GetString("APP_HOST")

	serverAddress := fmt.Sprintf("%s:%s", host, port)

	connectionString := viper.GetString("PG_CONNECTION_STRING")

	databaseConnection := database.Connect(connectionString)

	defer databaseConnection.Close()

	serviceInstance := service.New(databaseConnection)
	application := transport.Handler(serviceInstance)

	log.Fatalln(application.Run(serverAddress))
}
