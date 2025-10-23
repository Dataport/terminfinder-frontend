#!/bin/sh
set -e

encode_base64() {
    local input="$1"
    echo -n "$input" | base64 | tr -d '\n'
}

DEFAULT_TITLE="Terminfinder EU"
DEFAULT_LOCALE="de-DE"
DEFAULT_ADDRESSING="du"
DEFAULT_CUSTOMER_ID="00000000-0000-0000-0000-000000000000"
DEFAULT_EMAIL="demo@example.com"
DEFAULT_COLORS="{}"
DEFAULT_IMPRINT="<h2>Herausgeber</h2><h3>Firmenname</h3><p> Firmenadresse </p><p> Kontaktdaten </p><h2>Rechtliche Hinweise</h2><p> Hinweise </p><h2>Realisierung</h2><p> Design, Entwicklung </p><p> Dataport<br> Anstalt öffentlichen Rechts<br> Altenholzer Straße 10-14<br> 24161 Altenholz<br> Tel.: +49 (0)431 3295-0<br> Fax.: +49 (0)431 3295-0<br></p><p> E-Mail: <a href="mailto:dataportdabstimmbox@dataport.de">dataportdabstimmbox@dataport.de</a></p><h2>Inhalte</h2><p> Für Vollständigkeit, Fehler redaktioneller und technischer Art, Auslassungen sowie die Richtigkeit der Eintragungen kann keine Haftung übernommen werden. Insbesondere kann keine Gewähr für die Vollständigkeit und Richtigkeit von Informationen übernommen werden, die über weiterführende Links erreicht werden. </p><p> Anbieter dieser Links sind für die eigenen Inhalte, die sie zur Nutzung bereithalten, nach den allgemeinen Gesetzen verantwortlich. Von diesen eigenen Inhalten sind Querverweise auf die von anderen Anbietern bereitgehaltenen Inhalte zu unterscheiden. </p><div>Stand 13. September 2022</div>"
DEFAULT_PRIVACY="<h2>privacy</h2>"
DEFAULT_TOS="<h2>tos</h2>"
DEFAULT_ACCESSIBILITY="<h2>accessibility</h2>"

TITLE="${TITLE:-$DEFAULT_TITLE}"
LOCALE="${LOCALE:-$DEFAULT_LOCALE}"
ADDRESSING="${ADDRESSING:-$DEFAULT_ADDRESSING}"
CUSTOMER_ID="${CUSTOMER_ID:-$DEFAULT_CUSTOMER_ID}"
EMAIL="${EMAIL:-$DEFAULT_EMAIL}"
COLORS="${COLORS:-$DEFAULT_COLORS}"
IMPRINT="${IMPRINT:-$DEFAULT_IMPRINT}"
PRIVACY="${PRIVACY:-$DEFAULT_PRIVACY}"
TOS="${TOS:-$DEFAULT_TOS}"
ACCESSIBILITY="${ACCESSIBILITY:-$DEFAULT_ACCESSIBILITY}"

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Replacing Env-Vars with parameters."

find /usr/share/nginx/html -type f -exec sed -i "s~@TITLE@~$TITLE~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@LOCALE@~$LOCALE~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@ADDRESSING@~$ADDRESSING~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@API_URL@~$API_URL~g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s~@CUSTOMER_ID@~$CUSTOMER_ID~g" {} \;

ENCODED_EMAIL=$(encode_base64 "$EMAIL")
find /usr/share/nginx/html -type f -exec sed -i "s~@EMAIL@~$ENCODED_EMAIL~g" {} \;

ENCODED_COLORS=$(encode_base64 "$COLORS")
find /usr/share/nginx/html -type f -exec sed -i "s~@COLORS@~$ENCODED_COLORS~g" {} \;

ENCODED_IMPRINT=$(encode_base64 "$IMPRINT")
find /usr/share/nginx/html -type f -exec sed -i "s~@IMPRINT@~$ENCODED_IMPRINT~g" {} \;

ENCODED_PRIVACY=$(encode_base64 "$PRIVACY")
find /usr/share/nginx/html -type f -exec sed -i "s~@PRIVACY@~$ENCODED_PRIVACY~g" {} \;

ENCODED_TOS=$(encode_base64 "$TOS")
find /usr/share/nginx/html -type f -exec sed -i "s~@TOS@~$ENCODED_TOS~g" {} \;

ENCODED_ACCESSIBILITY=$(encode_base64 "$ACCESSIBILITY")
find /usr/share/nginx/html -type f -exec sed -i "s~@ACCESSIBILITY@~$ENCODED_ACCESSIBILITY~g" {} \;

echo "/docker-entrypoint.d/docker-replace-parameters.sh: Successfully initialized. Starting up nginx."
