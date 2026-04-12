#!/bin/sh

# clear .env and .env.test since DATABASE_URL will be reconstructed
echo "" > .env
echo "" > .env.test

POSTGRES_USER=$(cat "${POSTGRES_USER_FILE}")
POSTGRES_PASSWORD=$(cat "${POSTGRES_PASSWORD_FILE}")
POSTGRES_DB=$(cat "${POSTGRES_DB_FILE}")
ACCOUSTID_CLIENT=$(cat "${ACCOUSTID_CLIENT_FILE}")

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}?schema=public"
echo "DATABASE_URL=$DATABASE_URL" >> .env

POSTGRES_USER_TEST="${POSTGRES_USER}"
POSTGRES_PASSWORD_TEST="${POSTGRES_PASSWORD}"
POSTGRES_DB_TEST="${POSTGRES_DB}_test"
DATABASE_URL_TEST="postgresql://${POSTGRES_USER_TEST}:${POSTGRES_PASSWORD_TEST}@${POSTGRES_HOST}:5432/${POSTGRES_DB_TEST}?schema=public"
echo "DATABASE_URL=$DATABASE_URL_TEST" >> .env.test

echo "ACCOUSTID_CLIENT=$ACCOUSTID_CLIENT" >> .env
mkdir -p "$SONGS_DIR"
mkdir -p "$COVERT_ART_DIR"

npm install
npx prisma migrate dev --name init
npx prisma generate

if [ "$NODE_ENV" = "development" ]; then
    echo "Lancement de prisma en mode dev"
    npm run reset:dev
    npm run push:dev
    npm run seed:dev

    echo "Lancement de prisma en mode test"
    npm run reset:test
    npm run push:test

    npm run dev
else
    echo "Lancement en mode prod"
    npm start
fi