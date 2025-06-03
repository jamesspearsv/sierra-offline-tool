#!/bin/sh
set -e


echo "###########################"
echo "*** Applying Migrations ***"
echo "###########################"

pwd
cd /app/drizzle
pwd
node apply-migrations.js

echo "############################"
echo "*** Migrations Complete! ***"
echo "############################"

cd /app

exec "$@"