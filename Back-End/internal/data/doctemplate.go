package data

import (
	"database/sql"
	"fmt"
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

type DocTemplateStatus int8

const (
	DocTemplateStatusActive   DocTemplateStatus = 0
	DocTemplateStatusArchived DocTemplateStatus = 1
)

type DocTemplate struct {
	DocTemplateID int32             `db:"doctemplateid" json:"docTemplateID"`
	DocTypeID     int32             `db:"doctypeid" json:"docTypeID"`
	Name          string            `db:"name" json:"name"`
	Status        DocTemplateStatus `db:"status" json:"status"`
}

// Finds one doc template.
// If a runtime error occurs, a nil doc template and error is returned.
// Otherwise, a doc template and nil error is returned.
func FindOneDocTemplate(readConn db.ReadDBExecutor, filter map[string]any) (*DocTemplate, error) {
	docTemplate := &DocTemplate{}

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
		  FROM doctemplate
		 WHERE %v
	`, whereBuilder.ToString())

	err := readConn.Get(docTemplate, query, args...)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, errors.Wrap(err, "Get")
	}

	return docTemplate, nil
}

func GetAllDocTemplates(readConn db.ReadDBExecutor) ([]*DocTemplate, error) {
	entries := []*DocTemplate{}
	query := `
		SELECT *
		  FROM doctemplate
	`
	err := readConn.Select(&entries, query)
	if err != nil {
		return nil, errors.Wrap(err, "Select")
	}

	return entries, nil
}

func CreateDocTemplate(writeConn db.WriteDBExecutor, docTemplate *DocTemplate) error {
	result, err := writeConn.Exec(`
		INSERT INTO doctemplate
		(doctypeid, name, status)
		VALUES ($1, $2, $3)
	`, docTemplate.DocTypeID, docTemplate.Name, DocTemplateStatusActive)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to insert new doctemplate entry")
	}

	return nil
}

func EditDocTemplate(writeConn db.WriteDBExecutor, docTemplateID int, docTemplate *DocTemplate) error {
	result, err := writeConn.Exec(`
		UPDATE doctemplate
		SET   doctypeid = $1
			, name 		= $2
			, status 	= $3
		WHERE doctemplateid = $4
	`, docTemplate.DocTypeID, docTemplate.Name, docTemplate.Status, docTemplateID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to edit doctemplate")
	}

	return nil
}

func DeleteDocTemplate(writeConn db.WriteDBExecutor, docTemplateID int) error {
	_, err := writeConn.Exec(`
		DELETE FROM doctemplate
		WHERE doctemplateid = $1
	`, docTemplateID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	return nil
}
