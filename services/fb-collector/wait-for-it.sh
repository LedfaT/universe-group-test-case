#!/usr/bin/env bash

set -e

host="$1"
shift
cmd="$@"

echo $host
while [ "$(curl -s -o /dev/null -w ''%{http_code}'' $host)" != "200" ]; do
  >&2 echo "Host $host is unavailable - sleeping"
  sleep 3
done

>&2 echo "Host $host is up - executing command"
exec $cmd
