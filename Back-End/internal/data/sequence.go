package data

import (
	"fmt"
	"homedocs-api/m/v2/internal/db"

	"github.com/pkg/errors"
)

func GetNextSequenceValue(writeConn db.WriteDBExecutor, sequenceName string) (int64, error) {
	var nextID int64
	query := fmt.Sprintf(`
		SELECT nextval('%v')
	`, sequenceName)

	err := writeConn.Get(&nextID, query)
	if err != nil {
		return 0, errors.Wrap(err, "select nextval")
	}

	return nextID, nil
}
