package main

import (
	"log"
	"net/http"

	"database/sql"

	_ "github.com/lib/pq"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app/service"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app/transport"
)

func main() {
	connStr := "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable"
	database, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	defer database.Close()

	serviceInstance := service.New(database)
	application := transport.Handler(serviceInstance)

	log.Println("Server is starting...")
	err = http.ListenAndServe(":3000", application)

	log.Fatalln(err)
}