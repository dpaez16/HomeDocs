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
	router.GET("/api/users/login", app.nonAuthUsersMiddleware(app.loginUser))
	//router.POST("/api/users/register", app.nonAuthUsersMiddleware(app.createUser))
	//router.PATCH("/api/users/edit", app.authUsersMiddleware(app.editUser))

	return app.recoverPanic(app.enableCORS(router))
}
