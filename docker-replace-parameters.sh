#!/bin/sh
set -e

# Function to escape double quotes in a variable for safe sed usage
escape_quotes() {
    local input="$1"
    echo "$input" | sed 's~"~\\\\"~g' # we want to keep one backslash for the next sed step. So we double them.
}

TITLE="${TITLE:-Terminfinder EU}"
LOCALE="${LOCALE:-de-DE}"
ADDRESSING="${ADDRESSING:-du}"
CUSTOMER_ID="${CUSTOMER_ID:-00000000-0000-0000-0000-000000000000}"

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Replacing Env-Vars with parameters."

find /usr/share/nginx/html -type f -exec sed -i "s/@TITLE@/$TITLE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@LOCALE@/$LOCALE/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s/@ADDRESSING@/$ADDRESSING/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@API_URL@~$API_URL~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@CUSTOMER_ID@~$CUSTOMER_ID~g" {} \;

if [ -n "$COLORS" ]; then
  ESCAPED_COLORS=$(escape_quotes "$COLORS")
  find /usr/share/nginx/html -type f -exec sed -i "s~@COLORS@~$ESCAPED_COLORS~g" {} \;
fi

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Successfully initialized. Starting up nginx."
