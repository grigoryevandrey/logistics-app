package config

import (
	"github.com/spf13/viper"
)

func Init() {
	viper.AutomaticEnv()

	viper.SetDefault("PG_CONNECTION_STRING", "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable")
	viper.SetDefault("AUTH_HOST", "0.0.0.0")
	viper.SetDefault("AUTH_PORT", "3006")
}
