package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Notification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	Content   string             `bson:"content" binding:"required,min=1"`
	UserID    string             `bson:"userId" binding:"required"`
	Link      string             `bson:"link"`
	Brand     string             `bson:"brand" binding:"required"`
	CreatedAT time.Time          `bson:"createdAt"`
}
