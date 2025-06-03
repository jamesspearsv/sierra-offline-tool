#!/bin/sh
set -e

echo "###########################"
echo "*** Applying Migrations ***"
echo "###########################"

pnpm node apply-migrations.js

echo "############################"
echo "*** Migrations Complete! ***"
echo "############################"

exec "$@"