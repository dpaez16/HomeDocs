package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type createFileTypeBody struct {
	Name      string `json:"name"`
	Editable  bool   `json:"editable"`
	Indexable bool   `json:"indexable"`
	Diffable  bool   `json:"diffable"`
	Extension string `json:"extension"`
}

// Route for creating a file type.
func (app *application) createFileType(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body createFileTypeBody
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

	fileType := data.FileType{
		Name:      body.Name,
		Editable:  body.Editable,
		Indexable: body.Indexable,
		Diffable:  body.Diffable,
		Extension: body.Extension,
	}
	err = data.CreateFileType(conn, &fileType)
	if err != nil {
		err = errors.Wrap(err, "CreateFileType")
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
