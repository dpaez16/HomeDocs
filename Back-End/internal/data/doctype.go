package data

import (
	"database/sql"
	"fmt"
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

type DocTypeStatus int8

const (
	DocTypeStatusActive   DocTypeStatus = 0
	DocTypeStatusArchived DocTypeStatus = 1
)

type DocType struct {
	DocTypeID int32         `db:"doctypeid" json:"docTypeID"`
	Name      string        `db:"name" json:"name"`
	Status    DocTypeStatus `db:"status" json:"status"`
}

// Finds one doc type.
// If a runtime error occurs, a nil doc type and error is returned.
// Otherwise, a doc type and nil error is returned.
func FindOneDocType(readConn db.ReadDBExecutor, filter map[string]any) (*DocType, error) {
	docType := &DocType{}

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
		  FROM doctype
		 WHERE %v
	`, whereBuilder.ToString())

	err := readConn.Get(docType, query, args...)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, errors.Wrap(err, "Get")
	}

	return docType, nil
}

func GetAllDocTypes(readConn db.ReadDBExecutor) ([]*DocType, error) {
	entries := []*DocType{}
	query := `
		SELECT *
		  FROM doctype
	`
	err := readConn.Select(&entries, query)
	if err != nil {
		return nil, errors.Wrap(err, "Select")
	}

	return entries, nil
}

func CreateDocType(writeConn db.WriteDBExecutor, docType *DocType) error {
	result, err := writeConn.Exec(`
		INSERT INTO doctype
		(name, status)
		VALUES ($1, $2)
	`, docType.Name, DocTypeStatusActive)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to insert new doctype entry")
	}

	return nil
}

func EditDocType(writeConn db.WriteDBExecutor, docTypeID int, docType *DocType) error {
	result, err := writeConn.Exec(`
		UPDATE doctype
		SET   name 		= $1
		    , status 	= $2
		WHERE doctypeid = $3
	`, docType.Name, docType.Status, docTypeID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to edit doctype")
	}

	return nil
}

func DeleteDocType(writeConn db.WriteDBExecutor, docTypeID int) error {
	_, err := writeConn.Exec(`
		DELETE FROM doctype
		WHERE doctypeid = $1
	`, docTypeID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	return nil
}
