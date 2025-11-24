package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.GET("/api/ping", app.pingCheckHandler)

	// route for login session verification
	router.GET("/api/handshake", app.authUsersMiddleware(app.handshakeHandler))

	// user routes
	router.POST("/api/users/login", app.nonAuthUsersMiddleware(app.loginUser))
	router.GET("/api/users", app.authUsersMiddleware(app.queryUsers))
	//router.POST("/api/users/create", app.nonAuthUsersMiddleware(app.createUser))
	//router.PATCH("/api/users/edit", app.authUsersMiddleware(app.editUser))

	// filetype routes
	router.GET("/api/filetypes", app.authUsersMiddleware(app.queryFileTypes))
	router.POST("/api/filetypes/create", app.authUsersMiddleware(app.createFileType))
	router.PATCH("/api/filetypes/edit", app.authUsersMiddleware(app.editFileType))
	router.DELETE("/api/filetypes/delete", app.authUsersMiddleware(app.deleteFileType))

	return app.recoverPanic(app.enableCORS(router))
}
