package src

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	dbn "github.com/Xlaez/easy-link/db"
	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/Xlaez/easy-link/libs"
	"github.com/Xlaez/easy-link/messaging"
	"github.com/Xlaez/easy-link/token/auth"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type EmailCheck struct {
	Email string `uri:"email" binding:"required"`
}

func (s *Server) CheckEmail(ctx *gin.Context) {
	var request EmailCheck

	if err := ctx.BindUri(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	_, err := s.store.IsEmailTaken(context.Background(), request.Email)

	if err != sql.ErrNoRows {
		var er error = errors.New("email taken")
		ctx.JSON(http.StatusBadRequest, errorRes(er))
		return
	}
	ctx.JSON(http.StatusAccepted, gin.H{"msg": "all fine"})
}

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
		Name:     request.Name,
		Email:    request.Email,
		Password: hashedPassword,
		AccType:  request.AccType,
		Country:  request.Country,
	}

	u, err := s.store.CreateUser(context.Background(), arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}
	token, err := createToken(s, arg.Name, arg.Email, u.ID, s.config)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	// Send Email to verify account

	type templateData struct {
		Name string
		Link string
	}

	link := fmt.Sprintf("localhost:8585/api/v1/auth/validate/%s", token)

	templatedata := templateData{
		Name: u.Name,
		Link: link,
	}

	ok, err := libs.SendMailWitSmtp([]string{u.Email}, templatedata, "signup.html", "Validate Account")

	if err != nil {
		ctx.JSON(http.StatusConflict, errorRes(err))
		return
	}

	result := GetUserResponse{
		Msg: "Created",
		Res: ok,
	}
	ctx.Header("Access-Control-Allow-Origin", "*")
	ctx.JSON(http.StatusCreated, result)
}

func (s *Server) ValidateUser(ctx *gin.Context) {
	var req ValidateAccountReq

	if err := ctx.BindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	user, err := s.tokenMaker.VerifyToken(req.Token)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	if err = s.store.Validate(ctx, db.ValidateParams{
		ID:    user.ID,
		Valid: true,
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	n := dbn.Notification{
		Content: "your account has been verified",
		UserID:  user.ID.String(),
		Link:    "https://",
		Brand:   "account",
	}

	_ = messaging.SendNotification(n, s.ch)

	ctx.JSON(http.StatusOK, gin.H{"msg": "accepted"})
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

	token, err := createToken(s, user.Name, user.Email, user.ID, s.config)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token, "id": user.ID})

}

func (s *Server) ForgetPassword(ctx *gin.Context) {
	var req UpdatePasswordReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	u, err := s.store.IsEmailTaken(ctx, req.Email)

	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errors.New("user does not exist"))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	randomInt := utils.RandomIntegers(6)
	_, err = libs.NewPool().Get().Do("SET", randomInt, req.Email)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	// send email
	type RestePasswordMail struct {
		Name   string
		Digits string
	}

	resetPasswordMail := RestePasswordMail{
		Name:   u.Name,
		Digits: randomInt,
	}

	_, err = libs.SendMailWitSmtp([]string{u.Email}, resetPasswordMail, "updatePassword.html", "Update Password")

	if err != nil {
		ctx.JSON(http.StatusConflict, errorRes(err))
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"digits": randomInt})
}

func (s *Server) UpdatePassword(ctx *gin.Context) {
	var req DigitsReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	e, err := redis.String(libs.NewPool().Get().Do("GET", req.Digits))

	if err != nil {
		ctx.JSON(http.StatusNotFound, errorRes(err))
		return
	}

	// remember to update this parts to query once
	u, err := s.store.IsEmailTaken(ctx, e)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	id := u.ID

	password, err := utils.HashPassword(req.Password)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	if err = s.store.UpdatePassword(ctx, db.UpdatePasswordParams{
		ID:       id,
		Password: password,
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	// send email

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})
}

type UpdateEmailReqParams struct {
	Password string `json:"password"`
}

func (s *Server) UpdateEmailReq(ctx *gin.Context) {
	var req UpdateEmailReqParams

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	id := authPayload.ID
	user, err := s.store.GetUser(ctx, id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	if err = utils.ComparePassword(req.Password, user.Password); err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			ctx.JSON(http.StatusForbidden, errorRes(errors.New("password does not match")))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	randomInt := utils.RandomIntegers(6)
	_, err = libs.NewPool().Get().Do("SET", randomInt, id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	type RestePasswordMail struct {
		Name   string
		Digits string
	}

	resetPasswordMail := RestePasswordMail{
		Name:   user.Name,
		Digits: randomInt,
	}

	_, err = libs.SendMailWitSmtp([]string{user.Email}, resetPasswordMail, "updateEmail.html", "Update EMail")

	if err != nil {
		ctx.JSON(http.StatusConflict, errorRes(err))
		return
	}

	n := dbn.Notification{
		Content: "email update request",
		UserID:  user.ID.String(),
		Link:    "https://",
		Brand:   "account",
	}

	_ = messaging.SendNotification(n, s.ch)

	ctx.JSON(http.StatusOK, gin.H{"digits": randomInt})
}

type ChangeEmailReq struct {
	Digits string `json:"digits" binding:"required,min=6,max=6"`
	Email  string `json:"email" binding:"required,email"`
}

func (s *Server) ChangeEmail(ctx *gin.Context) {
	var req ChangeEmailReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	id, err := redis.String(libs.NewPool().Get().Do("GET", req.Digits))

	if err != nil {
		ctx.JSON(http.StatusNotFound, errorRes(err))
		return
	}

	uid := uuid.MustParse(id)

	if err = s.store.UpdateEmail(ctx, db.UpdateEmailParams{
		ID:        uid,
		Email:     req.Email,
		UpdatedAt: time.Now(),
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})
}

func createToken(s *Server, name string, email string, id uuid.UUID, config utils.Config) (string, error) {
	accToken, err := s.tokenMaker.CreateToken(
		name,
		email,
		id,
		s.config.AccessTokenDuration,
	)

	if err != nil {
		return "", err
	}
	return accToken, nil
}
