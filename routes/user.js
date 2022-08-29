var express = require("express");
var router = express.Router();

var user_controller = require("../controllers/user");
const { check } = require("express-validator");

router.get("/all", user_controller.user_readAllUsers);

router.get("/:id", user_controller.user_readOne);

router.put("/:id", user_controller.user_updateOne);

router.post("/check", user_controller.user_readoneFromEmail);

router.post("/problems", user_controller.user_readAllProblems);

module.exports = router;
//[check("email").isEmail().withMessage("not an email")],
