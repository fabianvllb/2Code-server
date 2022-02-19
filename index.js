const express = require("express");
const cors = require("cors");
const app = express();
//const bodyParser = require("body-parser");
//const pool = require("./db");
const routes = require("./routes/routes");

app.use(cors());
app.use(express.json());
//app.use(express.urlencoded());

/*app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);*/

//Login Routes
app.use(routes);

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
