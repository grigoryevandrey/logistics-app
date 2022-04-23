package config

import (
	"github.com/spf13/viper"
)

func Init() {
	viper.AutomaticEnv()

	viper.SetDefault("PG_CONNECTION_STRING", "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable")
	viper.SetDefault("DELIVERIES_HOST", "0.0.0.0")
	viper.SetDefault("DELIVERIES_PORT", "3005")
}
