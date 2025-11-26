package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type createDocTemplateBody struct {
	DocTypeID int    `json:"docTypeID"`
	Name      string `json:"name"`
}

// Route for creating a doc template.
func (app *application) createDocTemplate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body createDocTemplateBody
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

	docTemplate := data.DocTemplate{
		DocTypeID: int32(body.DocTypeID),
		Name:      body.Name,
	}
	err = data.CreateDocTemplate(conn, &docTemplate)
	if err != nil {
		err = errors.Wrap(err, "CreateDocTemplate")
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
