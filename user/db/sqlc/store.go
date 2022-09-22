package db

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
)

type Store struct {
	*Queries
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db:      db,
		Queries: New(db),
	}
}

func (store *Store) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := store.db.BeginTx(ctx, nil)

	if err != nil {
		return err
	}

	q := New(tx)

	if err = fn(q); err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit()
}

type ConnectionTxParams struct {
	UserTo    uuid.UUID `json:"userTo"`
	UserFrom  string    `json:"userFrom"`
	RequestID string    `json:"requestId"`
}

func (store *Store) ConnectionTx(ctx context.Context, arg ConnectionTxParams) (bool, error) {
	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		if err = q.AddConnection(ctx, AddConnectionParams{
			User1: arg.UserTo,
			User2: uuid.MustParse(arg.UserFrom),
		}); err != nil {
			return err
		}

		if err = q.UpdateConnectionTotal(ctx, UpdateConnectionTotalParams{
			ID:          arg.UserTo,
			Connections: 1,
		}); err != nil {
			return err
		}

		if err = q.UpdateConnectionTotal(ctx, UpdateConnectionTotalParams{
			ID:          uuid.MustParse(arg.UserFrom),
			Connections: 1,
		}); err != nil {
			return err
		}

		if err = q.DeleteReq(ctx, uuid.MustParse(arg.RequestID)); err != nil {
			return err
		}
		return nil
	})
	return true, err
}
