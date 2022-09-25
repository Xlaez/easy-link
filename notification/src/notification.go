package src

import (
	"context"
	"log"

	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository interface {
	notification()
}

type repository struct {
	collection *mongo.Collection
	ctx        context.Context
	ch         *amqp.Channel
}

func InitRepo(col *mongo.Collection, ctx context.Context, ch *amqp.Channel) Repository {
	return &repository{
		collection: col,
		ctx:        ctx,
		ch:         ch,
	}
}

func (r *repository) notification() {
	msgs, err := r.ch.Consume(
		"publisher.get",
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal("failed to comsume queue", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Panicf("Messages: %s", d.Body)
			d.Ack(true)
		}
	}()
	<-forever
}
