package service

import (
	"database/sql"
	"fmt"

	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
)

const ADDRESSES_TABLE = "addresses"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetAddresses(offset int, limit int) ([]app.GetAddressesResponse, error) {
	var result []app.GetAddressesResponse

	query := fmt.Sprintf("SELECT id FROM %s OFFSET %d LIMIT %d", ADDRESSES_TABLE, offset, limit)

	rows, err := s.db.Query(query)

	if (err != nil) {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var id int

        if err := rows.Scan(&id); err != nil {
			return nil, err
		}

		element := app.GetAddressesResponse{ Id: id }
		result = append(result, element)
	}

	if err := rows.Err(); err != nil {
		return nil, err
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