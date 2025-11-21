package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal"
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type loginUserBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Route for user login.
func (app *application) loginUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body loginUserBody
	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		err = errors.Wrap(err, "json deserialization")
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
		return
	}

	conn := getReadConnection(r)

	user, err := data.FindUserByEmailAndPassword(conn, body.Email, body.Password)
	if err != nil {
		err = errors.Wrap(err, "FindUserByEmailAndPassword")
		app.serverErrorResponse(w, r, err)
		return
	}

	if user == nil {
		app.errorResponse(w, r, http.StatusBadRequest, "Email or password is invalid.")
		return
	}

	token, err := internal.CreateToken(strconv.Itoa(int(user.UserID)))
	if err != nil {
		err = errors.Wrap(err, "CreateToken")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"user": user, "jwt": token}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
