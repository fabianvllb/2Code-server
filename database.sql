-- CREATE USER tocode WITH PASSWORD 'letscode';

-- CREATE DATABASE tocodeapp WITH OWNER tocode;

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "firstname" VARCHAR(255) NOT NULL,
  "lastname" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) NOT NULL DEFAULT 'user',
  "timecreated" DATE NOT NULL
);
-- ALTER TABLE public.user DROP COLUMN hash, salt;
  /*"hash" TEXT NOT NULL,
  "salt" TEXT NOT NULL*/

  
CREATE TABLE "problem" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "uniquename" VARCHAR(255) UNIQUE NOT NULL,
  "description" TEXT,
  "help" TEXT,
  "tests" TEXT,
  "authorid" INTEGER NOT NULL,
  "jsmain" TEXT,
  "cmain" TEXT,
  "javamain" TEXT,
  "difficulty" VARCHAR(255) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "timecreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "submission" (
  "id" SERIAL PRIMARY KEY,
  "problemId" INTEGER NOT NULL,
  "language" TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  "solution" TEXT,
  "status" VARCHAR(255) NOT NULL DEFAULT 'pending',
  "runtime" REAL,
  "timeupdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "timesubmitted" TIMESTAMP(3)
);

CREATE TABLE "note" (
  "id" SERIAL PRIMARY KEY,
  "problemid" INTEGER NOT NULL,
  "authorid" INTEGER NOT NULL,
  "content" TEXT
);
-- CREATE TABLE "usertest" (
--   "id" SERIAL PRIMARY KEY,
--   "email" VARCHAR(255) UNIQUE NOT NULL,
--   "hash" TEXT NOT NULL,
--   "salt" TEXT NOT NULL
-- );

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tocode;

-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tocode;

/*change 08/08: added two new columns "help" and "tests" to problems table. Already modified at the table's first create at l.19*/
-- ALTER TABLE public.problem ADD help TEXT [];
-- ALTER TABLE public.problem ADD tests TEXT;

/*change 19/08: added isVerified column on user table. */
-- ALTER TABLE public.user add isverified BOOLEAN NOT NULL DEFAULT false; 