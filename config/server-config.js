const env = process.env.NODE_ENV; // 'local', 'dev', 'production'
require("dotenv").config();

const app = {
  secret: "secret-key-none-should-know",
  port: parseInt(process.env.PORT) || 5000,
  temp_directory: "judgingengine/temp/uploads",
  cors_client_url:
    env === "production"
      ? process.env.PRODUCTION_CORS_CLIENT_URL
      : process.env.LOCAL_CORS_CLIENT_URL,
};
const local = {
  app: app,
  db: {
    user: process.env.LOCAL_PG_USER,
    password: process.env.LOCAL_PG_PASSWORD,
    host: process.env.LOCAL_PG_HOST,
    port: parseInt(process.env.LOCAL_PG_PORT),
    name: process.env.LOCAL_PG_DATABASE,
  },
};
const production = {
  app: app,
  db: {
    // WARNING: DO NOT MAINTAIN PRODUCTION DATABASE INFORMATION HERE
    host: process.env.PROD_DB_HOST,
    //port: parseInt(process.env.PROD_DB_PORT),
    name: process.env.PROD_DB_NAME,
  },
};

const config = {
  local,
  production,
};

module.exports = config[env || "local"];
