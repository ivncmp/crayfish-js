#!/bin/sh

rm -rf dist
rm -rf node_modules
rm -rf crayfish-js*tgz

npm install
npm run build

npm uninstall -g crayfish-js
npm install -g .

cp package.json dist/framework