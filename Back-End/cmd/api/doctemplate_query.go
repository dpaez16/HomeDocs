package main

import (
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

// Route for fetching doc templates.
func (app *application) queryDocTemplates(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	isBulkRequest := !r.URL.Query().Has("docTemplateID")
	conn := getReadConnection(r)

	if !isBulkRequest {
		docTemplateID, err := strconv.Atoi(r.URL.Query().Get("docTemplateID"))
		if err != nil {
			err = errors.Wrap(err, "strconv.Atoi")
			app.errorResponse(w, r, http.StatusBadRequest, err.Error())
			return
		}

		filter := map[string]any{"doctemplateid": docTemplateID}
		docTemplate, err := data.FindOneDocTemplate(conn, filter)

		if err != nil {
			err = errors.Wrap(err, "FindOneDocTemplate")
			app.serverErrorResponse(w, r, err)
			return
		}

		if docTemplate == nil {
			app.errorResponse(w, r, http.StatusBadRequest, "Unable to find doc template.")
			return
		}

		data := jsondata{"doctemplate": docTemplate}
		err = app.writeJSON(w, http.StatusOK, data, nil)
		if err != nil {
			err = errors.Wrap(err, "writeJSON")
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	docTemplates, err := data.GetAllDocTemplates(conn)
	if err != nil {
		err = errors.Wrap(err, "GetAllDocTemplates")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"doctemplates": docTemplates}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
