package main

import (
	"database/sql"
	"log"

	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/Xlaez/easy-link/src"
	"github.com/Xlaez/easy-link/utils"
	_ "github.com/lib/pq"
)

func main() {
	config, err := utils.LoadConfig(".")

	if err != nil {
		log.Fatal("Error: cannot load env", err)
	}
	connectDB(config)
}

func connectDB(config utils.Config) {

	conn, err := sql.Open(config.DbDriver, config.DbSource)

	if err != nil {
		log.Fatal("Error: cannot open sql databse", err)
	}

	store := db.New(conn)

	server, err := src.NewServer(store, config)

	if err != nil {
		log.Fatal("Error: cannot initialize server ", err)
	}

	if err = server.Start(config.ServerAddress); err != nil {
		log.Fatal("Error: cannot connect server", err)
	}
}
