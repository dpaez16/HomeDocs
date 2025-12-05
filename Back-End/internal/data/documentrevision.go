package data

import (
	"homedocs-api/m/v2/internal/db"
	"time"

	"github.com/guregu/null/v6"
	"github.com/pkg/errors"
)

type DocumentStatus int8

const (
	DocumentStatusDraft    DocumentStatus = 0
	DocumentStatusArchived DocumentStatus = 1
	DocumentStatusOfficial DocumentStatus = 2
)

type DocumentRevision struct {
	DocumentRevisionID int32          `db:"documentrevisionid" json:"documentRevisionID"`
	DocumentID         int32          `db:"documentid" json:"documentID"`
	RevNum             int            `db:"revnum" json:"revNum"`
	Title              string         `db:"title" json:"title"`
	OwnerID            int32          `db:"ownerid" json:"ownerID"`
	DocStatus          DocumentStatus `db:"docstatus" json:"docStatus"`
	DocTypeID          int32          `db:"doctypeid" json:"docTypeID"`
	DocTemplateID      int32          `db:"doctemplateid" json:"docTemplateID"`
	CreateDT           time.Time      `db:"createdt" json:"createDT"`
	OfficialDT         null.Time      `db:"officialdt" json:"officialDT"`
	ArchivedDT         null.Time      `db:"archiveddt" json:"archivedDT"`
	Notes              null.String    `db:"notes" json:"notes"`
	Keywords           null.String    `db:"keywords" json:"keywords"`
}

func CreateDocumentRevision(writeConn db.WriteDBExecutor, documentRevision *DocumentRevision) (int64, error) {
	documentRevisionID, err := GetNextSequenceValue(writeConn, "documentrevisionid")
	if err != nil {
		return 0, errors.Wrap(err, "GetNextSequenceValue")
	}

	query := `
		INSERT INTO documentrevision
		(documentrevisionid, documentid, revnum, title, ownerid, docstatus, doctypeid, doctemplateid, createdt)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`

	result, err := writeConn.Exec(
		query,
		documentRevisionID,
		documentRevision.DocumentID,
		documentRevision.RevNum,
		documentRevision.Title,
		documentRevision.OwnerID,
		documentRevision.DocStatus,
		documentRevision.DocTypeID,
		documentRevision.DocTemplateID,
		time.Now(),
	)

	if err != nil {
		return 0, errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return 0, errors.New("failed to insert new doctype entry")
	}

	return documentRevisionID, nil
}

func GetNextRevNum(readConn db.ReadDBExecutor, documentID int) (int, error) {
	var revNum int
	err := readConn.Get(&revNum, `
		SELECT max(revnum)
		  FROM documentrevision
		 WHERE documentid = $1
	`, documentID)

	if err != nil {
		return 0, errors.Wrap(err, "select max revnum")
	}

	return revNum + 1, nil
}
