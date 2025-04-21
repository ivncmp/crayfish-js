#!/bin/sh

rm -rf dist
rm -rf node_modules
rm -rf crayfish-js*tgz

npm install
npm run build

cp package.json dist/framework
cp README.md dist/framework