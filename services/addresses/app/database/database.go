package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	connStr := "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable"
	database, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalln(err)
	}

	return database
}
