const { Pool } = require("pg");
const config = require("../config/server-config");

// postgres url
const {
  db: { user, password, host, port, name },
} = config;

const localConfig = `postgres://${user}:${password}@${host}:${port}/${name}`;

const prodConfig = process.env.DATABASE_URL; //heroku

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? prodConfig : localConfig,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.log("pg conection error", err.stack);
  } else {
    console.log("pg connection successful");
  }
});

module.exports = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      throw err;
    }
  },
};
