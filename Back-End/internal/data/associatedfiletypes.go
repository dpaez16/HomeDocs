package data

import (
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

type AssociatedFileType struct {
	DocTemplateID int32 `db:"doctemplateid" json:"docTemplateID"`
	FileTypeID    int32 `db:"filetypeid" json:"fileTypeID"`
}

func GetAllAssociatedFileTypes(readConn db.ReadDBExecutor, docTemplateID int) ([]*AssociatedFileType, error) {
	entries := []*AssociatedFileType{}

	query := `
		SELECT *
		  FROM associated_filetypes
		 WHERE doctemplateid = $1
	`
	err := readConn.Select(&entries, query, docTemplateID)
	if err != nil {
		return nil, errors.Wrap(err, "Select")
	}

	return entries, nil
}

func SetAssociatedFileTypes(writeConn db.WriteDBExecutor, docTemplateID int, fileTypeIDs []int) error {
	_, err := writeConn.Exec(`
		DELETE FROM associated_filetypes
		WHERE doctemplateid = $1
	`, docTemplateID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	for _, fileTypeID := range fileTypeIDs {
		result, err := writeConn.Exec(`
			INSERT INTO associated_filetypes
			(doctemplateid, filetypeid)
			VALUES ($1, $2)
		`, docTemplateID, fileTypeID)

		if err != nil {
			return errors.Wrap(err, "writeConn.Exec")
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			return errors.Wrap(err, "RowsAffected")
		}

		if rowsAffected != 1 {
			return errors.New("failed to insert new associated_filetype entry")
		}
	}

	return nil
}
