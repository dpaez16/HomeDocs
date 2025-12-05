package data

import (
	"homedocs-api/m/v2/internal/db"
	"time"

	"github.com/pkg/errors"
)

type SubRevision struct {
	SubRevisionID      int32     `db:"subrevisionid" json:"subRevisionID"`
	DocumentRevisionID int32     `db:"documentrevisionid" json:"documentRevisionID"`
	SubRevNum          int       `db:"subrevnum" json:"subrevnum"`
	DocumentBlobID     int32     `db:"documentblobid" json:"documentblobid"`
	UserID             int32     `db:"userid" json:"userid"`
	CreateDT           time.Time `db:"createdt" json:"createDT"`
}

func CreateSubRevision(writeConn db.WriteDBExecutor, subRevision *SubRevision) error {
	query := `
		INSERT INTO subrevision
		(documentrevisionid, subrevnum, documentblobid, userid, createdt)
		VALUES ($1, $2, $3, $4, $5)
	`

	result, err := writeConn.Exec(
		query,
		subRevision.DocumentRevisionID,
		subRevision.SubRevNum,
		subRevision.DocumentBlobID,
		subRevision.UserID,
		time.Now(),
	)

	if err != nil {
		return errors.Wrap(err, "writeConn.Exec")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.Wrap(err, "RowsAffected")
	}

	if rowsAffected != 1 {
		return errors.New("failed to insert new subrevision entry")
	}

	return nil
}

func GetNextSubRevNum(readConn db.ReadDBExecutor, documentRevisionID int) (int, error) {
	var subRevNum int
	err := readConn.Get(&subRevNum, `
		SELECT max(subrevnum)
		  FROM subrevision
		 WHERE documentrevisionid = $1
	`, documentRevisionID)

	if err != nil {
		return 0, errors.Wrap(err, "select max subrevnum")
	}

	return subRevNum + 1, nil
}
