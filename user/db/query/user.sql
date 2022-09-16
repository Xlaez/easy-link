-- name: CreateUser :one
insert into "user" (
    name,
    email,
    field,
    field_title,
    acc_type,
    password
)
values (
    $1, $2, $3, $4, $5, $6
) returning *;

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

-- name: UpdateOther :exec
update "user"
   set in_link=$2,
   tw_link=$3,
   wb_link=$4,
   gb_link=$5,
   updated_at=$6
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