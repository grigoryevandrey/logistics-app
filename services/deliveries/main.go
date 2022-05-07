package main

import (
	"fmt"
	"log"

	"github.com/grigoryevandrey/logistics-app/lib/database"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/app/service"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/app/transport"
	"github.com/grigoryevandrey/logistics-app/services/deliveries/config"
	"github.com/spf13/viper"
)

func main() {
	config.Init()

	port := viper.GetString("DELIVERIES_PORT")
	host := viper.GetString("DELIVERIES_HOST")

	serverAddress := fmt.Sprintf("%s:%s", host, port)

	connectionString := viper.GetString("PG_CONNECTION_STRING")

	databaseConnection := database.Connect(connectionString)

	defer databaseConnection.Close()

	serviceInstance := service.New(databaseConnection)
	application := transport.Handler(serviceInstance)

	log.Fatalln(application.Run(serverAddress))
}
