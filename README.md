# Authentication-Nodejs-CN

## Setting up the project
1. Install Redis according to your OS

    Visit link: https://redis.io/

2. Clone the Repository and run below command to install the dependencies

    ` npm install `

3. setup the envirent variable
    
    1. .env-example file is provided in code
    2. create a new .env file
    3. copy all the variables from .env-example file to .env file
        `.env-example > .env`
    4. setup all the credentials according to there use

## Running the project

That all you need to setup the project !!

Run below command to start the server

> `npm start`

Note : Please check if your redis is running fine or not by running below command

> \> redis-cli ping

In reply redis will give response as

>pong

Then it should be fine.