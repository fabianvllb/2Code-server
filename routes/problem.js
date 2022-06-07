var express = require("express");
var router = express.Router();
//const passport = require("passport"); // Because of the OPTIONS request, we can't add authorization check in the index.js, we have to apply it here, one by one.
var problem_controller = require("../controllers/problem");
const { body, check, validationResult } = require("express-validator");

router.post("/", problem_controller.question_create);

router.get("/:id", problem_controller.question_readone);

router.put(
  "/:id",
  [
    check("title").not().isEmpty().withMessage("title cannot be empty"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("description cannot be empty"),
    check("difficulty")
      .not()
      .isEmpty()
      .withMessage("difficulty cannot be empty"),
    check("active").not().isEmpty().withMessage("active cannot be empty"),
    check("active").isBoolean().withMessage("active must be a boolean"),
  ],
  problem_controller.question_update
);

//router.delete("/:id", problem_controller.question_delete);

//autenticacion necesaria para ver la lista de usuarios. Posiblemente no necesario.
router.get(
  "/",
  //passport.authenticate("jwt", { session: false }),
  problem_controller.question_all
);

module.exports = router;
