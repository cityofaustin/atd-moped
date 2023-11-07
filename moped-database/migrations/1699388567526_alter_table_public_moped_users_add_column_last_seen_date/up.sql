ALTER TABLE "public"."moped_users"
    ADD COLUMN "last_seen_date" timestamptz NULL;

COMMENT on COLUMN moped_users.last_seen_date is 'Tracks the last time a user loaded the Moped app in their browser. This value is set by the set_last_seen_date function. This value is not 100% reliable because it is updated by an API call that can be blocked by the client.'

CREATE FUNCTION set_last_seen_date (hasura_session json)
    RETURNS SETOF moped_users
    AS $$
DECLARE
    user_db_id integer;
BEGIN
    SELECT
        q.* INTO user_db_id
    FROM (
        VALUES(hasura_session ->> 'x-hasura-user-db-id')) q;
    UPDATE
        moped_users
    SET
        last_seen_date = now()
    WHERE
        moped_users.user_id = user_db_id;
    RETURN query
    SELECT
        *
    FROM
        moped_users
    WHERE
        moped_users.user_id = user_db_id;
END;
$$
LANGUAGE PLPGSQL
