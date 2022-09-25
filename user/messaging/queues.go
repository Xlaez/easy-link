package messaging

import (
	log "github.com/sirupsen/logrus"
	"github.com/streadway/amqp"
)

type Queue interface {
	CreateQueue() amqp.Queue
}

type queue struct {
	ch   *amqp.Channel
	name string
}

func NewQueue(name string, ch *amqp.Channel) Queue {
	return &queue{
		name: name,
		ch:   ch,
	}
}

func (q queue) CreateQueue() amqp.Queue {
	qu, err := q.ch.QueueDeclare(q.name,
		false,
		false,
		false,
		false,
		nil)
	failOnError(err, "Failed to connect/create queue")
	return qu
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Error(msg)
		panic(err)
	}
}
