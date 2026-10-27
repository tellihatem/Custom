#!/bin/sh
set -e

# Generate and persist an auth secret on first run if none was provided,
# so `docker compose up` works with zero configuration. It lives in the
# data volume, so sessions survive container restarts.
if [ -z "$BETTER_AUTH_SECRET" ]; then
    SECRET_FILE=/app/data/.auth-secret
    if [ ! -s "$SECRET_FILE" ]; then
        node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64'))" > "$SECRET_FILE"
        chmod 600 "$SECRET_FILE"
        echo "Generated BETTER_AUTH_SECRET in $SECRET_FILE"
    fi
    BETTER_AUTH_SECRET=$(cat "$SECRET_FILE")
    export BETTER_AUTH_SECRET
fi

exec "$@"
