package main

import (
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

// Route for fetching a user's data.
func (app *application) queryUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	userID, err := strconv.Atoi(r.URL.Query().Get("userID"))

	if err != nil {
		err = errors.Wrap(err, "strconv.Atoi")
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
		return
	}

	conn := getReadConnection(r)
	filter := map[string]any{"userid": userID}

	user, err := data.FindOneUser(conn, filter)
	if err != nil {
		err = errors.Wrap(err, "FindOneUser")
		app.serverErrorResponse(w, r, err)
		return
	}

	if user == nil {
		app.errorResponse(w, r, http.StatusBadRequest, "Unable to find user.")
		return
	}

	data := jsondata{"user": user}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
