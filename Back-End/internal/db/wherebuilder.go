package db

import (
	"fmt"
	"strings"
)

// Struct that is used for building where statements.
type WhereBuilder struct {
	sb            strings.Builder
	isBracketStmt bool
}

// Constructs a new WhereBuilder struct.
func NewWhereBuilder() *WhereBuilder {
	return &WhereBuilder{
		sb:            strings.Builder{},
		isBracketStmt: false,
	}
}

// Constructs a new WhereBuilder struct that is assumed to be bracketed.
func NewSubWhereBuilder() *WhereBuilder {
	return &WhereBuilder{
		sb:            strings.Builder{},
		isBracketStmt: true,
	}
}

// Returns the constructed where clause without the `WHERE` prefix.
func (wb *WhereBuilder) ToString() string {
	if wb.isBracketStmt {
		return fmt.Sprintf("(%v)", wb.sb.String())
	}

	return wb.sb.String()
}

// Returns the constructed where clause with the `WHERE` prefix.
func (wb *WhereBuilder) ToStringWithPrefix() string {
	if wb.isBracketStmt {
		return fmt.Sprintf("WHERE (%v)", wb.sb.String())
	}

	return fmt.Sprintf("WHERE %v", wb.sb.String())
}

// Returns true if the WhereBuilder is empty.
func (wb *WhereBuilder) IsEmpty() bool {
	return wb.sb.Len() == 0
}

// Resets + initializes the where statement with an initial clause.
func (wb *WhereBuilder) Where(clause string) *WhereBuilder {
	wb.sb.Reset()
	wb.sb.WriteString(fmt.Sprintf("%v", clause))
	return wb
}

// Appends a statement with `AND`.
func (wb *WhereBuilder) And(clause string) *WhereBuilder {
	wb.sb.WriteString(fmt.Sprintf(" AND %v", clause))
	return wb
}

// Appends a statement with `OR`.
func (wb *WhereBuilder) Or(clause string) *WhereBuilder {
	wb.sb.WriteString(fmt.Sprintf(" OR %v", clause))
	return wb
}
