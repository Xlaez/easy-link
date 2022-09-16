package src

import (
	"fmt"

	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/Xlaez/easy-link/token/auth"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
)

type Server struct {
	store      *db.Queries
	tokenMaker auth.Maker
	config     utils.Config
	router     *gin.Engine
}

func NewServer(store *db.Queries, config utils.Config) (*Server, error) {
	tokenMaker, err := auth.NewPasteoMaker(config.TokenSymmetricKey)

	if err != nil {
		return nil, fmt.Errorf("cannot create the token maker: %w", err)
	}

	server := &Server{
		store:      store,
		tokenMaker: tokenMaker,
		config:     config,
	}

	server.Router()

	return server, nil
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
