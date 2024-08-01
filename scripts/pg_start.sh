#!/usr/bin/env bash

docker run --rm --name postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres:12.17-alpine
