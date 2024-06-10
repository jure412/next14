#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Print environment variables for debugging
echo "Loaded environment variables:"
echo "POSTGRES_HOST=$POSTGRES_HOST"
echo "POSTGRES_PORT=$POSTGRES_PORT"
echo "POSTGRES_USER=$POSTGRES_USER"
echo "POSTGRES_DB=$POSTGRES_DB"

MAX_ATTEMPTS=5

# Function to check if the database is reachable
check_db() {
  PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c '\q' 2>&1
  return $?
}

# Loop to check if the database server is running
for i in $(seq 1 $MAX_ATTEMPTS); do
  echo "Attempt $i/$MAX_ATTEMPTS: Checking if PostgreSQL is ready on -h $POSTGRES_HOST -p $POSTGRES_PORT -d $POSTGRES_DB -U $POSTGRES_USER..."
  check_db
  result=$?
  echo "Result: $result"

  if [ $result -eq 0 ]; then
    echo "PostgreSQL is ready and reachable."
    db_reachable=true
    break
  else
    echo "PostgreSQL is not ready or reachable."
    if [ $i -eq $MAX_ATTEMPTS ]; then
      echo "Max attempts reached. Exiting."
      db_reachable=false
    else
      echo "Retrying in 10 seconds..."
      sleep 10s
    fi
  fi
done

if [ "$db_reachable" = true ]; then
  echo "Applying Prisma migrations..."
  # npx prisma migrate dev --name init
  # Check if the prisma/migrations folder exists and is not empty
  # if [ -d "prisma/migrations" ] && [ -n "$(ls -A prisma/migrations)" ]; then
  # If migrations exist, create a new one
  # echo "Applying Prisma migrations...   npx prisma migrate dev --name init"
  # npx prisma migrate deploy
  npx prisma migrate dev --name init

  # else
  #   # If no migrations exist, run the latest one
  #   echo "Applying Prisma migrations...      npx prisma migrate deploy"
  #   npx prisma migrate deploy
  # fi
else
  echo "Skipping Prisma migrations due to unreachable database."
fi

# Execute the main command
exec "$@"
