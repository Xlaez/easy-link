package auth

import (
	"fmt"
	"time"

	"github.com/aead/chacha20poly1305"
	"github.com/google/uuid"
	"github.com/o1egl/paseto"
)

type PasteoMaker struct {
	pasteo       *paseto.V2
	symmetricKey []byte
}

func NewPasteoMaker(symmetricKey string) (Maker, error) {
	if len(symmetricKey) != chacha20poly1305.KeySize {
		return nil, fmt.Errorf("invalid key size: must be exactly %d characters", chacha20poly1305.KeySize)
	}

	maker := &PasteoMaker{
		pasteo:       paseto.NewV2(),
		symmetricKey: []byte(symmetricKey),
	}

	return maker, nil
}

func (maker *PasteoMaker) CreateToken(username string, id uuid.UUID, duration time.Duration) (string, error) {
	payload, err := NewPayload(username, id, duration)
	if err != nil {
		return "", err
	}
	return maker.pasteo.Encrypt(maker.symmetricKey, payload, nil)
}

func (maker *PasteoMaker) VerifyToken(token string) (*Payload, error) {
	payload := &Payload{}
	err := maker.pasteo.Decrypt(token, maker.symmetricKey, payload, nil)
	if err != nil {
		return nil, ErrInvalidToken
	}

	err = payload.Valid()

	if err != nil {
		return nil, err
	}

	return payload, nil
}
