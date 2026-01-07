#!/bin/bash
set -e

# Wait for postgres to be ready
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_USER" ]; then
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
        echo "Waiting for postgres to be ready..."
        sleep 2
    done
    echo "Postgres is up - running migrations"
fi

# Run migrations
python manage.py migrate --noinput

# Start server
exec python manage.py runserver 0.0.0.0:8000

