package src

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Xlaez/easy-link/notification/models"
	"github.com/gin-gonic/gin"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository interface {
	// SendNotification() gin.HandlerFunc
	GetAllUserNotification() gin.HandlerFunc
	GetNotificationById() gin.HandlerFunc
	DeleteNotification() gin.HandlerFunc
	SetNotificationAsSeen() gin.HandlerFunc
}

type repository struct {
	collection *mongo.Collection
	ch         *amqp.Channel
}

func InitRepo(col *mongo.Collection, ch *amqp.Channel) Repository {
	return &repository{
		collection: col,
		ch:         ch,
	}
}

func SendNotification(ch *amqp.Channel, collection *mongo.Collection) {
	q, err := ch.QueueDeclare(
		"publisher.create",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		return
	}

	g := make(chan bool)

	go func() {
		for d := range msgs {
			notificationId := primitive.NewObjectID()

			var arg models.Notification

			if err := json.Unmarshal(d.Body, &arg); err != nil {
				fmt.Println(err)
				return
			}

			arg.ID = notificationId
			arg.CreatedAT = time.Now()
			arg.Seen = false
			_, err := collection.InsertOne(context.Background(), arg)

			if err != nil {
				fmt.Println(err)
				return
			}
		}
	}()
	<-g
}

type GetUserNotificationReq struct {
	UserID string `form:"userId" binding:"required"`
}

func (r *repository) GetAllUserNotification() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req GetUserNotificationReq

		if err := ctx.BindQuery(&req); err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{"msg": err})
			return
		}

		cursor, err := r.collection.Find(ctx, bson.M{
			"userId": req.UserID,
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": err})
			return
		}

		defer cursor.Close(ctx)
		var res []models.Notification

		if cursor.All(ctx, &res); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": err})
			return
		}

		ctx.JSON(http.StatusOK, res)
	}
}

type GetNotificationByIdReq struct {
	ID string `uri:"id" binding:"required"`
}

func (r *repository) GetNotificationById() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req GetNotificationByIdReq

		if err := ctx.BindUri(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"msg": err})
			return
		}

		id, err := primitive.ObjectIDFromHex(req.ID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": err})
			return
		}

		type NotificationRes struct {
			ID      primitive.ObjectID `bson:"_id"`
			Content string             `json:"content"`
			UserID  string             `json:"userId"`
			Link    string             `json:"link"`
			Brand   string             `json:"brand"`
			Seen    bool               `json:"seen"`

			CreatedAT time.Time `json:"createdAt"`
		}

		var arg NotificationRes

		if err = r.collection.FindOne(ctx, bson.M{
			"_id": id,
		}).Decode(&arg); err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"msg": err})
			return
		}

		ctx.JSON(http.StatusOK, arg)
	}
}

func (r *repository) DeleteNotification() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req GetNotificationByIdReq

		if err := ctx.BindUri(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"msg": err})
			return
		}

		id, err := primitive.ObjectIDFromHex(req.ID)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": err})
			return
		}

		_, err = r.collection.DeleteOne(ctx, bson.M{"_id": id})
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"msg": "resource not found"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"msg": "deleted"})
	}
}

type NotificationId struct {
	ID string `uri:"id" binding:"required"`
}

func (r *repository) SetNotificationAsSeen() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req NotificationId

		if err := ctx.BindUri(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"msg": err})
			return
		}

		result := r.collection.FindOneAndUpdate(ctx, bson.M{"_id": req.ID}, bson.M{"$set": bson.M{"seen": true}})

		if result.Err() != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": result.Err})
			return
		}

		doc := bson.M{}
		decorderErr := result.Decode(&doc)

		if decorderErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"msg": decorderErr})
			return
		}

		ctx.JSON(http.StatusOK, doc)
	}
}
