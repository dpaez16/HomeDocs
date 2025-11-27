package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type editAssociatedFileTypesBody struct {
	DocTemplateID int   `json:"docTemplateID"`
	FileTypeIDs   []int `json:"fileTypeIDs"`
}

// Route for editing associated file types for a doc template.
func (app *application) editAssociatedFileTypes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body editAssociatedFileTypesBody
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

	err = data.SetAssociatedFileTypes(conn, body.DocTemplateID, body.FileTypeIDs)
	if err != nil {
		err = errors.Wrap(err, "SetAssociatedFileTypes")
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
