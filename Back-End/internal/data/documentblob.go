package data

import (
	"database/sql"
	"homedocs-api/m/v2/internal/apachetika"
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

type DocumentBlob struct {
	DocumentBlobID int32  `db:"documentblobid" json:"documentBlobID"`
	Contents       []byte `db:"contents" json:"contents"`
}

func GetDocumentBlobByID(readConn db.ReadDBExecutor, documentBlobID int) (*DocumentBlob, error) {
	documentBlob := &DocumentBlob{}

	query := `
		SELECT   documentblobid
			   , contents
		  FROM documentblob
		 WHERE documentblobid = $1
	`

	err := readConn.Get(documentBlob, query, documentBlobID)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, errors.Wrap(err, "Get")
	}

	return documentBlob, nil
}

func IndexDocument(writeConn db.WriteDBExecutor, documentBlobID int) error {
	blob, err := GetDocumentBlobByID(writeConn, documentBlobID)
	if err != nil {
		return errors.Wrap(err, "GetDocumentBlobByID")
	}

	text, err := apachetika.ExtractTextFromDocumentBuffer(blob.Contents)
	if err != nil {
		return errors.Wrap(err, "ExtractTextFromDocumentBuffer")
	}

	result, err := writeConn.Exec(`
		UPDATE documentblob
		   SET contents_text = $1
		 WHERE documentblobid = $2
	`, text, documentBlobID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to edit document contents")
	}

	_, err = writeConn.Exec(`
		UPDATE documentblob
		   SET contents_vec = to_tsvector('english', contents_text)
		 WHERE documentblobid = $1
	`, documentBlobID)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err = result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to index document contents")
	}

	return nil
}

func CreateDocumentBlob(writeConn db.WriteDBExecutor, contents []byte) error {
	documentBlobID, err := GetNextSequenceValue(writeConn, "documentblobid")
	if err != nil {
		return errors.Wrap(err, "GetNextSequenceValue")
	}

	result, err := writeConn.Exec(`
		INSERT INTO documentblob
		(documentblobid, contents)
		VALUES ($1, $2)
	`, documentBlobID, contents)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to insert a new document blob")
	}

	return IndexDocument(writeConn, int(documentBlobID))
}
