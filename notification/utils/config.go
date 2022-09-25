package utils

import (
	"github.com/spf13/viper"
)

type Config struct {
	MongoDbUri    string `mapstructure:"MONGO_DB_URI"`
	ServerAddress string `mapstructure:"SERVER_ADDRESS"`
	Collection    string `mapstructure:"COLLECTION"`
	AmpUrl        string `mapstructure:"AMP_URL"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {

		return
	}

	err = viper.Unmarshal(&config)
	return
}
