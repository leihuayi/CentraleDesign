## Presentation
Website for ordering design works for the student association CSDesign.
Click on the caption below for a demo video.
[![Demo](http://img.youtube.com/vi/MP0xln9Hpjw/0.jpg)](https://www.youtube.com/watch?v=MP0xln9Hpjw "Webiste CSDesign")
## Global packages requirements

- node v4.x (see NodeJS website)
- npm 2.x (with NodeJS)
- forever (npm package): run a node web server in background
- mysql if you use a test database

## Usage

Build:
1. (sudo) ```npm install```
2. ```./node_modules/bower/bin/bower install```
Start the web server:
3. (Local) To change the environment variables create a config.json file and update the variables if needed. Default: 
  * Server: localhost:8888
  * Database: localhost:3306
4. (sudo) ```npm start```

## Backend Organization

- config : config files for general working of the website (db, translations, authentication ..)
- locales : translation files
- order, user: One folder per table in database.

## Translation :

For use in backend and jade views, check documentation : https://github.com/mashpie/i18n-node
For use in frontend js files, use the json variable translation
Ex:
  - Backend: (routes.js)   req.__("name") -> "Name "
  - View: (profile.jade)   #{lang.__("name")} -> "Name "
  - Frontend js : ui/index.js  translation.name -> "Name "
