package utils

import (
	"database/sql"
	"fmt"
	"math/rand"
	"strings"
	"time"
)

// generate a random uint64

const alp = "abcdefghijklmnopqrstuvwxyz"

func init() {
	rand.Seed(time.Now().UnixNano())
}

// generate random integer btw min and max

func RandomInt(min, max int64) int64 {
	return min + rand.Int63n(max-min+1)
}

func RandomField() string {
	random := []string{"tech", "business", "education"}

	r := len(random)

	return random[rand.Intn(r)]
}

// generates random string of length n
func RandomStr(n int) string {
	var sb strings.Builder

	k := len(alp)

	for i := 0; i < n; i++ {
		c := alp[rand.Intn(k)]
		sb.WriteByte(c)
	}

	return sb.String()
}

func RandomNullStr(n int) sql.NullString {
	var sb sql.NullString

	k := len(alp)

	for i := 0; i < n; i++ {
		c := alp[rand.Intn(k)]
		sb.Scan(c)
	}

	return sb
}

// generates a random user name
func RandomUser() string {
	return RandomStr(6)
}

// generates random email
func RandomEmail() string {
	return fmt.Sprintf("%s@gmail.com", RandomStr(6))
}
