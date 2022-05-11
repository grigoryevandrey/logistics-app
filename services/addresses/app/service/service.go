package service

import (
	"database/sql"
	"fmt"

	globalConstants "github.com/grigoryevandrey/logistics-app/lib/constants"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/addresses/app"
)

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetAddresses(offset int, limit int, sort string) ([]app.AddressEntity, error) {
	var result []app.AddressEntity

	query := fmt.Sprintf(
		"SELECT id, address, latitude, longitude, is_disabled FROM %s %s OFFSET %d LIMIT %d", globalConstants.ADDRESSES_TABLE,
		sort,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var addressEntity app.AddressEntity

		if err := rows.Scan(
			&addressEntity.Id,
			&addressEntity.Address,
			&addressEntity.Latitude,
			&addressEntity.Longitude,
			&addressEntity.IsDisabled,
		); err != nil {
			return nil, err
		}

		result = append(result, addressEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddAddress(address app.PostAddressDto) (*app.AddressEntity, error) {
	var addressEntity app.AddressEntity

	query := fmt.Sprintf("INSERT INTO %s (address, latitude, longitude, is_disabled) VALUES ($1, $2, $3, $4) RETURNING id, address, latitude, longitude, is_disabled", globalConstants.ADDRESSES_TABLE)

	err := s.db.QueryRow(
		query,
		address.Address,
		address.Latitude,
		address.Longitude,
		false,
	).Scan(
		&addressEntity.Id,
		&addressEntity.Address,
		&addressEntity.Latitude,
		&addressEntity.Longitude,
		&addressEntity.IsDisabled,
	)

	if err != nil {
		return nil, err
	}

	return &addressEntity, nil
}

func (s *service) UpdateAddress(address app.UpdateAddressDto) (*app.AddressEntity, error) {
	var addressEntity app.AddressEntity

	query := fmt.Sprintf("UPDATE %s SET address = $1, latitude = $2, longitude = $3, is_disabled = $4 WHERE id = $5 RETURNING id, address, latitude, longitude, is_disabled", globalConstants.ADDRESSES_TABLE)

	err := s.db.QueryRow(
		query,
		address.Address,
		address.Latitude,
		address.Longitude,
		address.IsDisabled,
		address.Id,
	).Scan(
		&addressEntity.Id,
		&addressEntity.Address,
		&addressEntity.Latitude,
		&addressEntity.Longitude,
		&addressEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &addressEntity, nil
	}
}

func (s *service) DeleteAddress(id int) (*app.AddressEntity, error) {
	var addressEntity app.AddressEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING id, address, latitude, longitude, is_disabled", globalConstants.ADDRESSES_TABLE)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&addressEntity.Id,
		&addressEntity.Address,
		&addressEntity.Latitude,
		&addressEntity.Longitude,
		&addressEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &addressEntity, nil
	}
}
