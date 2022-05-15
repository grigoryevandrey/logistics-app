package service

import (
	"database/sql"
	"fmt"
	"strings"

	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"

	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/services/managers/app"
	"golang.org/x/crypto/bcrypt"
)

const ENTITY_FIELDS = "id, manager_login, manager_last_name, manager_first_name, manager_patronymic, is_disabled"

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
		globalConstants.MANAGERS_TABLE,
	)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&result.Id,
		&result.Login,
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

func (s *service) GetManagers(offset int, limit int, sort string) ([]app.ManagerEntity, *int, error) {
	var result []app.ManagerEntity
	var totalRows int

	query := fmt.Sprintf(
		"SELECT %s, count(*) OVER() AS total_rows FROM %s %s OFFSET %d LIMIT %d", ENTITY_FIELDS,
		globalConstants.MANAGERS_TABLE,
		sort,
		offset,
		limit,
	)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var managerEntity app.ManagerEntity

		if err := rows.Scan(
			&managerEntity.Id,
			&managerEntity.Login,
			&managerEntity.LastName,
			&managerEntity.FirstName,
			&managerEntity.Patronymic,
			&managerEntity.IsDisabled,
			&totalRows,
		); err != nil {
			return nil, nil, err
		}

		result = append(result, managerEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, nil, err
	}

	return result, &totalRows, nil
}

func (s *service) AddManager(manager app.PostManagerDto) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("INSERT INTO %s (manager_login, manager_password, manager_last_name, manager_first_name, manager_patronymic, is_disabled) VALUES ($1, $2, $3, $4, $5, $6) RETURNING %s", globalConstants.MANAGERS_TABLE, ENTITY_FIELDS)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(manager.Password), globalConstants.HASHING_COST)

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
		&managerEntity.Login,
		&managerEntity.LastName,
		&managerEntity.FirstName,
		&managerEntity.Patronymic,
		&managerEntity.IsDisabled,
	)

	if err != nil {
		if strings.Contains(err.Error(), errors.UNIQUE_CONSTRAINT_VIOLATION_SUBSTRING) {
			return nil, errors.Error409
		}

		return nil, err
	}

	return &managerEntity, nil
}

func (s *service) UpdateManager(manager app.UpdateManagerDto) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("UPDATE %s SET manager_login = $1, manager_password = $2, manager_last_name = $3, manager_first_name = $4, manager_patronymic = $5, is_disabled = $6 WHERE id = $7 RETURNING %s", globalConstants.MANAGERS_TABLE, ENTITY_FIELDS)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(manager.Password), globalConstants.HASHING_COST)

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
		&managerEntity.Login,
		&managerEntity.LastName,
		&managerEntity.FirstName,
		&managerEntity.Patronymic,
		&managerEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil && strings.Contains(err.Error(), errors.UNIQUE_CONSTRAINT_VIOLATION_SUBSTRING):
		return nil, errors.Error409
	case err != nil:
		return nil, err
	default:
		return &managerEntity, nil
	}
}

func (s *service) DeleteManager(id int) (*app.ManagerEntity, error) {
	var managerEntity app.ManagerEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", globalConstants.MANAGERS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&managerEntity.Id,
		&managerEntity.Login,
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
