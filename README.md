# B.R.T.D. (Battle Royal Top Down Shooter)

[GitLab badges](https://docs.gitlab.com/ee/user/project/badges.html) + [Shields.io](https://shields.io/)

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

## Running the test suite

```
npm run test
```

## Deploying to Heroku for personal testing
(Heroku CLI needed)
```
$ heroku create
$ git push heroku <branch-name>:master
$ heroku open
```

## Deployment Links
 - Newest commit: [https://staging-cs319.herokuapp.com](https://staging-cs319.herokuapp.com)
 - Develop Branch: [https://dev-cs319.herokuapp.com](https://dev-cs319.herokuapp.com)
 - Master Branch: [https://prod-cs319.herokuapp.com](https://prod-cs319.herokuapp.com)
 