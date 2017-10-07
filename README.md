This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Is Dustin's Car Working
App shows the status of Dustin's car based off a call to a URL.  
Currently the URL does not exists so it shows it being not working all the time.  Which who knows, might be close.  
App is overkill it's just using react, redux, sagas to literally show a car image with or without a denied sign.  
Oh yea and it has a service worker for what?!  Get some, will update that soonish


Site is at  
https://isdustinscarworking.com


### setup
Install [docker](https://www.docker.com/)  
run
```
docker-compose up
```

build
```
NPM_TASK=build docker-compose up
```

Open your browser to http://localhost:3000/ 


### develop
Run using docker or make sure you have [node](https://nodejs.org/) v8 latest and [yarn](https://yarnpkg.com/)  
Install with
```
yarn install
```

src -> code for the app

src/confg.js -> Not in repo (yet..?) API url

scripts/config.js -> s3 app creds, region and bucket name, will not be in repo




