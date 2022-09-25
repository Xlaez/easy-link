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
		Name:        user.Name,
		Email:       user.Email,
		Field:       user.Field,
		FieldTitle:  user.FieldTitle,
		Bio:         user.Bio,
		INLink:      user.InLink,
		AvatarUrl:   user.AvatarUrl,
		AvatarID:    user.AvatarID,
		WbLink:      user.WbLink,
		GbLink:      user.GbLink,
		Active:      user.Active,
		Country:     user.Country,
		Connections: user.Connections,
		CreatedAt:   user.CreatedAt,
	}

	n := dbn.Notification{
		Content: "content",
		UserID:  "fff",
		Link:    "kkkk",
		Brand:   "kkkkk",
	}

	// err = s.repo.SendNotification(n)type
	err = messaging.SendNotification(n, s.ch)

	if err != nil {
		ctx.JSON(http.StatusBadGateway, errorRes(err))
		return
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
		Valid:  true,
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
		Valid:  true,
	}

	url := sql.NullString{
		String: su,
		Valid:  true,
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

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})
}

func (s *Server) UpdateOther(ctx *gin.Context) {
	var req UpdateOtherReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	uid := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	id := uid.ID

	lk := sql.NullString{
		String: req.InLink,
		Valid:  true,
	}
	wl := sql.NullString{
		String: req.WbLink,
		Valid:  true,
	}
	gl := sql.NullString{
		String: req.GbLink,
		Valid:  true,
	}
	tl := sql.NullString{
		String: req.GbLink,
		Valid:  true,
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

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})
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

func (s *Server) ChangeActiveStatus(ctx *gin.Context) {
	var req SetActivityReq

	if err := ctx.BindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	uid := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	if err := s.store.SetActivity(ctx, db.SetActivityParams{
		ID:     uid.ID,
		Active: req.Active,
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "updated"})
}

func (s *Server) SendReq(ctx *gin.Context) {
	var req SendConnectionRequestReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	arg := db.SendReqParams{
		UserFrom: authPayload.ID,
		UserTo:   uuid.MustParse(req.UserTo),
	}

	if err := s.store.SendReq(ctx, arg); err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorRes(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	// send notofication

	ctx.JSON(http.StatusOK, gin.H{"msg": "sent"})
}

func (s *Server) GetUserRequests(ctx *gin.Context) {
	var req GetConnectionRequestReq

	if err := ctx.BindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	requests, err := s.store.GetAllUserReq(ctx, db.GetAllUserReqParams{
		UserTo: authPayload.ID,
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	})

	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errors.New("not found"))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, requests)
}

type GetAUserReq struct {
	ID string `uri:"id" binding:"required"`
}

func (s *Server) GetAUserReq(ctx *gin.Context) {
	var req GetAUserReq

	if err := ctx.BindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	uid := uuid.MustParse(req.ID)

	request, err := s.store.GetReq(ctx, uid)

	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errors.New("not found"))
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, request)
}

func (s *Server) RejectConnectionRequest(ctx *gin.Context) {
	var req GetAUserReq

	if err := ctx.BindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	uid := uuid.MustParse(req.ID)

	if err := s.store.DeleteReq(ctx, uid); err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorRes(errors.New("not found")))
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "deleted"})
}

func (s *Server) AcceptConnection(ctx *gin.Context) {
	var req AddConnectionReq

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	_, err := s.store.ConnectionTx(ctx, db.ConnectionTxParams{
		UserTo:    authPayload.ID,
		UserFrom:  req.UserId,
		RequestID: req.RequestID,
	})

	if err != nil {
		ctx.JSON(http.StatusConflict, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "successful"})
}

func (s *Server) GetUserConnections(ctx *gin.Context) {
	var req GetUserConns

	if err := ctx.BindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	conns, err := s.store.GetAllUserConnections(ctx, db.GetAllUserConnectionsParams{
		User1:  authPayload.ID,
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	})

	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errors.New("not found"))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, conns)
}

func (s *Server) GetSentRequests(ctx *gin.Context) {
	var req GetUserConns

	if err := ctx.BindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	r, err := s.store.GetAllSentReq(ctx, db.GetAllSentReqParams{
		UserFrom: authPayload.ID,
		Limit:    req.PageID,
		Offset:   (req.PageSize - 1) * req.PageID,
	})

	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errors.New("not found"))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, r)
}

func (s *Server) UnConnectUser(ctx *gin.Context) {
	var req UnConnect

	if err := ctx.BindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorRes(err))
		return
	}

	if err := s.store.DeleteConnection(ctx, uuid.MustParse(req.Id)); err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusInternalServerError, errors.New("not found"))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*auth.Payload)

	if err := s.store.UpdateConnectionTotal(ctx, db.UpdateConnectionTotalParams{
		ID:          authPayload.ID,
		Connections: -1,
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorRes(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"msg": "connection removed"})
}
