package service

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
)

const ADDRESSES_TABLE = "addresses"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetAddresses() ([]app.GetAddressesResponse, error) {
	var result []app.GetAddressesResponse

	limit := 10
	offset := 10

	query := fmt.Sprintf("SELECT id FROM %s OFFSET %d LIMIT %d", ADDRESSES_TABLE, offset, limit)

	rows, err := s.db.Query(query)

	if (err != nil) {
		log.Fatal(err)
	}

	defer rows.Close()

	for rows.Next() {
		var id int

        if err := rows.Scan(&id); err != nil {
			log.Fatal(err)
		}

		element := app.GetAddressesResponse{ Id: id }
		result = append(result, element)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return result, nil
}

func (s *service) AddAddress() string {
	return "post"
}

func (s *service) UpdateAddress() string {
	return "patch"
}

func (s *service) DeleteAddress() string {
	return "delete"
}