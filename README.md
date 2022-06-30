# CurrentMe WebSite
This repository hold all the code behind a webshop implemented using React, Typescript, Node.js and express.

The project was a part of the ITU course *Frameworks and architectures for the web*, and was made in
collaboration with jato, jvia, rywi and jskb.

## Website images
![Mixed Images From Site](http://cdn.thinglink.me/api/image/479353026285404161/1024/10/scaletowidth/0/0/1/1/false/true?wait=true)

The webshop consists of a React frontend end a RESTAPI. For further information check the report.

## Building the website with bash
Node.js is required to use npm and launch the site.
### Step 1 
// navigate into the WebApi and install dependencies

cd WebApi

npm install

### Step 2 // build the backend
npm run build

### Step 3 
// navigate to the compiled folder and start up server

cd compiled

node index.js

### Step 4 
// open a new terminal, navigate to frontend-app and install dependencies

cd frontend-app

npm install

### Step 5 // start the application
npm start
