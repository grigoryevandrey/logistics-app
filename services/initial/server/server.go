package server

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)


func Server() string {
	fmt.Println("can print")
	log.Println("can log")

	connStr := "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("SELECT * FROM drivers")

	
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	for rows.Next() {
        var a, b, c, d, e, f string
        if err := rows.Scan(&a, &b, &c, &d, &e, &f); err != nil {
                log.Fatal(err)
        }
        fmt.Printf("%s %s %s %s %s %s\n", a, b, c, d, e, f)
	}

	if err := rows.Err(); err != nil {
			log.Fatal(err)
	}


	return "aaa"
}
