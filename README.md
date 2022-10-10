<!-- KAMOU NATION README -->

# KAMOU NATION

- Messenger
- User Feed
- Organizations
- Notifications
<!-- - Community -->

## Noteable features

- User can have a google account as it also makes use of google oauth
- Messages can only between connections
- Recruiters can chat up intended employees
- Users can set if they are recruiting or up for work

## Divison

- Database

* Organizations work with mongoDB
* User services works with postgreSQL

- Languages and stack

* Messenger works with node.js, typescript
* User Feed works with go lang, gin. Uses pasteo for authentication tokens
* Organizations work with node.js


## Requirements
- docker 
- rabbitMQ running on docker(docker image: rabbitmq:3-management-alpine)
- reddis on localMachine but you can tweak it so it runs on docker(if so then add it to the docker compose.yml file in user service)
- postgreSQL on docker(tweak the MakeFile in user service to satisfy your postgreSQL configurations)
- go migrate
- go (download version 1.19 for this project)
- node.js running locally 
- mongodb running locally

- Note:
* as i continue updating i'll make sure all external services(mongodb, redis etc) runs on docker.
* make sure to use the command 
``` bash
go mod tidy
```
to install all dependencies for go
and
``` bash
yarn install | yarn
```
to install all dependencies for node.js

* rename a.env to .env in node.js services and rename a.env in go services to app.env then provide your configurations as requested
* don't make any mistake to edit the files in migrations folder or db folder except you know how to work with go and sqlc ORM.
* when running organization service update your postman request port from 8181 to 8189.

## Run
- in the user service run the command make serve to start the user service
- in the notification service run 
``` bash
go run main.go
```
to start the server
- in all node.js services run
``` bash
yarn serve
```
to start the server

- import all postman json files found in root directory of all services to your postman in order to make API calls easily.

- after signing up user an email would be sent to the email provided for registration.
- copy the pasteo token there and paste in the validateUser api request params or check the terminal you'll see the pasteo token printed out.