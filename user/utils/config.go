package utils

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	DbDriver            string        `mapstructure:"DB_DRIVER"`
	DbSource            string        `mapstructure:"DB_SOURCE"`
	ServerAddress       string        `mapstructure:"SERVER_ADDRESS"`
	TokenSymmetricKey   string        `mapstructure:"TOKEN_KEY"`
	AccessTokenDuration time.Duration `mapstructure:"ACCESS_TOKEN_DURATION"`
	CloudinaryEnv       string        `mapstructure:"CLOUDINARY_API_ENV"`
	OauthAccessToken    string        `mapstructure:"OAUTH_ACCESS_TOKEN"`
	OauthRefreshToken   string        `mapstructure:"OAUTH_REFRESH_TOKEN"`
	OauthClientId       string        `mapstructure:"OAUTH_CLIENT_ID"`
	OauthClientSecret   string        `mapstructure:"OAUTH_CLIENT_SECRET"`
	AppMail             string        `mapstructure:"APP_MAIL"`
	AppPassword         string        `mapstructure:"APP_PASS"`
	AmpUrl              string        `mapstructure:"AMP_URL"`
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
