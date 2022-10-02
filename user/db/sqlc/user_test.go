package db

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"github.com/Xlaez/easy-link/utils"
	"github.com/stretchr/testify/require"
)

func createRandomUser(t *testing.T) User {
	hashedPassword, err := utils.HashPassword(utils.RandomStr(8))
	require.NoError(t, err)

	field := utils.RandomField()

	var field_title string

	switch field {
	case "business":
		field_title = "business analyst"
	case "tech":
		field_title = "web developer"
	case "education":
		field_title = "Administrative expert"
	}

	arg := CreateUserParams{
		Name:       utils.RandomUser(),
		Email:      utils.RandomEmail(),
		Field:      field,
		FieldTitle: field_title,
		AccType:    "login",
		Password:   hashedPassword,
	}

	user, err := testQueries.CreateUser(context.Background(), arg)
	require.NoError(t, err)

	require.NotEmpty(t, user)

	require.Equal(t, field, user.Field)
	require.Equal(t, hashedPassword, user.Password)

	require.NotZero(t, user.CreatedAt)
	require.NotZero(t, user.UpdatedAt)

	return user
}

func TestCreateUser(t *testing.T) {
	createRandomUser(t)
}

func TestGetUser(t *testing.T) {
	user1 := createRandomUser(t)

	user, err := testQueries.GetUser(context.Background(), user1.ID)

	require.NoError(t, err)
	require.NotEmpty(t, user)
	require.Equal(t, user.AccType, user1.AccType)
	require.Equal(t, user1.Email, user.Email)
	require.Equal(t, user1.CreatedAt, user.CreatedAt)
	require.Equal(t, user1.Password, user.Password)
	require.Equal(t, user1.FieldTitle, user.FieldTitle)
}

func TestUpdatedPassword(t *testing.T) {
	hashedPassword := utils.RandomStr(8)

	u := createRandomUser(t)

	user, err := testQueries.GetUser(context.Background(), u.ID)

	require.NoError(t, err)

	arg := UpdatePasswordParams{
		ID:       user.ID,
		Password: hashedPassword,
	}

	err = testQueries.UpdatePassword(context.Background(), arg)
	require.NoError(t, err)
	require.NotEqual(t, user.Password, hashedPassword)
}

func TestGetAllUsers(t *testing.T) {

	for i := 0; i < 5; i++ {
		createRandomUser(t)
	}

	users, err := testQueries.GetAllUsers(context.Background(), GetAllUsersParams{
		Limit:  5,
		Offset: 5,
	})

	require.NoError(t, err)

	for _, user := range users {
		require.NotEmpty(t, user)
		require.NotZero(t, user.CreatedAt)
	}
}

func TestUpdateEmail(t *testing.T) {
	user1 := createRandomUser(t)

	err := testQueries.UpdateEmail(context.Background(), UpdateEmailParams{
		ID:        user1.ID,
		Email:     utils.RandomEmail(),
		UpdatedAt: time.Now(),
	})

	require.NoError(t, err)
}

func TestUpdateBio(t *testing.T) {
	user1 := createRandomUser(t)
	var Bio sql.NullString = utils.RandomNullStr(50)

	err := testQueries.UpdateBio(context.Background(), UpdateBioParams{
		ID:        user1.ID,
		Bio:       Bio,
		UpdatedAt: time.Now(),
	})

	require.NoError(t, err)
}
