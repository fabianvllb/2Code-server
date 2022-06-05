const express = require("express");
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const authentication_controller = require("../controllers/authentication");

router.get("/", function (req, res) {
  res.json({ message: "Welcome to Auth :/" });
});

router.post(
  "/signup",
  [
    // check email
    check("email").isEmail().withMessage("La direccion email es invalida"),
    // check username
    /*check("username")
      .isLength({ min: 4 })
      .withMessage("El nombre de usuario debe ser de al menos 4 caracteres"),*/
    // check password
    check("password")
      .isLength({ min: 6 })
      .withMessage("La contrasena debe ser de al menos 6 caracteres")
      .matches(/\d/)
      .withMessage("La contrasena debe contener al menos un numero"),
  ],
  //[body("email").isEmail(), body("password").isLength({ min: 5 })],
  authentication_controller.signup
);

// auto login, remember me function
//router.post("/autologin", authentication_controller.autologin);

// manual login
router.post(
  "/login",
  [
    // check email
    check("email").not().isEmpty().withMessage("Usuario no puede estar vacio"),
    // check password
    check("password")
      .not()
      .isEmpty()
      .withMessage("Contrasena no puede estar vacia"),
  ],
  authentication_controller.login
);

// logout
router.post("/logout", authentication_controller.logout);

/*router.post(
  "/update",
  [
    // check _id
    check("_id").not().isEmpty().withMessage("El ID de usuario esta vacio"),
    // check username
    check("username")
      .isLength({ min: 4 })
      .withMessage("El nombre de usuario debe ser de al menos 4 caracteres"),
    // check email
    check("email").isEmail().withMessage("La direccion email es invalida"),
  ],
  authentication_controller.update
);*/

/*router.post(
  "/resetpwd",
  [
    // check username
    check("username")
      .not()
      .isEmpty()
      .withMessage("Usuario no puede estar vacio"),
    // check current password
    check("password")
      .not()
      .isEmpty()
      .withMessage("Contrasena no puede estar vacia"),
    // check new password
    check("newpwd")
      .not()
      .isEmpty()
      .withMessage("La nueva contrasena no puede estar vacia")
      .isLength({ min: 6 })
      .withMessage("La contrasena debe ser de al menos 6 caracteres")
      .matches(/\d/)
      .withMessage("La contrasena debe contener al menos un numero"),
    // check confirm password
    check("confirmpwd")
      .not()
      .isEmpty()
      .withMessage("Contrasena no puede estar vacia"),
    // check confirm password
    check("confirmpwd").custom((value, { req }) => {
      if (value !== req.body.newpwd) {
        throw new Error("Las contrasenas no coinciden");
      }
      return true;
    }),
  ],
  authentication_controller.resetpwd
);*/

module.exports = router;
