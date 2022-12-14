package auth

import (
	_ "go/token"
	"time"

	"github.com/google/uuid"
)

// Is an interface for managing tokens
type Maker interface {
	// CreateToken creates a new token for a specific name and duration
	CreateToken(name string, email string, country string, id uuid.UUID, duration time.Duration) (string, error)

	// VerifyToken checks if the token is valid or not
	VerifyToken(token string) (*Payload, error)
}
