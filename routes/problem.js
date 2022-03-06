var express = require("express");
var router = express.Router();
//const passport = require("passport"); // Because of the OPTIONS request, we can't add authorization check in the index.js, we have to apply it here, one by one.
var problem_controller = require("../controllers/problem");

router.post("/", problem_controller.question_create);

router.get("/:id", problem_controller.question_readone);

//router.put("/:id", problem_controller.question_update);

//router.delete("/:id", problem_controller.question_delete);

//autenticacion necesaria para ver la lista de usuarios. Posiblemente no necesario.
router.get(
  "/",
  //passport.authenticate("jwt", { session: false }),
  problem_controller.question_all
);

module.exports = router;
