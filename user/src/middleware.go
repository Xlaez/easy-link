package src

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/Xlaez/easy-link/token/auth"
	"github.com/gin-gonic/gin"
)

const (
	authorixationHeaderKey  = "Authorization"
	authorizationPayloadKey = "Authorization_payload"
)

func authMiddleware(tokenMaker auth.Maker) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorixationHeader := ctx.GetHeader(authorixationHeaderKey)
		if len(authorixationHeader) == 0 {
			err := errors.New("provide an authorization header")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorRes(err))
			return
		}

		fields := strings.Fields(authorixationHeader)
		if len(fields) < 2 {
			err := errors.New("invalid authorization header format")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorRes(err))
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != "bearer" {
			err := fmt.Errorf("unsupported authorization type %s", authorizationType)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorRes(err))
			return
		}

		accessToken := fields[1]

		payload, err := tokenMaker.VerifyToken(accessToken)

		if err != nil {

			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorRes(err))
			return
		}

		// store payload to context
		ctx.Set(authorizationPayloadKey, payload)
		ctx.Next()
	}
}
