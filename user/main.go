package main

import (
	"database/sql"
	"log"

	db "github.com/Xlaez/easy-link/db/sqlc"
	// "github.com/Xlaez/easy-link/messaging"
	"github.com/Xlaez/easy-link/src"
	"github.com/Xlaez/easy-link/utils"
	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

var (
	conn *amqp.Connection
	ch   *amqp.Channel
	// repo messaging.Repo
)

func main() {
	config, err := utils.LoadConfig(".")

	if err != nil {
		log.Fatal("Error: cannot load env", err)
	}
	connectMsgQueue(config)
	connectDB(config)
	// initLayers(config)
}

func connectDB(config utils.Config) {

	conn, err := sql.Open(config.DbDriver, config.DbSource)

	if err != nil {
		log.Fatal("Error: cannot open sql databse", err)
	}

	store := db.NewStore(conn)

	server, err := src.NewServer(store, config, ch)

	if err != nil {
		log.Fatal("Error: cannot initialize server ", err)
	}

	if err = server.Start(config.ServerAddress); err != nil {
		log.Fatal("Error: cannot connect server", err)
	}
}

func connectMsgQueue(config utils.Config) {
	var err error

	conn, err = amqp.Dial(config.AmpUrl)

	if err != nil {
		log.Fatal("Failed to connect to RabbitMq cluster: ", err)
	}

	ch, err = conn.Channel()
	if err != nil {
		log.Fatal("Failed to create RabbitMQ channel", err)
	}
}

// func initLayers(config utils.Config) {

// 	repo = messaging.NewRepository(ch)
// }
