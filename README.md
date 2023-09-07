# TaskAssessment
GraphQL, Node.js, Appolo Server, Typescript, and PostgreSQL
created a simple GraphQL API for managing a list of movies. I have used Node.js with the Apollo GraphQL library to implement the API.
Users are able to register for an account with email and password. Passwords are hashed.
Users are able to log into the API with their email and password and receive a JWT token.
API accepts JWT tokens in headers to authenticate requests.
Only authenticated users are able to perform Create, Update, or Delete operations on movies.
