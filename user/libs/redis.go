package libs

import "github.com/gomodule/redigo/redis"

func NewPool() *redis.Pool {
	return &redis.Pool{
		MaxIdle:         80,
		MaxActive:       1800,
		MaxConnLifetime: 30000,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", ":6379")

			if err != nil {
				panic(err.Error())
			}
			return c, err
		},
	}
}
