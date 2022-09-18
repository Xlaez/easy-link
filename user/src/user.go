package src

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	db "github.com/Xlaez/easy-link/db/sqlc"
	"github.com/Xlaez/easy-link/libs"
	"github.com/Xlaez/easy-link/token/auth"
	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (s *Server) GetUser(ctx *gin.Context) {
	var req GetUserRequest

	if err := ctx.BindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	id := uuid.MustParse(req.ID)

	user, err := s.store.GetUser(context.Background(), id)

	if err != nil {
		if err == sql.ErrNoRows {
			er := errors.New("user not found")
			ctx.JSON(http.StatusNotFound, errorRes(er))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	u := GetUserRes{
		Name:       user.Name,
		Email:      user.Email,
		Field:      user.Field,
		FieldTitle: user.FieldTitle,
		Bio:        user.Bio,
		INLink:     user.InLink,
		AvatarUrl:  user.AvatarUrl,
		AvatarID:   user.AvatarID,
		WbLink:     user.WbLink,
		GbLink:     user.GbLink,
		Active:     user.Active,
		CreatedAt:  user.CreatedAt,
	}

	ctx.JSON(http.StatusOK, u)
}

func (s *Server) GetUsers(ctx *gin.Context) {
	var request GetUsersRequest

	if err := ctx.BindQuery(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	arg := db.GetAllUsersParams{
		Limit:  request.PageSize,
		Offset: (request.PageID - 1) * request.PageSize,
	}

	users, err := s.store.GetAllUsers(context.Background(), arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, users)
}

func (s *Server) UpdateUserBio(ctx *gin.Context) {
	var request UpdateBioRequest

	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	bio := sql.NullString{
		String: request.Bio,
	}

	arg := db.UpdateBioParams{
		ID:        authPayload.ID,
		Bio:       bio,
		UpdatedAt: time.Now(),
	}

	if err := s.store.UpdateBio(context.Background(), arg); err != nil {
		if err == sql.ErrNoRows {
			er := errors.New("user does not exits")
			ctx.JSON(http.StatusNotImplemented, errorRes(er))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})

}

func (s *Server) UploadAvatar(ctx *gin.Context) {
	var req UploadAvatarReq

	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	su, pu, e := libs.UploadToCloud(ctx)

	if e != nil {
		ctx.JSON(http.StatusConflict, errorRes(e))
		return
	}

	publicId := sql.NullString{
		String: pu,
	}

	url := sql.NullString{
		String: su,
	}

	id := uuid.MustParse(req.ID)

	err := s.store.UpdateAvatar(ctx, db.UpdateAvatarParams{
		ID:        id,
		AvatarUrl: url,
		AvatarID:  publicId,
		UpdatedAt: time.Now(),
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, "updated")
}

func (s *Server) UpdateOther(ctx *gin.Context) {
	var req UpdateOtherReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	id := uuid.MustParse(req.ID)
	lk := sql.NullString{
		String: req.InLink,
	}
	wl := sql.NullString{
		String: req.WbLink,
	}
	gl := sql.NullString{
		String: req.GbLink,
	}
	tl := sql.NullString{
		String: req.GbLink,
	}

	if err := s.store.UpdateOther(ctx, db.UpdateOtherParams{
		ID:        id,
		InLink:    lk,
		TwLink:    tl,
		WbLink:    wl,
		GbLink:    gl,
		UpdatedAt: time.Now(),
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, "updated")
}

func (s *Server) DeleteAccount(ctx *gin.Context) {
	var req DeleteAccountReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	payload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	user, err := s.store.GetUser(context.Background(), payload.ID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	if err = utils.ComparePassword(req.Password, user.Password); err != nil {
		ctx.JSON(http.StatusForbidden, errorRes(err))
		return
	}

	if err = s.store.DeleteUser(context.Background(), payload.ID); err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "deleted"})
}
