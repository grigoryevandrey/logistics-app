package main

import (
	"fmt"
	"log"

	"github.com/grigoryevandrey/logistics-app/lib/database"
	"github.com/grigoryevandrey/logistics-app/services/drivers/app/config"
	"github.com/grigoryevandrey/logistics-app/services/drivers/app/service"
	"github.com/grigoryevandrey/logistics-app/services/drivers/app/transport"
	"github.com/spf13/viper"
)

func main() {
	config.Init()

	port := viper.GetString("DRIVERS_PORT")
	host := viper.GetString("DRIVERS_HOST")

	serverAddress := fmt.Sprintf("%s:%s", host, port)

	connectionString := viper.GetString("PG_CONNECTION_STRING")

	databaseConnection := database.Connect(connectionString)

	defer databaseConnection.Close()

	serviceInstance := service.New(databaseConnection)
	application := transport.Handler(serviceInstance)

	log.Fatalln(application.Run(serverAddress))
}