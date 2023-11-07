ALTER TABLE "public"."moped_users"
    ADD COLUMN "last_seen_date" timestamptz NULL;

CREATE FUNCTION set_last_seen_date (hasura_session json)
    RETURNS SETOF moped_users
    AS $$
DECLARE
    user_id integer;
BEGIN
    SELECT
        q.* INTO user_id
    FROM (
        VALUES(hasura_session ->> 'x-hasura-user-db-id')) q;
    UPDATE
        moped_users
    SET
        last_seen_date = now()
    WHERE
        moped_users.user_id = user_id;
    RETURN query
    SELECT
        user_id
    FROM
        moped_users
    WHERE
        moped_users.user_id = user_id;
END;
$$
LANGUAGE PLPGSQL
