#!/bin/sh
set -e

echo "E2E Test Docker Image"
echo "This image was built by the Docker Build Action"
echo "Test successful!"

if [ "$1" = "sleep" ]; then
  echo "Sleeping..."
  sleep infinity
fi

exec "$@"
