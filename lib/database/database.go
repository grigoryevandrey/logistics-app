package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func Connect(connStr string) *sql.DB {
	database, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalln(err)
	}

	return database
}
