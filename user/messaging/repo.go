package messaging

import (
	"encoding/json"

	"github.com/Xlaez/easy-link/db"
	"github.com/streadway/amqp"
)

const (
	GetQueue    = "publisher.get"
	CreateQueue = "publisher.create"
	UpdateQueue = "publisher.update"
	DeleteQueue = "publisher.delete"
)

func SendNotification(request db.Notification, ch *amqp.Channel) error {
	q := createQueues(CreateQueue, ch)

	body, err := json.Marshal(request)

	if err != nil {
		return err
	}

	msg := amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
	}

	publishMessage(ch, q.Name, msg)

	return nil
}

func GetUser(request db.GetUser, ch *amqp.Channel) error {
	q := createQueues("get-user", ch)

	body, err := json.Marshal(request)

	if err != nil {
		return err
	}

	msg := amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
	}

	publishMessage(ch, q.Name, msg)

	return nil
}

func createQueues(name string, ch *amqp.Channel) amqp.Queue {
	return NewQueue(name, ch).CreateQueue()
}

// Default exchange
func publishMessage(ch *amqp.Channel, name string, msg amqp.Publishing) {
	ch.Publish("", name, false, false, msg)
}
