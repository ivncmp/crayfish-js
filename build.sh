#!/bin/sh

rm -rf dist
rm -rf node_modules
rm -rf crayfish-js*tgz

npm install
npm run build

mv dist/cli dist/framework/cli
mv dist/tools dist/framework/tools
mv dist/templates dist/framework/templates
mv dist/framework/* dist

cp package.json dist
cp README.md dist

rm -rf dist/framework