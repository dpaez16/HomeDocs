package main

import (
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

// Route for fetching associated file types.
func (app *application) queryAssociatedFileTypes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	if !r.URL.Query().Has("docTemplateID") {
		err := errors.New("unspecified doc template ID")
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
		return
	}

	docTemplateID, err := strconv.Atoi(r.URL.Query().Get("docTemplateID"))
	if err != nil {
		err = errors.Wrap(err, "strconv.Atoi")
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
		return
	}

	conn := getReadConnection(r)

	associatedFileTypes, err := data.GetAllAssociatedFileTypes(conn, docTemplateID)
	if err != nil {
		err = errors.Wrap(err, "GetAllAssociatedFileTypes")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"associatedfiletypes": associatedFileTypes}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
