package main

import (
	"homedocs-api/m/v2/internal/data"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

// Route for fetching file types.
func (app *application) queryFileTypes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	isBulkRequest := !r.URL.Query().Has("fileTypeID")
	conn := getReadConnection(r)

	if !isBulkRequest {
		fileTypeID, err := strconv.Atoi(r.URL.Query().Get("fileTypeID"))
		if err != nil {
			err = errors.Wrap(err, "strconv.Atoi")
			app.errorResponse(w, r, http.StatusBadRequest, err.Error())
			return
		}

		filter := map[string]any{"filetypeid": fileTypeID}
		fileType, err := data.FindOneFileType(conn, filter)

		if err != nil {
			err = errors.Wrap(err, "FindOneFileType")
			app.serverErrorResponse(w, r, err)
			return
		}

		if fileType == nil {
			app.errorResponse(w, r, http.StatusBadRequest, "Unable to find file type.")
			return
		}

		data := jsondata{"filetype": fileType}
		err = app.writeJSON(w, http.StatusOK, data, nil)
		if err != nil {
			err = errors.Wrap(err, "writeJSON")
			app.serverErrorResponse(w, r, err)
		}

		return
	}

	fileTypes, err := data.GetAllFileTypes(conn)
	if err != nil {
		err = errors.Wrap(err, "GetAllFileTypes")
		app.serverErrorResponse(w, r, err)
		return
	}

	data := jsondata{"filetypes": fileTypes}
	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		err = errors.Wrap(err, "writeJSON")
		app.serverErrorResponse(w, r, err)
	}
}
