package main

import (
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

// Route for fetching doc types.
func (app *application) queryDocTypes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	isBulkRequest := !r.URL.Query().Has("docTypeID")
	conn := getReadConnection(r)

	if !isBulkRequest {
		fileTypeID, err := strconv.Atoi(r.URL.Query().Get("docTypeID"))
		if err != nil {
			err = errors.Wrap(err, "strconv.Atoi")
			app.errorResponse(w, r, http.StatusBadRequest, err.Error())
			return
		}

		filter := map[string]any{"doctypeid": fileTypeID}
		docType, err := data.FindOneDocType(conn, filter)

		if err != nil {
			err = errors.Wrap(err, "FindOneDocType")
			app.serverErrorResponse(w, r, err)
			return
		}

		if docType == nil {
			app.errorResponse(w, r, http.StatusBadRequest, "Unable to find doc type.")
			return
		}

		data := jsondata{"doctype": docType}
		err = app.writeJSON(w, http.StatusOK, data, nil)
		if err != nil {
			err = errors.Wrap(err, "writeJSON")
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	docTypes, err := data.GetAllDocTypes(conn)
	if err != nil {
		err = errors.Wrap(err, "GetAllDocTypes")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"doctypes": docTypes}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
