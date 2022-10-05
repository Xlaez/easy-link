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
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	AccType  string `json:"accType"  binding:"required"`
	Password string `json:"password"  binding:"required,min=6,alphanum"`
	Country  string `json:"country" binding:"required"`
}

type UpdateUserField struct {
	Field      string `json:"field" binding:"required"`
	FieldTitle string `json:"fieldTitle" binding:"required"`
}

type GetUserRes struct {
	Name        string         `json:"name"`
	Email       string         `json:"email"`
	Field       string         `json:"field"`
	FieldTitle  string         `json:"fieldTitle"`
	Bio         sql.NullString `json:"bio"`
	AvatarUrl   sql.NullString `json:"avatar_url"`
	AvatarID    sql.NullString `json:"avatar_id"`
	Active      bool           `json:"active"`
	Country     string         `json:"country"`
	Connections int32          `json:"connections"`
	CreatedAt   time.Time      `json:"created_at"`
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
	Res bool   `json:"res"`
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

type SetActivityReq struct {
	Active bool `form:"active"`
}

type ValidateAccountReq struct {
	Token string `uri:"token" biniding:"required"`
}

type SendConnectionRequestReq struct {
	UserTo string `json:"userTo" binding:"required"`
}

type GetConnectionRequestReq struct {
	PageID   int32 `form:"pageId" binding:"required"`
	PageSize int32 `form:"pageSize" binding:"required"`
}

type AddConnectionReq struct {
	UserId    string `json:"userId" binding:"required"`
	RequestID string `json:"requestId" binding:"required"`
}

type GetUserConns struct {
	PageID   int32 `form:"pageId" binding:"required,min=1"`
	PageSize int32 `form:"pageSize" binidng:"required,min=1"`
}

type UnConnect struct {
	Id string `uri:"id" binding:"required"`
}

type UserConnectionsForPost struct {
	Id string `uri:"id"`
}
