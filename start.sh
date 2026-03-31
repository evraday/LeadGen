#!/bin/sh
# Wait for MongoDB to be available
echo "Waiting for MongoDB..."
while ! nc -z mongo 27017; do
  sleep 1
done
echo "MongoDB is up!"

# Start the Next.js app
exec npm start
