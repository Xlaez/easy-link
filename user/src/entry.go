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

	authRoutes.POST("/signup", s.CreateUser)              // create new user
	authRoutes.POST("/signin", s.logInUser)               // signin to app
	authRoutes.POST("/forget-password", s.ForgetPassword) // apply for a new password
	authRoutes.POST("/update-password", s.UpdatePassword) // change password
	authRoutes.POST("/validate/:token", s.ValidateUser)   // validate user account
	// authRoutes.GET("/send", )

	router.GET("/api/v1/user/all", s.GetUsers) // get all users on app

	userRoutes.GET("/profile/:id", s.GetUser)                    // get a user's profile
	userRoutes.PATCH("/bio", s.UpdateUserBio)                    // update user bio
	userRoutes.DELETE("/account", s.DeleteAccount)               // delete user account
	userRoutes.PUT("/avatar", s.UploadAvatar)                    // upload an avatar
	userRoutes.POST("/update-email", s.UpdateEmailReq)           // apply for email update
	userRoutes.PATCH("/change-email", s.ChangeEmail)             // change email
	userRoutes.PATCH("/activity", s.ChangeActiveStatus)          // change active status
	userRoutes.POST("/send-request", s.SendReq)                  // send connection request
	userRoutes.GET("/connection-requests", s.GetUserRequests)    // get all users connection requests
	userRoutes.GET("/request/:id", s.GetAUserReq)                // get a particular connection request
	userRoutes.DELETE("/request/:id", s.RejectConnectionRequest) // reject a connection request
	userRoutes.POST("/accept-request", s.AcceptConnection)       //accept connection request
	userRoutes.GET("/connections", s.GetUserConnections)         // get all user's connections
	userRoutes.GET("/sent-requests", s.GetSentRequests)          // get all sent request
	userRoutes.DELETE("/un-connect/:id", s.UnConnectUser)        //unconnect a user

	s.router = router
}
