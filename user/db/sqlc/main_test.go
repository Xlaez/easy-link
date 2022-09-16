package db

import (
	"database/sql"
	"log"
	"os"
	"testing"

	"github.com/Xlaez/easy-link/utils"
	_ "github.com/lib/pq"
)

var testQueries *Queries

// connect to database "postgres"

var testDB *sql.DB

func TestMain(m *testing.M) {
	var err error

	config, err := utils.LoadConfig("../..")

	if err != nil {

		log.Fatal("cannot load config", err)
	}

	testDB, err = sql.Open(config.DbDriver, config.DbSource)

	if err != nil {
		log.Fatal("go cannot connect to db ..... exiting:", err)
	}

	// note: New function is defined in db.go
	testQueries = New(testDB)

	os.Exit(m.Run())
}
