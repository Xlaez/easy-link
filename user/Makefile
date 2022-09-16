postgres: 
	docker run --name postgres13-old -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres\:13-alpine
createdb:
	docker exec -it postgres13-old createdb --username=root --owner=root connect
dropdb:
	docker exec -it postgres13-old dropdb connect
migrateup: 
	migrate -path ./db/migration/ -database "postgresql://root:password@localhost:5432/connect?sslmode=disable" -verbose up
migratedown:
	migrate -path ./db/migration/ -database "postgresql://root:password@localhost:5432/connect?sslmode=disable" -verbose down
test:
	go test -v -cover ./...
sqlc:
	sqlc generate
serve:
	go run main.go
opendb:
	docker exec -it postgres13-old psql -U root -d bank
.PHONY: 
	postgres createdb dropdb migrateup migratedown sqlc test serve cleandb