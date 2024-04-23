#!/bin/sh
set -e

TITLE=$(echo "$TITLE" || echo "Terminfinder EU")
LOCALE=$(echo "$LOCALE" || echo "de-DE")
ADDRESSING=$(echo "$ADDRESSING" || echo "du")
CUSTOMER_ID=$(echo "$CUSTOMER_ID" || echo "00000000-0000-0000-0000-000000000000")

echo "/docker-entrypoint.d/60-docker-replace-parameters.sh: Replacing Env-Vars with parameters."

find /usr/share/nginx/html -type f -exec sed -i "s/@TITLE@/$TITLE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@LOCALE@/$LOCALE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@ADDRESSING@/$ADDRESSING/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@API_URL@~$API_URL~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@CUSTOMER_ID@~$CUSTOMER_ID~g" {} \;

echo "/docker-entrypoint.d/60-docker-replace-parameters.sh: Successfully initailized. Starting up nginx."
