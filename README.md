# loopback-framework-practice
This repository contains the source code related to loopback framework practice

Added authentication functionality to access User APIs using JWT

#Register User before generating the token to access the APIs
The API (/app/registerUser) will add the user for authentication purpose.
It takes two fields in input. Sample payload is as below
{
"email": "abcd#efgh.com",
"password": "Abcd1234" // It should be minimum of 8 characters
}
After registering we need to generate the token using /app/authenticate API

#Token Generation API
The API (/app/authenticate) will generate the authentication token for accessing APIs
Pass the registered email and password as request body to the API and it will respond with the token

Request body: {
"email": "abcd#efgh.com",
"password": "Abcd1234"
}

Response body: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4MWE1MWZkLWFlNDUtNGJjOS1hOTkzLWYxMjAzYzVmZjkzNCIsImVtYWlsIjoieW91c3VmM0BnbWFpbC5jb20iLCJpYXQiOjE2NTkwMjMwOTksImV4cCI6MTY1OTA0NDY5OX0.AZ8S5FD9G7tYMsDGT7YEl_rZZDxeMlNyV4ZjCj8K8bU"
}

Using the token authorize yourself and access the APIs. 
