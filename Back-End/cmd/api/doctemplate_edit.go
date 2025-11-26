package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type editDocTemplateBody struct {
	DocTemplateID int                    `json:"docTemplateID"`
	DocTypeID     int                    `json:"docTypeID"`
	Name          string                 `json:"name"`
	Status        data.DocTemplateStatus `json:"status"`
}

// Route for editing a doc template.
func (app *application) editDocTemplate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body editDocTemplateBody
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
		Status:    body.Status,
	}
	err = data.EditDocTemplate(conn, body.DocTemplateID, &docTemplate)
	if err != nil {
		err = errors.Wrap(err, "EditDocTemplate")
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
