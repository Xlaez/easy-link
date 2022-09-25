package db

import (
	"context"
	"log"
	"time"

	"github.com/Xlaez/easy-link/notification/utils"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	notificationCol *mongo.Collection
)

func DBSetup() *mongo.Client {
	config, err := utils.LoadConfig(".")

	if err != nil {
		log.Fatal("An error occured while loading env", err)
	}

	client, err := mongo.NewClient(options.Client().ApplyURI(config.MongoDbUri))

	if err != nil {
		log.Fatal("An error occured while connecting to db", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	err = client.Connect(ctx)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("unable to connect to db", err)
		return nil
	}

	return client
}

var Client *mongo.Client = DBSetup()

func CollectionData(client *mongo.Client, collectionName string) *mongo.Collection {
	notificationCol = client.Database("Connect").Collection(collectionName)
	return notificationCol
}
