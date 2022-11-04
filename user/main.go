package main

import (
	"database/sql"
	"log"

	db "github.com/Xlaez/easy-link/db/sqlc"
	// "github.com/Xlaez/easy-link/messaging"

	"github.com/Xlaez/easy-link/src"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

var (
	conn *amqp.Connection
	ch   *amqp.Channel
	// repo messaging.Repo
)

var upgrader = websocket.Upgrader{
	//check origin will check the cross region source (note : please not using in production)
	// CheckOrigin: func(r *http.Request) bool {
	//Here we just allow the chrome extension client accessable (you should check this verify accourding your client source)
	// return origin == "chrome-extension://cbcbkhdmedgianpaifchdaddpnmgnknn"
	// },
}

func main() {
	config, err := utils.LoadConfig(".")

	if err != nil {
		log.Fatal("Error: cannot load env", err)
	}
	connectMsgQueue(config)
	// init sockets
	hub := src.NewHub()
	go hub.Run()

	//TODO: pass hub to server then make use of ServeWs function to handle websockets

	connectDB(config, hub)
	// initLayers(config)
}

func connectDB(config utils.Config, hub *src.Hub) {

	conn, err := sql.Open(config.DbDriver, config.DbSource)

	if err != nil {
		log.Fatal("Error: cannot open sql databse", err)
	}

	store := db.NewStore(conn)

	server, err := src.NewServer(store, config, ch, hub)

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
