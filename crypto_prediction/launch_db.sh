#!/usr/bin/env bash

TAG="cryptopostgres"
docker rm -f "$TAG"
docker build . -t "$TAG"
docker run --name "$TAG" -p 5432:5432 "$TAG"