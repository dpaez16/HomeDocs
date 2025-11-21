package data

import (
	"database/sql"
	"fmt"
	"homedocs-api/m/v2/internal"
	"homedocs-api/m/v2/internal/db"

	"github.com/guregu/null/v6"
	"github.com/pkg/errors"
)

type User struct {
	UserID         int32       `db:"userid" json:"userID"`
	FirstName      string      `db:"firstname" json:"firstName"`
	MiddleInitials null.String `db:"middleinitials" json:"middleInitials"`
	LastName       null.String `db:"lastname" json:"lastName"`
	Email          string      `db:"email" json:"email"`
	Password       string      `db:"password" json:"-"`
	Rights         int32       `db:"rights" json:"rights"`
}

// Finds one user.
// If a runtime error occurs, a nil user and error is returned.
// Otherwise, a user and nil error is returned.
func FindOneUser(readConn db.ReadDBExecutor, filter map[string]any) (*User, error) {
	user := &User{}

	var args []any
	whereBuilder := db.NewWhereBuilder()

	for k, v := range filter {
		argNum := len(args) + 1
		whereClause := fmt.Sprintf("%v = $%v", k, argNum)

		if whereBuilder.IsEmpty() {
			whereBuilder.Where(whereClause)
		} else {
			whereBuilder.And(whereClause)
		}

		args = append(args, v)
	}

	query := fmt.Sprintf(`
		SELECT *
		  FROM users
		 WHERE %v
	`, whereBuilder.ToString())

	err := readConn.Get(user, query, args...)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, errors.Wrap(err, "Get")
	}

	return user, nil
}

// Searches for a user in the context of logging in.
// If a runtime error occurs, a nil user and error is returned.
// Otherwise, a user and nil error is returned.
func FindUserByEmailAndPassword(readConn db.ReadDBExecutor, email string, password string) (*User, error) {
	filter := map[string]any{"email": email}
	user, err := FindOneUser(readConn, filter)
	if err != nil {
		return nil, errors.Wrap(err, "FindOneUser")
	}

	if user == nil {
		return nil, nil
	}

	passwordValid, err := internal.ComparePasswords([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.Wrap(err, "ComparePasswords")
	}

	if passwordValid {
		return user, nil
	} else {
		return nil, nil
	}
}
