#!/bin/sh
ENV=${ENV:-PROD}

# Change to the app directory

npx prisma generate

if [ "$ENV" = "PROD" ]
then
    cd /app
    npm run build
    npm run start:migrate:prod
else
    npm run start:migrate:dev
fi
