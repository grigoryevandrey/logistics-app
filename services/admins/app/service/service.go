package service

import (
	"database/sql"
	"fmt"
	"strings"

	globalConstants "github.com/grigoryevandrey/logistics-app/lib/constants"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
	"github.com/grigoryevandrey/logistics-app/services/admins/app"
	"golang.org/x/crypto/bcrypt"
)

const ENTITY_FIELDS = "id, admin_last_name, admin_first_name, admin_patronymic, admin_role, is_disabled"

type service struct {
	db *sql.DB
}

func New(db *sql.DB) app.Service {
	return &service{db: db}
}

func (s *service) GetAdmins(offset int, limit int, sort string) ([]app.AdminEntity, error) {
	var result []app.AdminEntity

	query := fmt.Sprintf(
		"SELECT %s FROM %s %s OFFSET %d LIMIT %d",
		ENTITY_FIELDS,
		globalConstants.ADMINS_TABLE,
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
		var adminEntity app.AdminEntity

		if err := rows.Scan(
			&adminEntity.Id,
			&adminEntity.LastName,
			&adminEntity.FirstName,
			&adminEntity.Patronymic,
			&adminEntity.Role,
			&adminEntity.IsDisabled,
		); err != nil {
			return nil, err
		}

		result = append(result, adminEntity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) AddAdmin(admin app.PostAdminDto) (*app.AdminEntity, error) {
	var adminEntity app.AdminEntity

	query := fmt.Sprintf(
		"INSERT INTO %s (admin_login, admin_password, admin_last_name, admin_first_name, admin_patronymic, admin_role, is_disabled) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING %s",
		globalConstants.ADMINS_TABLE,
		ENTITY_FIELDS,
	)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), globalConstants.HASHING_COST)

	if err != nil {
		return nil, err
	}

	err = s.db.QueryRow(
		query,
		admin.Login,
		hashedPassword,
		admin.LastName,
		admin.FirstName,
		admin.Patronymic,
		admin.Role,
		false,
	).Scan(
		&adminEntity.Id,
		&adminEntity.LastName,
		&adminEntity.FirstName,
		&adminEntity.Patronymic,
		&adminEntity.Role,
		&adminEntity.IsDisabled,
	)

	if err != nil {
		if strings.Contains(err.Error(), errors.UNIQUE_CONSTRAINT_VIOLATION_SUBSTRING) {
			return nil, errors.Error409
		}

		return nil, err
	}

	return &adminEntity, nil
}

func (s *service) UpdateAdmin(admin app.UpdateAdminDto) (*app.AdminEntity, error) {
	var adminEntity app.AdminEntity

	query := fmt.Sprintf("UPDATE %s SET admin_login = $1, admin_password = $2, admin_last_name = $3, admin_first_name = $4, admin_patronymic = $5, admin_role = $6, is_disabled = $7 WHERE id = $8 RETURNING %s", globalConstants.ADMINS_TABLE, ENTITY_FIELDS)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), globalConstants.HASHING_COST)

	if err != nil {
		return nil, err
	}

	err = s.db.QueryRow(
		query,
		admin.Login,
		hashedPassword,
		admin.LastName,
		admin.FirstName,
		admin.Patronymic,
		admin.Role,
		admin.IsDisabled,
		admin.Id,
	).Scan(
		&adminEntity.Id,
		&adminEntity.LastName,
		&adminEntity.FirstName,
		&adminEntity.Patronymic,
		&adminEntity.Role,
		&adminEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil && strings.Contains(err.Error(), errors.UNIQUE_CONSTRAINT_VIOLATION_SUBSTRING):
		return nil, errors.Error409
	case err != nil:
		return nil, err
	default:
		return &adminEntity, nil
	}
}

func (s *service) DeleteAdmin(id int) (*app.AdminEntity, error) {
	var adminEntity app.AdminEntity

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 RETURNING %s", globalConstants.ADMINS_TABLE, ENTITY_FIELDS)

	err := s.db.QueryRow(
		query,
		id,
	).Scan(
		&adminEntity.Id,
		&adminEntity.LastName,
		&adminEntity.FirstName,
		&adminEntity.Patronymic,
		&adminEntity.Role,
		&adminEntity.IsDisabled,
	)

	switch {
	case err == sql.ErrNoRows:
		return nil, errors.Error404
	case err != nil:
		return nil, err
	default:
		return &adminEntity, nil
	}
}
