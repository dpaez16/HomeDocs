package main

import (
	"encoding/json"
	"homedocs-api/m/v2/internal/db"
	"net/http"

	"github.com/pkg/errors"
)

type jsondata map[string]any

// Sends a JSON payload response to the client.
func (app *application) writeJSON(
	w http.ResponseWriter,
	status int,
	data jsondata,
	headers http.Header,
) error {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return errors.Wrap(err, "json serialization")
	}

	js = append(js, '\n')

	for key, value := range headers {
		w.Header()[key] = value
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func (app *application) logError(r *http.Request, err error) {
	app.logger.Printf("request_method: %s, request_url: %s, message: %s", r.Method, r.URL.String(), err.Error())
}

// Sends an error response to the client.
func (app *application) errorResponse(
	w http.ResponseWriter,
	r *http.Request,
	status int,
	message any,
) {
	data := jsondata{"error": message}
	err := app.writeJSON(w, status, data, nil)
	if err != nil {
		app.logError(r, errors.Wrap(err, "writeJSON"))
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (app *application) serverErrorResponse(
	w http.ResponseWriter,
	r *http.Request,
	err error,
) {
	app.logError(r, err)

	message := "The server encountered a problem and could not process your request."
	app.errorResponse(w, r, http.StatusInternalServerError, message)
}

func getReadConnection(r *http.Request) db.ReadDBExecutor {
	return r.Context().Value(readContextKey).(db.ReadDBExecutor)
}

func getWriteTx(r *http.Request) (*db.LazyTx, error) {
	tx := r.Context().Value(writeContextKey)
	if tx == nil {
		return nil, errors.New("WriteTx executor does not exist, writing is only supported in POST,PUT,DELETE,PATCH")
	}

	tx, ok := tx.(*db.LazyTx)
	if !ok {
		return nil, errors.New("WriteTx executor is not a LazyTx instance")
	}

	return tx.(*db.LazyTx), nil
}
