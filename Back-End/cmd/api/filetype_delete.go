package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type deleteFileTypeBody struct {
	FileTypeID int `json:"fileTypeID"`
}

// Route for deleting a file type.
func (app *application) deleteFileType(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body deleteFileTypeBody
	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		err = errors.Wrap(err, "json deserialization")
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
		return
	}

	conn, err := getWriteTx(r)
	if err != nil {
		err = errors.Wrap(err, "getWriteTx")
		app.errorResponse(w, r, http.StatusInternalServerError, err.Error())
		return
	}

	err = data.DeleteFileType(conn, body.FileTypeID)
	if err != nil {
		err = errors.Wrap(err, "DeleteFileType")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"success": true}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
