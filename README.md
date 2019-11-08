[![CircleCI](https://circleci.com/gh/bmuthoga/warbler-server.svg?style=svg)](https://circleci.com/gh/bmuthoga/warbler-server)

# Warbler Server
A repository containing the backend API for Warbler

The API can be accessed from this [URL](https://warbler-server-bm.herokuapp.com)

## Setup
Clone this repository

```git clone https://github.com/bmuthoga/warbler-server.git```

Navigate into its root directory

```cd ./warbler-server```

Install dependencies

```yarn```

Create a `.env` file and set the following required environment variables in it:

| VARIABLE        | VALUE           | DESCRIPTION                        |
| --------------- |----------------:| ----------------------------------:|
| SECRET_KEY      |                 | The secret key to be used to sign and verify JWT tokens |
| NODE_ENV        | development     | To set mongoose debug to true for development environments |



## Running Tests
```yarn test```

## Built With
[NPM](https://www.npmjs.com/) - Dependency Management

[NodeJS](https://nodejs.org/) - Javascript Run-Time Environment

[ExpressJS](https://expressjs.com/) - Web Application Framework for NodeJS

[Mongoose](https://mongoosejs.com/) - Mongodb Object Modeling for NodeJS

## Usage
To start the server
```node index.js```

**API Endpoints**

`POST /api/auth/signin`	Log in a user	

`POST /api/auth/signup`	Register a new user	

`POST /api/users/<user_id>/messages`	Create a new message	

`GET /api/messages`	List all messages

`GET /api/users/<user_id>/messages/<message_id>`	Fetch a specific message

`DELETE /api/users/<user_id>/messages/<message_id>`	Delete a specific message

## Authors
[Batian Muthoga](https://github.com/bmuthoga)

## License
This project is licensed under the ISC License
