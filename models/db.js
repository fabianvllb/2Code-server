const { Pool } = require("pg");
const config = require("../config/server-config");

//let gracefulShutdown;
// postgres url
const {
  db: { user, password, host, port, name },
} = config;

const localConfig = `postgres://${user}:${password}@${host}:${port}/${name}`;

const prodConfig = process.env.DATABASE_URL; //heroku

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? prodConfig : localConfig,
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
      //console.log(res.rows[0]);
      return res;
    } catch (err) {
      //console.log(err.stack);
      throw err;
    }
  },
};
