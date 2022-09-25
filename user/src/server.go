package src

import (
	"fmt"

	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/streadway/amqp"

	// "github.com/Xlaez/easy-link/messaging"
	"github.com/Xlaez/easy-link/token/auth"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
)

type Server struct {
	store      *db.Store
	tokenMaker auth.Maker
	config     utils.Config
	router     *gin.Engine
	// repo       messaging.Repo
	ch *amqp.Channel
}

func NewServer(store *db.Store, config utils.Config, ch *amqp.Channel) (*Server, error) {
	tokenMaker, err := auth.NewPasteoMaker(config.TokenSymmetricKey)

	if err != nil {
		return nil, fmt.Errorf("cannot create the token maker: %w", err)
	}

	server := &Server{
		store:      store,
		tokenMaker: tokenMaker,
		config:     config,
		// repo:       repo,
		ch: ch,
	}

	server.Router()

	return server, nil
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
