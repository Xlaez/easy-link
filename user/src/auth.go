package src

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (s *Server) CreateUser(ctx *gin.Context) {
	var request CreateUserRequest

	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	hashedPassword, err := utils.HashPassword(request.Password)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	_, err = s.store.IsEmailTaken(context.Background(), request.Email)

	if err != sql.ErrNoRows {
		var er error = errors.New("it seems you already have an account with us")
		ctx.JSON(http.StatusBadRequest, errorRes(er))
		return
	}

	if len(request.Password) < 7 {
		var new_Err = "password should be at least 7 characters"
		ctx.JSON(http.StatusBadRequest, errorRes(errors.New(new_Err)))
	}

	arg := db.CreateUserParams{
		Name:       request.Name,
		Email:      request.Email,
		Field:      request.Field,
		FieldTitle: request.FieldTitle,
		Password:   hashedPassword,
		AccType:    request.AccType,
	}

	token, err := createToken(s, arg.Email, s.config)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	_, err = s.store.CreateUser(context.Background(), arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	// Send Email to verify account

	result := GetUserResponse{
		Msg: "Created",
		Id:  token,
	}

	ctx.JSON(http.StatusCreated, result)
}

func (s *Server) logInUser(ctx *gin.Context) {
	var req LoginUserRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	user, err := s.store.IsEmailTaken(context.Background(), req.Email)

	if err != nil {
		if err == sql.ErrNoRows {
			var new_err error = errors.New("user does not exist")
			ctx.JSON(http.StatusBadRequest, errorRes(new_err))
			return
		}
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	if err = utils.ComparePassword(req.Password, user.Password); err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			new_err := errors.New("user details doesn't match")
			ctx.JSON(http.StatusBadRequest, errorRes(new_err))
			return
		}
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	token, err := createToken(s, user.Email, s.config)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token, "id": user.ID})

}

func createToken(s *Server, email string, config utils.Config) (string, error) {
	accToken, err := s.tokenMaker.CreateToken(
		email,
		s.config.AccessTokenDuration,
	)

	if err != nil {
		return "", err
	}
	return accToken, nil
}
