# Alliance-search-system-server

Node.js back-end for a [Swapi](https://swapi.dev/) search engine using [Hapi framework](https://hapi.dev) + TypeScript.  
Client side will come later.

## Demo

### Demo link

https://alliance-search-system.ew.r.appspot.com

### Get auth token

Send a `POST` request to `/auth` with the stringified data in the body:
```json
// request body with valid information: 
{
    "username": "Luke",
    "password": "Skywalker"
}

// response:
{
    "success": true,
    "token": "[TOKEN]"
}
```

Then attach the token to the Authorization header of your HTTP requests. It gives access to every route for 1 hour until expiration.

## About

Files architecture may be unusual as I did some experiments. Basically the routes are generated in controller classes by the methods decorated by \@Route.  
For this repo to work it must be provided a `.env` file at the root with the following variables:
```conf
/.env file

AUTH_USERNAME = "[any string]"
AUTH_PASSWORD = "[bcrypt hash]"
JWT_SECRET_KEY = "[any string]"
```

Authentication is made using JWT + Bcrypt.  
Username and crypted password are simply stored in environment variables as there is no need for multiple users or user-generated passwords.

## Routes

### Auth routes

* route: `POST /auth`

Expects a stringified json in the body with a `username` and a  `password`

### Search routes

#### Examples

* By name: `GET /search?name=star`
* By name with category filter: `GET /search?name=star&cat=planets`
* By name with multiple category filters : `GET /search?name=star&cat=planets,vehicles`
* By name, results in Wookiee: `GET /search?name=star&wookiee=true`

### Single entity routes

`GET /entity/{category}/{id}`

#### Examples

* Luke Skywalker: `/people/1`
* Death Star: `/starships/9`

#### Available categories

* people
* planets
* species
* starships
* vehicles