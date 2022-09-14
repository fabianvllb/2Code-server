const express = require("express");
const router = express.Router();
const authentication = require("./authentication");
const problem = require("./problem");
const submission = require("./submission");
const user = require("./user");
const admin = require("./admin");
const note = require("./note");

// test route to make sure everything is working (accessed at GET http://localhost:5000/api)
router.get("/", function (req, res) {
  res.json({ message: "Welcome to 2Code api!" });
});

router.use("/authentication", authentication);
router.use("/problem", problem);
router.use("/submission", submission);
router.use("/user", user);
router.use("/admin", admin);
router.use("/note", note);

module.exports = router;
