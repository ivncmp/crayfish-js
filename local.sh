#!/bin/sh

./build.sh

cd dist

npm uninstall -g crayfish-js
npm install -g .