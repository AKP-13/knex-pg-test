#!/usr/bin/env bash
set -e

echo "Creates a new .env file"

rm -f .env

echo "POSTGRES_HOST=127.0.0.1" >>.env
echo "POSTGRES_PORT=5432" >>.env
echo "POSTGRES_DB=postgres" >>.env
echo "POSTGRES_USER=postgres" >>.env
echo "POSTGRES_PASSWORD=mysecretpassword" >>.env
