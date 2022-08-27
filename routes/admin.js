const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const admin_controller = require("../controllers/admin");

router.post(
  "/signin",
  [
    // check email
    body("email").isEmail().withMessage("Usuario incorrecto"),
    // check password
    body("password")
      .not()
      .isEmpty()
      .withMessage("Contraseña no puede estar vacía"),
  ],
  admin_controller.admin_signin
);

router.post(
  "/signin",
  [
    // check email
    body("email").isEmail().withMessage("Usuario incorrecto"),
  ],
  admin_controller.admin_checkIsAdmin
);

module.exports = router;
