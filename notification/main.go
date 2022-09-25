package main

import (
	"context"
	"log"
	"os"

	"github.com/Xlaez/easy-link/notification/db"
	"github.com/Xlaez/easy-link/notification/src"
	"github.com/Xlaez/easy-link/notification/utils"
	"github.com/gin-gonic/gin"
	"github.com/streadway/amqp"
)

var (
	conn *amqp.Connection
	ctx  context.Context
	ch   *amqp.Channel
)

func loadConfig() (utils.Config, error) {
	return utils.LoadConfig(".")
}

func main() {

	config, err := loadConfig()

	if err != nil {
		log.Fatal("Could not load env", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = config.ServerAddress
	}

	router := gin.New()
	initializeLayers()

	router.Use(gin.Logger())

	// orgRoutes := router.Group("/kiama-org/api/v1/org")
	// memberRoutes := router.Group("/kiama-org/api/v1/member")
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Cannot start server, exiting......", err)
	}
	configMsgQueue(config)
}

func configMsgQueue(config utils.Config) {

	var err error
	conn, err = amqp.Dial(config.AmpUrl)

	if err != nil {
		log.Fatal("Failed to commect to RabbitMQ", err)
	}

	ch, err = conn.Channel()

	if err != nil {
		log.Fatal("Failed to create RabbitMQ channel", err)
	}
}

func initializeLayers() {
	collection := db.CollectionData(db.Client, "notification")
	src.InitRepo(collection, ctx, ch)
}
