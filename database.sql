CREATE DATABASE 2code;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email text UNIQUE,
  firstname text,
  lastname text,
  role text
);

CREATE TABLE logins (
  id SERIAL PRIMARY KEY,
  username text,
  passwordsalt text,
  passwordhash text,
);