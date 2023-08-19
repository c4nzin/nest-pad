<h2 align="center">!!!!! DOCUMENTATION IS STILL IN PROGRESS %30 DONE</h2>

<br/>
  <p align="center">
    A quick brief about the project
    <br/>
    <br/>
    <a href="https://github.com/CANMERTINYO/memo-pal"><strong>Explore the repo »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/CANMERTINYO/memo-pal">View Demo</a>
    .
    <a href="https://github.com/CANMERTINYO/memo-pal/issues">Report Bug</a>
    .
    <a href="https://github.com/CANMERTINYO/memo-pal/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/CANMERTINYO/memo-pal?color=dark-green) ![Forks](https://img.shields.io/github/forks/CANMERTINYO/memo-pal?style=social) ![Stargazers](https://img.shields.io/github/stars/CANMERTINYO/memo-pal?style=social) ![Issues](https://img.shields.io/github/issues/CANMERTINYO/memo-pal) ![License](https://img.shields.io/github/license/CANMERTINYO/memo-pal) 

## Table Of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Overall View](#overall-view)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [License](#license)
* [Authors](#authors)

## Overall view

* [Authorization Layer]()
  <ul>
    <li>POST: Register</li>
    <li>POST: Login</li>
    <li>GET: Logout</li>
    <li>GET: 1Refresh</li>
  </ul>

* [Notepad Endpoints]()
  <ul>
    <li>Create</li>
    <li>Update</li>
    <li>Delete</li>
    <li>Get by id</li>
  </ul>


## Authorization Layer View
[Register]()
```json
{
     //Register a user
    "email":"example@gmail.com",
    "username":"canmertinyo",
    "password":"cyberpunkisthebest"
}

     //Received response from the api :
{
    "message": "Sucessfully registered",
    "statusCode": 201,
    "method": "POST",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGUwYjg2OWUyZWEwMGU1MWZmN2U1OTkiLCJ1c2VybmFtZSI6InNxdWFsY2FuMTMzNyIsImlhdCI6MTY5MjQ0ODg3MywiZXhwIjoxNjkyNDQ5NzczfQ.VRjIoqoUFDP6ggmT_Vmt7aNMZ0D7v33UbSKOwr43yV4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGUwYjg2OWUyZWEwMGU1MWZmN2U1OTkiLCJ1c2VybmFtZSI6InNxdWFsY2FuMTMzNyIsImlhdCI6MTY5MjQ0ODg3MywiZXhwIjoxNjkyNTM1MjczfQ.SWTEPilu0n0oGWxUZsastLBoFcwV4u2SriDlEmWvlZw"
    }
```

[Login]()
```json
{
    //Login user
    "username":"squalcan1337",
    "password":"smack1919"
}

{
    //Received response from the api
    "message": "Sucessfully logged in",
    "statusCode": 201,
    "method": "POST",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGUwYjg2OWUyZWEwMGU1MWZmN2U1OTkiLCJ1c2VybmFtZSI6InNxdWFsY2FuMTMzNyIsImlhdCI6MTY5MjQ0OTAwMCwiZXhwIjoxNjkyNDQ5OTAwfQ.ru2osa4qnXPHm_5YTaiqo48IjACwU_EoIRZHe1LFwzo",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGUwYjg2OWUyZWEwMGU1MWZmN2U1OTkiLCJ1c2VybmFtZSI6InNxdWFsY2FuMTMzNyIsImlhdCI6MTY5MjQ0OTAwMCwiZXhwIjoxNjkyNTM1NDAwfQ.ebN5qyU1YoRh4mZdrEslyZ1Ofd-I1JjSk5x7xMs915w"
    }
}

```

[Logout]()

If you send a <b>GET</b> request to the <b>"logout"</b> endpoint, it will automatically terminate your current session.
```json
{
    //The response from api
    "message": "Sucessfully logged out",
    "statusCode": 200,
    "method": "GET"
}
```

[Refresh]()

If you send a <b>GET</b> request to the <b>"refresh"</b> endpoint, it will automatically refresh your current token.
```json
{
    //The response from api
    "message": "Sucessfully refreshed the token",
    "statusCode": 200,
    "method": "GET"
}
```
## Getting Started


To get a local copy up and running follow these simple example steps.

### Installation

1. To use the project, you need to download a copy of it.

2. Clone the repo

```sh
git clone https://github.com/canmertinyo/memo-pal.git
```

3. Install NPM packages

```sh
npm install
```

4. Setting up the enviroments
First, do the following steps : 
rename .env.template => .env

```JS
PORT = 3000
DB_URI = YOUR DATABASE URI 
GLOBAL_PREFIX = api
JWT_ACCESS_SECRET = YOUR SECRET CODE
JWT_REFRESH_SECRET = YOUR REFRESH SECRET CODE
EXPIRES_IN = 15m
REFRESH_TIME = 1d
```

5. Starting up the project
   
Dev:
```sh
npm run start:dev
```
Production:
```sh
npm run build && npm run start:prod
```

## Usage
Annotations/Contents will be added here later.

## Roadmap
Annotations/Contents will be added here later.


## License

Distributed under the MIT License. See [LICENSE](https://github.com/CANMERTINYO/memo-pal/blob/main/LICENSE.md) for more information.

## Authors

[CANMERTINYO](https://github.com/canmertinyo/)


