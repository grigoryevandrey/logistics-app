package service

import (
	"database/sql"
	"fmt"

	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/managers/app"
	"golang.org/x/crypto/bcrypt"
)

const HASHING_COST = 10
const MANAGERS_TABLE = "managers"
const ENTITY_FIELDS = "id, manager_last_name, manager_first_name, manager_patronymic, is_disabled"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetManager(id string) (*app.ManagerEntity, error) {
	var result app.ManagerEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s WHERE id = $1",
		ENTITY_FIELDS,
		MANAGERS_TABLE,
	)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&result.Id,
		&result.LastName,
		&result.FirstName,
		&result.Patronymic,
		&result.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &result, nil
	}
}

func (s *service) GetManagers(offset int, limit int) ([]app.ManagerEntity, error) {
	var result []app.ManagerEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s OFFSET %d LIMIT %d", ENTITY_FIELDS,
		MANAGERS_TABLE,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var managerEntity app.ManagerEntity

		if err := rows.Scan(
			&managerEntity.Id,
			&managerEntity.LastName,
			&managerEntity.FirstName,
			&managerEntity.Patronymic,
			&managerEntity.IsDisabled,
		); err != nil {
			return nil, err
		}

		result = append(result, managerEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddManager(manager app.PostManagerDto) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("INSERT INTO %s (manager_login, manager_password, manager_last_name, manager_first_name, manager_patronymic, is_disabled) VALUES ($1, $2, $3, $4, $5) RETURNING %s", MANAGERS_TABLE, ENTITY_FIELDS)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(manager.Password), HASHING_COST)

	if err != nil {
		return nil, err
	}

	err = s.db.QueryRow(
		query,
		manager.Login,
		hashedPassword,
		manager.LastName,
		manager.FirstName,
		manager.Patronymic,
		false,
	).Scan(
		&managerEntity.Id,
		&managerEntity.LastName,
		&managerEntity.FirstName,
		&managerEntity.Patronymic,
		&managerEntity.IsDisabled,
	)

	if err != nil {
		return nil, err
	}

	return &managerEntity, nil
}

func (s *service) UpdateManager(manager app.UpdateManagerDto) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("UPDATE %s SET manager_login = $1, manager_password = $2, manager_last_name = $3, manager_first_name = $4, manager_patronymic = $5, is_disabled = $6 WHERE id = $7 RETURNING %s", MANAGERS_TABLE, ENTITY_FIELDS)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(manager.Password), HASHING_COST)

	if err != nil {
		return nil, err
	}

	err = s.db.QueryRow(
		query,
		manager.Login,
		hashedPassword,
		manager.LastName,
		manager.FirstName,
		manager.Patronymic,
		manager.IsDisabled,
		manager.Id,
	).Scan(
		&managerEntity.Id,
		&managerEntity.LastName,
		&managerEntity.FirstName,
		&managerEntity.Patronymic,
		&managerEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &managerEntity, nil
	}
}

func (s *service) DeleteManager(id int) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", MANAGERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&managerEntity.Id,
		&managerEntity.LastName,
		&managerEntity.FirstName,
		&managerEntity.Patronymic,
		&managerEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &managerEntity, nil
	}
}