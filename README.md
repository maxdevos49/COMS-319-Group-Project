# B.R.T.D. (Battle Royal Top Down Shooter)

### Authors:
 - Maxwell Devos
 - Mason Timmerman
 - Joesph Naberhaus
 - John Jago

## Instructions
To get started first make sure you have `Node.js 10` installed. To do this you can use the command
```
$ node -v
```
Second you will want to make sure all the node modules for the project are installed and also default .env file is generated. The command to do this is:
```
$ npm run setup
```
At this point you should be ready to run the server. To do this use the command;
```
$ npm run dev
```
This will start a server that can be accessed on the default port of `8080`. It will also use nodemon to watch for any changes to files and recompile and restart server when it sees any.

## Deploying to Heroku
```
$ heroku create
$ git push heroku master
$ heroku open
```


