package src

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/Xlaez/easy-link/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

const JWTTokenURL = "https://oauth2.googleapis.com/token"
const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

func config() (utils.Config, error) {
	c, err := utils.LoadConfig(".")

	if err != nil {
		return utils.Config{}, err
	}

	return c, nil
}

func configFunc() utils.Config {
	c, err := config()

	if err != nil {
		log.Fatal("Cannot load env", err)
	}
	return c
}

var OauthClientId = configFunc().OauthClientId
var OauthClientSecret = configFunc().OauthClientSecret

var googleOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:8585/api/v1/auth/google/callback",
	ClientID:     OauthClientId,
	ClientSecret: OauthClientSecret,
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

func (s *Server) oauthGoogleLogin(ctx *gin.Context) {
	oauthstate := generateStateGoogleOauthCookie(ctx)

	u := googleOauthConfig.AuthCodeURL(oauthstate)
	ctx.Redirect(ctx.Request.ProtoMajor, u)
}

func (s *Server) googleOauthcallback(ctx *gin.Context) {
	oauthstate, _ := ctx.Cookie("oauthstate")
	if ctx.Request.FormValue("state") != oauthstate {
		ctx.JSON(http.StatusBadRequest, errorRes(errors.New("invalid oauth google state")))
		return
	}

	data, err := getUserDataFromGoogle(ctx.Request.FormValue("code"), ctx)

	if err != nil {
		log.Println(err.Error())
		ctx.Redirect(ctx.Request.ProtoMajor, "/")
		return
	}

	fmt.Println(data)
}

func getUserDataFromGoogle(code string, ctx *gin.Context) ([]byte, error) {
	token, err := googleOauthConfig.Exchange(ctx, code)

	if err != nil {
		return nil, fmt.Errorf("code exchange wrong: %s", err.Error())
	}

	response, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}
	defer response.Body.Close()

	contents, err := ioutil.ReadAll(response.Body)

	if err != nil {
		return nil, fmt.Errorf("failed read response: %s", err.Error())
	}
	return contents, nil
}

func generateStateGoogleOauthCookie(ctx *gin.Context) string {
	var expiration = time.Now().Add(365 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)

	state := base64.URLEncoding.EncodeToString(b)

	ctx.SetCookie("oauthstate", state, expiration.Second(), "/", "localhost", false, true)
	return state
}
