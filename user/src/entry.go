package src

import "github.com/gin-gonic/gin"

const (
	authPath = "/api/v1/auth"
	userPath = "/api/v1/user"
	postPath = "/api/v1/post"
)

func (s *Server) Router() {
	router := gin.Default()

	authRoutes := router.Group(authPath)
	userRoutes := router.Group(userPath).Use(authMiddleware(s.tokenMaker))

	authRoutes.POST("/signup", s.CreateUser)
	authRoutes.POST("/signin", s.logInUser)

	userRoutes.GET("/profile/:id", s.GetUser)
	userRoutes.GET("/all", s.GetUsers)
	userRoutes.PATCH("/bio", s.UpdateUserBio)
	userRoutes.DELETE("/account", s.DeleteAccount)
	userRoutes.PATCH("/others", s.UpdateOther)
	userRoutes.PUT("/avatar", s.UploadAvatar)

	s.router = router
}
