package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/data"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

type editDocTypeBody struct {
	DocTypeID int                `json:"docTypeID"`
	Name      string             `json:"name"`
	Status    data.DocTypeStatus `json:"status"`
}

// Route for editing a doc type.
func (app *application) editDocType(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var body editDocTypeBody
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

	docType := data.DocType{
		Name:   body.Name,
		Status: body.Status,
	}
	err = data.EditDocType(conn, body.DocTypeID, &docType)
	if err != nil {
		err = errors.Wrap(err, "EditDocType")
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
