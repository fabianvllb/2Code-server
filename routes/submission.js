var express = require("express");
var router = express.Router();

var submission_controller = require("../controllers/submission");
const { route } = require("./authentication");

// questions
router.get("/problems", submission_controller.problem_all);
//router.get("/question/:keys", submission_controller.question_findByKeys);

//get all submissions for a user id
router.get("/all/:id", submission_controller.submission_userAll);

// submissions
router.post("/", submission_controller.submission_create);

router.post("/data", submission_controller.submission_readone);

router.post("/save", submission_controller.submission_save);

router.post("/run", submission_controller.submission_run);

module.exports = router;
