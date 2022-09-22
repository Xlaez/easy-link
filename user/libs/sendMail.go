package libs

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"net/smtp"
	"time"

	"github.com/Xlaez/easy-link/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
	// "google.golang.org/grpc/credentials/google"
)

var GmailService *gmail.Service
var EAuth smtp.Auth

// Uses Oauth

func getConfigs() (utils.Config, error) {
	c, err := utils.LoadConfig("../")

	if err != nil {
		return utils.Config{}, err
	}
	return c, nil
}

func InitMailService() error {
	c, err := getConfigs()

	if err != nil {
		log.Fatal(err)
	}

	config := oauth2.Config{
		ClientID:     c.OauthClientId,
		ClientSecret: c.OauthClientSecret,
		Endpoint:     google.Endpoint,
		RedirectURL:  "http://localhost:8585/user/profile",
	}

	token := oauth2.Token{
		AccessToken:  c.OauthAccessToken,
		RefreshToken: c.OauthRefreshToken,
		TokenType:    "Bearer",
		Expiry:       time.Now(),
	}

	var tokenSource = config.TokenSource(context.Background(), &token)

	srv, err := gmail.NewService(context.Background(), option.WithTokenSource(tokenSource))

	if err != nil {
		return err
	}

	GmailService = srv

	if GmailService == nil {
		return errors.New("email service can't initialize")
	}
	return nil
}

func SendMailWithOauth(to string, data interface{}, template string, suject string) (bool, error) {
	emailBody, err := parseTemplate(template, data)

	if err != nil {
		return false, errors.New("cannot parse template")
	}

	var message gmail.Message

	emailTo := "To: " + to + "\r\n"
	subject := "Subject: " + suject + "\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/plain; charset=\"UTF-8\";\n\n"
	msg := []byte(emailTo + subject + mime + "\n" + emailBody)

	message.Raw = base64.URLEncoding.EncodeToString(msg)

	_, err = GmailService.Users.Messages.Send("me", &message).Do()

	if err != nil {
		return false, err
	}
	return true, nil
}

func SendMailWitSmtp(to []string, data interface{}, template string, subject string) (bool, error) {
	c, err := getConfigs()

	if err != nil {
		return false, err
	}
	eHost := "smtp.gmail.com"
	eFrom := c.AppMail
	ePassword := c.AppPassword
	ePort := "587"

	EAuth = smtp.PlainAuth("", eFrom, ePassword, eHost)

	eBody, err := parseTemplate(template, data)

	if err != nil {
		return false, errors.New("cannot parse template")
	}

	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	msg := []byte(subject + mime + "\n" + eBody)
	add := fmt.Sprintf("%s:%s", eHost, ePort)

	if err := smtp.SendMail(add, EAuth, eFrom, to, msg); err != nil {
		return false, err
	}
	return true, nil
}

type EmailRequest struct {
	from    string
	to      []string
	subject string
	body    string
}

func NewEmailRequest(to []string, subject, body string) *EmailRequest {
	return &EmailRequest{
		to:      to,
		subject: subject,
		body:    body,
	}
}
