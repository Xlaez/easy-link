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
	authRoutes.POST("/forget-password", s.ForgetPassword)
	authRoutes.POST("/update-password", s.UpdatePassword)
	authRoutes.POST("/validate/:token", s.ValidateUser)

	router.GET("/api/v1/user/all", s.GetUsers)

	userRoutes.GET("/profile/:id", s.GetUser)
	userRoutes.PATCH("/bio", s.UpdateUserBio)
	userRoutes.DELETE("/account", s.DeleteAccount)
	userRoutes.PATCH("/others", s.UpdateOther)
	userRoutes.PUT("/avatar", s.UploadAvatar)
	userRoutes.POST("/update-email", s.UpdateEmailReq)
	userRoutes.PATCH("/change-email", s.ChangeEmail)
	userRoutes.PATCH("/activity", s.ChangeActiveStatus)

	s.router = router
}
