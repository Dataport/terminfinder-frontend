#!/bin/sh
set -e

TITLE=$(echo $TITLE | echo "''")
LOCALE=$(echo $LOCALE | echo "de-DE")
ADDRESSING=$(echo $ADDRESSING | echo "du")
API_URL=$(echo $API_URL | echo "''")

echo "/docker-entrypoint.d/60-docker-replace-parameters.sh: Replacing Env-Vars with parameters."

find /usr/share/nginx/html -type f -exec sed -i "s/@TITLE@/$TITLE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@LOCALE@/$LOCALE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@ADDRESSING@/$ADDRESSING/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@API_URL@/$API_URL/g" {} \;

echo "/docker-entrypoint.d/60-docker-replace-parameters.sh: Successfully initailized. Starting up nginx."
