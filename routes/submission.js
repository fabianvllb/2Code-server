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

//router.get("/:id", submission_controller.submission_readone);

//router.put("/:id", submission_controller.submission_update);

//router.delete("/:id", submission_controller.submission_delete);

//router.get("/one/:keys", submission_controller.submission_findByKeys);

//router.put("/:names", submission_controller.submission_update); //esta es equivalente a la linea de abajo
//router.get("/all/:names", submission_controller.submission_all);

router.post("/run", submission_controller.submission_run);

module.exports = router;
