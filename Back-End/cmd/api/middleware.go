package main

import (
	"context"
	"fmt"
	"homedocs-api/m/v2/internal"
	"homedocs-api/m/v2/internal/db"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

var (
	readContextKey  = "read_db_executor"
	writeContextKey = "write_db_executor"
	schedulerKey    = "scheduler"
)

// Captures panic calls and logs them.
func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// Enables CORS for web requests.
func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // TODO: change this to http://front-end.com
		w.Header().Set("Access-Control-Allow-Methods", "POST,GET")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		next.ServeHTTP(w, r)
	})
}

// Ensures that requests have a valid JSON Web Token.
func (app *application) authenticate(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		token := r.Header.Get("Authorization")
		if token == "" {
			app.errorResponse(w, r, http.StatusUnauthorized, "Unauthorized.")
			return
		}

		tokenValid, err := internal.VerifyToken(token)
		if err != nil {
			app.serverErrorResponse(w, r, errors.Wrap(err, "VerifyToken"))
			return
		}

		if !tokenValid {
			app.errorResponse(w, r, http.StatusUnauthorized, "Unauthorized.")
			return
		}

		next(w, r, ps)
	}
}

// Creates a transaction for write operations (POST, PUT, DELETE, PATCH)
func (app *application) transactionMiddleware(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := r.Context()

		if r.Method == http.MethodPost ||
			r.Method == http.MethodPut ||
			r.Method == http.MethodDelete ||
			r.Method == http.MethodPatch {

			lazyTx := db.NewLazyTx(app.db)

			// Defer commit or rollback based on the result
			defer func() {
				if rec := recover(); rec != nil {
					_ = lazyTx.Rollback()
					err := errors.Errorf("%v", rec)
					app.serverErrorResponse(w, r, err)
				} else if r.Context().Err() != nil {
					// req is cancelled by client, timeout, or app ctx cancelled.
					_ = lazyTx.Rollback()
				} else {
					if err := lazyTx.Commit(); err != nil {
						err = errors.New("Transaction failed to commit")
						app.serverErrorResponse(w, r, err)
					}
				}
			}()

			// Add LazyTx to the context for both reading and writing
			ctx = context.WithValue(ctx, readContextKey, lazyTx)
			ctx = context.WithValue(ctx, writeContextKey, lazyTx)
		} else {
			// For read-only requests, use the base db connection
			ctx = context.WithValue(ctx, readContextKey, app.db)
		}

		next(w, r.WithContext(ctx), ps)
	}
}

// Middleware that runs for authenticated users in the application.
func (app *application) authUsersMiddleware(handler httprouter.Handle) httprouter.Handle {
	return app.transactionMiddleware(app.authenticate(handler))
}

// Middleware that runs for non-authenticated users in the application.
func (app *application) nonAuthUsersMiddleware(handler httprouter.Handle) httprouter.Handle {
	return app.transactionMiddleware(handler)
}
