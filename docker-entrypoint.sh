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
  # echo "Applying Prisma migrations..."
RUN npx prisma generate
mapfile -t MIGRATION_STATUS < <(npx prisma migrate status)
RANDOM_STRING=$(openssl rand -hex 5)  
echo "Migration status: $MIGRATION_STATUS"
echo "Migrations count: $MIGRATION_COUNT"

  if [[ $MIGRATION_STATUS == *"Database schema is up to date"* ]]; then
    echo "Prisma migrations are up to date. Skipping migrations and seeding."
  else
    echo "Applying Prisma migrations..."
    npx prisma migrate dev --name init_$RANDOM_STRING
    echo "Seeding database..."
    npx prisma db seed
  fi

else
  echo "Skipping Prisma migrations due to unreachable database."
fi

# Execute the main command
exec "$@"
