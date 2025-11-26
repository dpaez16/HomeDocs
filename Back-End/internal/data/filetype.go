package data

import (
	"database/sql"
	"fmt"
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

type FileType struct {
	FileTypeID  int32  `db:"filetypeid" json:"fileTypeID"`
	Name        string `db:"name" json:"name"`
	Editable    bool   `db:"editable" json:"editable"`
	Indexable   bool   `db:"indexable" json:"indexable"`
	Diffable    bool   `db:"diffable" json:"diffable"`
	Extension   string `db:"extension" json:"extension"`
	IsCanonical bool   `db:"is_canonical" json:"isCanonical"`
}

// Finds one file type.
// If a runtime error occurs, a nil file type and error is returned.
// Otherwise, a file type and nil error is returned.
func FindOneFileType(readConn db.ReadDBExecutor, filter map[string]any) (*FileType, error) {
	fileType := &FileType{}

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
		  FROM filetype
		 WHERE %v
	`, whereBuilder.ToString())

	err := readConn.Get(fileType, query, args...)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, errors.Wrap(err, "Get")
	}

	return fileType, nil
}

func GetAllFileTypes(readConn db.ReadDBExecutor) ([]*FileType, error) {
	entries := []*FileType{}
	query := `
		SELECT *
		  FROM filetype
	`
	err := readConn.Select(&entries, query)
	if err != nil {
		return nil, errors.Wrap(err, "Select")
	}

	return entries, nil
}

func IsCanonicalFileType(conn db.ReadDBExecutor, fileTypeID int) (bool, error) {
	filter := map[string]any{"filetypeid": fileTypeID}
	fileType, err := FindOneFileType(conn, filter)
	if err != nil {
		return false, errors.Wrap(err, "FindOneFileType")
	}

	return fileType.IsCanonical, nil
}

func CreateFileType(writeConn db.WriteDBExecutor, fileType *FileType) error {
	result, err := writeConn.Exec(`
		INSERT INTO filetype
		(name, editable, indexable, diffable, extension, is_canonical)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, fileType.Name, fileType.Editable, fileType.Indexable, fileType.Diffable, fileType.Extension, false)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to insert new filetype entry")
	}

	return nil
}

func EditFileType(writeConn db.WriteDBExecutor, fileTypeID int, fileType *FileType) error {
	isCanonical, err := IsCanonicalFileType(writeConn, fileTypeID)
	if err != nil {
		return errors.Wrap(err, "IsCanonicalFileType")
	}

	if isCanonical {
		return errors.New("cannot modify canonical file type")
	}

	result, err := writeConn.Exec(`
		UPDATE filetype
		SET   name 		= $1
		    , editable 	= $2
			, indexable = $3
			, diffable  = $4
			, extension = $5
		WHERE filetypeid = $6
	`, fileType.Name, fileType.Editable, fileType.Indexable, fileType.Diffable, fileType.Extension, fileTypeID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to edit filetype")
	}

	return nil
}

func DeleteFileType(writeConn db.WriteDBExecutor, fileTypeID int) error {
	isCanonical, err := IsCanonicalFileType(writeConn, fileTypeID)
	if err != nil {
		return errors.Wrap(err, "IsCanonicalFileType")
	}

	if isCanonical {
		return errors.New("cannot delete canonical file type")
	}

	_, err = writeConn.Exec(`
		DELETE FROM filetype
		WHERE filetypeid = $1
	`, fileTypeID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	return nil
}
