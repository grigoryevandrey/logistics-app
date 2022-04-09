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

func (s *service) GetAddresses(offset int, limit int) ([]app.GetAddressesResponseDto, error) {
	var result []app.GetAddressesResponseDto

	query := fmt.Sprintf(
		"SELECT id, address, latitude, longitude, is_disabled FROM %s OFFSET %d LIMIT %d", ADDRESSES_TABLE,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var id int
		var address string
		var latitute, longitude float64
		var isDisabled bool

		if err := rows.Scan(&id, &address, &latitute, &longitude, &isDisabled); err != nil {
			return nil, err
		}

		element := app.GetAddressesResponseDto{
			Id:         id,
			Address:    address,
			Latitude:   latitute,
			Longitude:  longitude,
			IsDisabled: isDisabled,
		}
		result = append(result, element)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddAddress(address app.PostAddressDto) (*app.PostAddressResponseDto, error) {
	var id int
	var addressText string
	var latitute, longitude float64
	var isDisabled bool

	query := "INSERT INTO addresses (address, latitude, longitude, is_disabled) VALUES ($1, $2, $3, $4) RETURNING id, address, latitude, longitude, is_disabled"

	err := s.db.QueryRow(
		query,
		address.Address,
		address.Latitude,
		address.Longitude,
		false,
	).Scan(
		&id,
		&addressText,
		&latitute,
		&longitude,
		&isDisabled,
	)

	if err != nil {
		return nil, err
	}

	response := app.PostAddressResponseDto{
		Id:         id,
		Address:    addressText,
		Latitude:   latitute,
		Longitude:  longitude,
		IsDisabled: isDisabled,
	}

	return &response, nil
}

func (s *service) UpdateAddress(address app.UpdateAddressDto) (*app.UpdateAddressResponseDto, error) {
	var id int
	var addressText string
	var latitute, longitude float64
	var isDisabled bool

	query := "UPDATE addresses SET address = $1, latitude = $2, longitude = $3, is_disabled = $4 WHERE id = $5 RETURNING id, address, latitude, longitude, is_disabled"

	err := s.db.QueryRow(
		query,
		address.Address,
		address.Latitude,
		address.Longitude,
		address.IsDisabled,
		address.Id,
	).Scan(
		&id,
		&addressText,
		&latitute,
		&longitude,
		&isDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, app.Error404
	case err != nil:
		return nil, err
	default:
		response := app.UpdateAddressResponseDto{
			Id:         id,
			Address:    addressText,
			Latitude:   latitute,
			Longitude:  longitude,
			IsDisabled: isDisabled,
		}

		return &response, nil
	}
}

func (s *service) DeleteAddress(id int) (*app.DeleteAddressResponseDto, error) {
	var deletedId int
	var addressText string
	var latitute, longitude float64
	var isDisabled bool

	query := "DELETE FROM addresses WHERE id = $1 RETURNING id, address, latitude, longitude, is_disabled"

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&deletedId,
		&addressText,
		&latitute,
		&longitude,
		&isDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, app.Error404
	case err != nil:
		return nil, err
	default:
		response := app.DeleteAddressResponseDto{
			Id:         id,
			Address:    addressText,
			Latitude:   latitute,
			Longitude:  longitude,
			IsDisabled: isDisabled,
		}

		return &response, nil
	}
}
