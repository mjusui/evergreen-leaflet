#!/bin/bash
set -eou pipefail


dir=$(dirname $0)
cd $dir

dest=${1:-$dir}

for f in *.mjs
do
  path=$dest/${f%.mjs}
  node $f > $path
  echo $path
done
