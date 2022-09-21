package src

import (
	"database/sql"
	"time"

	"github.com/gin-gonic/gin"
)

func errorRes(err error) gin.H {
	return gin.H{"Error: ": err.Error()}
}

type CreateUserRequest struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Field      string `json:"field" binding:"required"`
	FieldTitle string `json:"fieldTitle" binding:"required"`
	AccType    string `json:"accType"  binding:"required"`
	Password   string `json:"password"  binding:"required,min=6,alphanum"`
}

type GetUserRes struct {
	Name       string         `json:"name"`
	Email      string         `json:"email"`
	Field      string         `json:"field"`
	FieldTitle string         `json:"fieldTitle"`
	Bio        sql.NullString `json:"bio"`
	INLink     sql.NullString `json:"ln_link"`
	AvatarUrl  sql.NullString `json:"avatar_url"`
	AvatarID   sql.NullString `json:"avatar_id"`
	WbLink     sql.NullString `json:"wb_link"`
	GbLink     sql.NullString `json:"gb_link"`
	Active     bool           `json:"active"`
	CreatedAt  time.Time      `json:"created_at"`
}

type GetUserRequest struct {
	ID string `uri:"id" biniding:"required"`
}

type GetUsersRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=1"`
}

type GetUserResponse struct {
	Msg string `json:"msg"`
	Id  string `json:"id"`
}

type LoginUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,alphanum"`
}

type UpdateBioRequest struct {
	Bio       string    `json:"bio" binding:"required,min=20"`
	UpdatedAT time.Time `json:"updated_at"`
}

type UploadAvatarReq struct {
	ID string `form:"id" binding:"required"`
}

type DeleteAccountReq struct {
	Password string `json:"password" binding:"required,min=7"`
}

type UpdatePasswordReq struct {
	Email string `json:"email" binding:"required"`
	// Password string `json:"password" binding:"required"`
}

type DigitsReq struct {
	Digits   string `json:"digits"`
	Password string `json:"password" binding:"required,min=7"`
}

type UpdateOtherReq struct {
	InLink string `json:"inLink"`
	TwLink string `json:"twLink"`
	WbLink string `json:"wbLink"`
	GbLink string `json:"gbLink"`
}

type SetActivityReq struct {
	Active bool `form:"active"`
}

type ValidateAccountReq struct {
	Token string `uri:"token" biniding:"required"`
}
