package main

import (
	"fmt"
	"log"

	"github.com/grigoryevandrey/logistics-app/backend/lib/database"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app/service"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app/transport"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/config"
	"github.com/spf13/viper"
)

func main() {
	config.Init()

	port := viper.GetString("AUTH_PORT")
	host := viper.GetString("AUTH_HOST")

	serverAddress := fmt.Sprintf("%s:%s", host, port)

	connectionString := viper.GetString("PG_CONNECTION_STRING")

	databaseConnection := database.Connect(connectionString)

	defer databaseConnection.Close()

	serviceInstance := service.New(databaseConnection)
	application := transport.Handler(serviceInstance)

	log.Fatalln(application.Run(serverAddress))
}
