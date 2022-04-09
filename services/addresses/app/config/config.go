package config

import (
	"github.com/spf13/viper"
)

var config *viper.Viper

func Init() {
	config = viper.New()

	viper.AutomaticEnv()

	viper.SetDefault("PG_CONNECTION_STRING", "postgresql://postgres:secret@0.0.0.0:5432/database?sslmode=disable")
	viper.SetDefault("APP_HOST", "0.0.0.0")
	viper.SetDefault("APP_PORT", "3000")
}
