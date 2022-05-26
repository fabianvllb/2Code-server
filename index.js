const express = require("express");
const cors = require("cors");
var path = require("path");
var morgan = require("morgan");
var FileApi = require("./api/FileApi");
var config = require("./config/server-config");
var bodyParser = require("body-parser");

// Create working directory
console.log(config);
const {
  app: { port, cors_client_url, temp_directory },
} = config;
const tempDir = path.resolve(__dirname, temp_directory);
FileApi.creatDirectory(tempDir, (err, message) => {
  if (err) {
    console.log(err);
  } else {
    console.log(message);
  }
});
// Bring in the data model
//require("./models/mongodb");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// logging
app.use(morgan("short"));

// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
var routes = require("./routes");
// Use the API routes when path starts with /api
app.use("/api", routes);

// Error handling
/*app.use(function(err, req, res, next) {
  // error level logging
  winston.error(winston.combinedFormat(err, req, res));
  winston.writeError(err);

  //console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({
      message:
        err.name + ": " + err.message ||
        " You have no authorization to view this page!"
    });
  }

  next(err, req, res, next);
});*/

// development error handler, will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"));
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

//app.use(express.json());
//app.use(express.urlencoded());

app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});
