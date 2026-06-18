#!/usr/bin/env bash

USE_GITHUB_ACTION=false
for arg in "$@"; do
    if [[ "$arg" == "--github-action" ]]; then
        USE_GITHUB_ACTION=true
        break
    fi
done

export USE_GITHUB_ACTION

if ! $USE_GITHUB_ACTION; then
    SCRIPT_DIR=$(cd -- "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
    REPO_ROOT=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)
    CURRENT_DIR=$(pwd -P)
    if [[ "$CURRENT_DIR" != "$REPO_ROOT" ]]; then
        echo "Error: This script must be run from the repo root when not in GitHub Action mode." >&2
        echo "  Repo root: $REPO_ROOT" >&2
        echo "  Current dir: $CURRENT_DIR" >&2
        exit 1
    fi
    # Defaults matching moped-database/docker-compose.yml
    : "${POSTGRES_USER:=moped}"
    : "${POSTGRES_DB:=moped}"
    export POSTGRES_USER POSTGRES_DB
fi

function run_psql() {
    if [[ "$USE_GITHUB_ACTION" == "true" ]]; then
        psql "$@"
    else
        docker compose -f ./moped-database/docker-compose.yml exec -T moped-pgsql psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@" < /dev/null
    fi
}

function create_view_file() {
    local VIEW_NAME=$1

    echo "View: $VIEW_NAME"
    MOST_RECENT_MIGRATION=$(grep -rl --include=up.sql -E "CREATE (OR REPLACE )?VIEW (\"?public\"?.)?\"?$VIEW_NAME\"?" moped-database/migrations/default | sort -V | tail -n 1)
    echo "MOST_RECENT_MIGRATION: $MOST_RECENT_MIGRATION"

    # Create the view file with header
    echo "-- Most recent migration: $MOST_RECENT_MIGRATION" > moped-database/views/$VIEW_NAME.sql
    echo "" >> moped-database/views/$VIEW_NAME.sql

    # Query the view definition and append to the file
    run_psql -v ON_ERROR_STOP=1 -A -t -c "SELECT 'CREATE OR REPLACE VIEW ' || '$VIEW_NAME' || ' AS' || chr(10) || pg_get_viewdef('$VIEW_NAME'::regclass, true);" >> moped-database/views/$VIEW_NAME.sql
}

function populate_views() {
    mkdir -p moped-database/views
    while IFS= read -r VIEW_NAME; do
        create_view_file "$VIEW_NAME"
    done < <(
        run_psql -v ON_ERROR_STOP=1 -A -t -c "SELECT table_name FROM information_schema.views WHERE table_schema = 'public' ORDER BY table_name;" | \
        grep -v -E '^geo[a-zA-Z]+y_columns$'
    )
}

populate_views
