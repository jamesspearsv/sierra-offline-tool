#!/bin/sh
set -e


echo "###########################"
echo "*** Applying Migrations ***"
echo "###########################"

cd /app/drizzle
node apply-migrations.js

echo "############################"
echo "*** Migrations Complete! ***"
echo "############################"

exec "$@"