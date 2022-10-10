-- name: CreateUser :one
insert into "user" (
    name,
    email,
    acc_type,
    password,
    country
)
values (
    $1, $2, $3, $4, $5
) returning *;

-- name: UpdateConnectionTotal :exec
update "user"
   set connections= connections + $2
 where id = $1;

-- name: GetUser :one
select *
  from "user"
 where id = $1
 limit 1;

-- name: IsEmailTaken :one
select *
  from "user"
 where email = $1;

-- name: GetAllUsers :many
select *
  from "user"
  order by  id
  limit $1
  offset $2;

-- name: SetActivity :exec
update "user"
   set active=$2
 where id = $1;

 -- name: UpdateBio :exec
update "user"
    set bio=$2,
   updated_at=$3
  where id = $1;

-- name: UpdateAvatar :exec
update "user"
   set avatar_url=$2,
   avatar_id=$3,
   updated_at=$4
 where id = $1;

-- name: UpdateField :exec
update "user"
    set field = $2,
    field_title =$3
where id = $1;

 -- name: DeleteUser :exec
 delete from "user"
  where id = $1;

-- name: UpdatePassword :exec
update "user"
   set password=$2
 where id = $1;

-- name: UpdateEmail :exec
update "user"
   set email=$2,
   updated_at=$3
 where id = $1;

 -- name: Validate :exec
update "user"
    set valid=$2
 where id = $1;

-- name: SendReq :exec
insert into "request" (
    user_from,
    user_to
) values (
    $1, $2
);

-- name: GetReq :one
select *
  from "request"
 where id = $1
 limit 1;

-- name: GetAllUserReq :many
select *
  from "request"
 where user_to = $1
 limit $2
 offset $3;

-- name: GetAllSentReq :many
select *
  from "request"
 where user_from = $1
 limit $2
 offset $3;

-- name: DeleteReq :exec
delete from "request"
 where id = $1;

-- name: AddConnection :exec
insert into "connection" (
    user_1,
    user_2
) values ($1, $2);

-- name: DeleteConnection :exec
delete from "connection"
 where id = $1;

-- name: GetConnection :one
select * from "connection"
where id = $1
limit 1;

-- name: GetAllUserConnections :many
select * from "connection"
where user_1 = $1
or user_2 = $1
limit $2
offset $3;

-- name: GetAllUserConnectionsForPosts :many
select * from "connection"
where user_1 = $1
or user_2 = $1;

-- name: GetAllUsersOfGivenLocation :many
select * from "user"
where country = $1
limit $2
offset $3;

-- name: GetUserByField :many
select * from "user"
where field = $1
limit $2
offset $3;