package main

import (
	"log"
	"os"

	"github.com/Xlaez/easy-link/notification/db"
	"github.com/Xlaez/easy-link/notification/src"
	"github.com/Xlaez/easy-link/notification/utils"
	"github.com/gin-gonic/gin"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	conn       *amqp.Connection
	ch         *amqp.Channel
	controller src.Repository
	collection *mongo.Collection
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
	configMsgQueue(config)
	initializeLayers()

	router.Use(gin.Logger())

	router.POST("/send", controller.SendNotification())
	router.GET("/get", controller.GetAllUserNotification())
	router.GET("/get/:id", controller.GetNotificationById())
	router.DELETE("/delete/:id", controller.DeleteNotification())
	router.PATCH("/seen/:id", controller.SetNotificationAsSeen())

	err = router.Run(":" + port)

	if err != nil {
		log.Fatal("Cannot start server, exiting......", err)
	}
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
	collection = db.CollectionData(db.Client, "notification")
	controller = src.InitRepo(collection, ch)
}
