#!/bin/sh
set -e

TITLE=$(echo "$TITLE" || echo 'Terminfinder EU')
LOCALE=$(echo "$LOCALE" || echo "de-DE")
ADDRESSING=$(echo "$ADDRESSING" || echo "du")

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Replacing Env-Vars with parameters."

find /usr/share/nginx/html -type f -exec sed -i "s/@TITLE@/$TITLE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@LOCALE@/$LOCALE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@ADDRESSING@/$ADDRESSING/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@API_URL@~$API_URL~g" {} \;

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Successfully initialized. Starting up nginx."
