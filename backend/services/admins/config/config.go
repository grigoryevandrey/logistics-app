package config

import (
	"github.com/spf13/viper"
)

func Init() {
	viper.AutomaticEnv()

	viper.SetDefault("PG_CONNECTION_STRING", "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable")
	viper.SetDefault("ADMINS_HOST", "0.0.0.0")
	viper.SetDefault("ADMINS_PORT", "3004")
}
